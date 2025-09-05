'use client'

import React, { useState, useEffect } from 'react'
import Papa from 'papaparse'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface DiseaseRecord {
  'State': string
  'District': string
  'Disease': string
  'Year': number
  'Month': number
  'No_of_cases': number
  'No_of_deaths': number
}

const RecordBook = () => {
  const { t } = useTranslation()
  const [records, setRecords] = useState<DiseaseRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<DiseaseRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/northeast_states_disease_outbreaks.csv')
        const reader = response.body?.getReader()
        const result = await reader?.read()
        const decoder = new TextDecoder('utf-8')
        const csv = decoder.decode(result?.value)

        Papa.parse(csv, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            setRecords(results.data as DiseaseRecord[])
            setFilteredRecords(results.data as DiseaseRecord[])
          },
        })
      } catch (error) {
        console.error('Error fetching or parsing CSV data:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const results = records.filter(record =>
      record.Disease?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredRecords(results)
  }, [searchTerm, records])

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="bold-24 text-gray-90 mb-4">{t('record_book.title')}</h2>
      <input
        type="text"
        placeholder={t('record_book.search_placeholder')}
        className="w-full px-4 py-3 bg-gray-10 rounded-lg border border-gray-20 mb-4"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <motion.div className="overflow-x-auto max-h-96">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-primary-50">
              <th className="p-3">{t('record_book.disease_header')}</th>
              <th className="p-3">{t('record_book.state_header')}</th>
              <th className="p-3">{t('record_book.cases_header')}</th>
              <th className="p-3">{t('record_book.deaths_header')}</th>
              <th className="p-3">{t('record_book.year_header')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-10">
                <td className="p-3">{record.Disease}</td>
                <td className="p-3">{record.State}</td>
                <td className="p-3">{record.No_of_cases}</td>
                <td className="p-3">{record.No_of_deaths}</td>
                <td className="p-3">{record.Year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}

export default RecordBook

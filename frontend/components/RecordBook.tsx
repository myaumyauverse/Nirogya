'use client'

import React, { useState, useEffect } from 'react'
import Papa from 'papaparse'
import { motion } from 'framer-motion'

interface DiseaseRecord {
  'ID': number
  'Unique_ID': string
  'State_UT': string
  'District': string
  'Disease_Illness': string
  'No_of_Cases': number
  'No_of_Deaths': number
  'Date_of_Start_of_Outbreak': string
  'Date_of_Reporting': string
  'Current_Status': string
  'Comments_Action_Taken': string
  'Source_Table': number
  'Source_PDF': string
  'Northeast_State': string
}

const RecordBook = () => {
  const [records, setRecords] = useState<DiseaseRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<DiseaseRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/northeast_states_disease_outbreaks.csv')
        const csvText = await response.text()

        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const validRecords = results.data.filter((record: any) => 
              record && record.ID && record.State_UT && record.Disease_Illness
            ) as DiseaseRecord[]
            
            setRecords(validRecords)
            setFilteredRecords(validRecords)
            console.log(`Loaded ${validRecords.length} disease records`)
          },
          error: (error) => {
            console.error('Error parsing CSV:', error)
          }
        })
      } catch (error) {
        console.error('Error fetching CSV data:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const results = records.filter(record =>
      record.Disease_Illness?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.State_UT?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.District?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.Current_Status?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredRecords(results)
  }, [searchTerm, records])

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="bold-24 text-gray-90 mb-4">Disease Records</h2>
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by disease, state, district, or status..."
          className="flex-1 px-4 py-3 bg-gray-10 rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="text-sm text-gray-600 flex items-center">
          Showing {filteredRecords.length} of {records.length} records
        </div>
      </div>
      
      <motion.div className="overflow-x-auto max-h-96 border border-gray-200 rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-primary-50 sticky top-0">
            <tr>
              <th className="p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
              <th className="p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Disease</th>
              <th className="p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">State</th>
              <th className="p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">District</th>
              <th className="p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Cases</th>
              <th className="p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Deaths</th>
              <th className="p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Outbreak Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRecords.map((record, index) => (
              <tr key={record.ID || index} className="hover:bg-gray-50 transition-colors">
                <td className="p-3 text-sm text-gray-900">{record.ID}</td>
                <td className="p-3 text-sm">
                  <div className="font-medium text-gray-900">{record.Disease_Illness}</div>
                  <div className="text-xs text-gray-500">{record.Unique_ID}</div>
                </td>
                <td className="p-3 text-sm text-gray-900">{record.State_UT}</td>
                <td className="p-3 text-sm text-gray-900">{record.District}</td>
                <td className="p-3 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {record.No_of_Cases}
                  </span>
                </td>
                <td className="p-3 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    record.No_of_Deaths > 0 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {record.No_of_Deaths}
                  </span>
                </td>
                <td className="p-3 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    record.Current_Status === 'Under Control' 
                      ? 'bg-green-100 text-green-800'
                      : record.Current_Status === 'Under Surveillance'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {record.Current_Status}
                  </span>
                </td>
                <td className="p-3 text-sm text-gray-900">
                  {record.Date_of_Start_of_Outbreak ? 
                    new Date(record.Date_of_Start_of_Outbreak).toLocaleDateString() : 
                    'N/A'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredRecords.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No records found matching your search criteria.</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default RecordBook

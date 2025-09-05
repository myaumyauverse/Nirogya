'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import Button from './Button'
import { useTranslation } from 'react-i18next'

interface PredictionResult {
  month: string
  predicted_cases: number
  risk_level: string
}

const Prediction = () => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    No_of_Cases: 150,
    Northeast_State: 2,
    Start_of_Outbreak_Month: 7,
    ph: 8.5,
    dissolved_oxygen: 3.0,
    bod: 5.0,
    nitrate_n: 12.0,
    fecal_coliform: 80.0,
    total_coliform: 450.0,
    temperature: 28.0,
  })
  const [prediction, setPrediction] = useState<PredictionResult[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setPrediction(null)

    const requestData = {
      outbreak_data: {
        No_of_Cases: formData.No_of_Cases,
        Northeast_State: formData.Northeast_State,
        Start_of_Outbreak_Month: formData.Start_of_Outbreak_Month,
      },
      water_params: {
        ph: formData.ph,
        dissolved_oxygen: formData.dissolved_oxygen,
        bod: formData.bod,
        nitrate_n: formData.nitrate_n,
        fecal_coliform: formData.fecal_coliform,
        total_coliform: formData.total_coliform,
        temperature: formData.temperature,
      },
      months_ahead: 3,
    }

    try {
      const response = await axios.post('http://localhost:5000/api/future-trends', requestData)
      setPrediction(response.data.future_predictions)
    } catch (err) {
      setError(t('prediction.error'))
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="bold-24 text-gray-90 mb-4">{t('prediction.title')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="number" name="No_of_Cases" value={formData.No_of_Cases} onChange={handleChange} placeholder={t('prediction.cases_label')} className="w-full px-4 py-3 bg-gray-10 rounded-lg border border-gray-20" />
            <select name="Northeast_State" value={formData.Northeast_State} onChange={handleChange} className="w-full px-4 py-3 bg-gray-10 rounded-lg border border-gray-20">
                <option value={1}>Arunachal Pradesh</option>
                <option value={2}>Assam</option>
                <option value={3}>Manipur</option>
                <option value={4}>Meghalaya</option>
                <option value={5}>Mizoram</option>
                <option value={6}>Nagaland</option>
                <option value={7}>Sikkim</option>
                <option value={8}>Tripura</option>
            </select>
            <input type="number" name="Start_of_Outbreak_Month" value={formData.Start_of_Outbreak_Month} onChange={handleChange} placeholder={t('prediction.month_label')} className="w-full px-4 py-3 bg-gray-10 rounded-lg border border-gray-20" />

            <input type="number" name="ph" value={formData.ph} onChange={handleChange} placeholder={t('prediction.ph_label')} className="w-full px-4 py-3 bg-gray-10 rounded-lg border border-gray-20" />
            <input type="number" name="dissolved_oxygen" value={formData.dissolved_oxygen} onChange={handleChange} placeholder={t('prediction.do_label')} className="w-full px-4 py-3 bg-gray-10 rounded-lg border border-gray-20" />
            <input type="number" name="bod" value={formData.bod} onChange={handleChange} placeholder={t('prediction.bod_label')} className="w-full px-4 py-3 bg-gray-10 rounded-lg border border-gray-20" />
            <input type="number" name="nitrate_n" value={formData.nitrate_n} onChange={handleChange} placeholder={t('prediction.nitrate_label')} className="w-full px-4 py-3 bg-gray-10 rounded-lg border border-gray-20" />
            <input type="number" name="fecal_coliform" value={formData.fecal_coliform} onChange={handleChange} placeholder={t('prediction.fecal_coliform_label')} className="w-full px-4 py-3 bg-gray-10 rounded-lg border border-gray-20" />
            <input type="number" name="total_coliform" value={formData.total_coliform} onChange={handleChange} placeholder={t('prediction.total_coliform_label')} className="w-full px-4 py-3 bg-gray-10 rounded-lg border border-gray-20" />
            <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} placeholder={t('prediction.temp_label')} className="w-full px-4 py-3 bg-gray-10 rounded-lg border border-gray-20" />
        </div>
        <Button
            type="submit"
            title={isLoading ? t('prediction.predicting_button') : t('prediction.predict_button')}
            variant="btn_primary"
            disabled={isLoading}
        />
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {prediction && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="bold-20 text-gray-90 mb-2">{t('prediction.results_title')}</h3>
          <ul className="space-y-2">
            {prediction.map((p, index) => (
              <li key={index} className="p-3 bg-primary-50 rounded-lg">
                <span className="font-bold">{p.month}:</span> {p.predicted_cases.toFixed(2)} cases (Risk: {p.risk_level})
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  )
}

export default Prediction

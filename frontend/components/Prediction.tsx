'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import Button from './Button'

interface PredictionResult {
  month: string
  predicted_cases: number
  risk_level: string
}

const Prediction = () => {
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
      if (response.data.success) {
        setPrediction(response.data.future_predictions)
      } else {
        setError(response.data.error || 'Prediction failed')
      }
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else if (err.code === 'ECONNREFUSED') {
        setError('Backend server is not running. Please start the correlation API server.')
      } else {
        setError('Error occurred while making prediction')
      }
      console.error('Prediction error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="bold-24 text-gray-90 mb-4">Disease Prediction</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Outbreak Information Section */}
        <div className="bg-primary-50 p-4 rounded-lg">
          <h3 className="bold-18 text-gray-90 mb-3">📊 Outbreak Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block regular-14 text-gray-70 mb-1">Number of Cases</label>
              <input 
                type="number" 
                name="No_of_Cases" 
                value={formData.No_of_Cases} 
                onChange={handleChange} 
                placeholder="150" 
                min="0"
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500" 
              />
            </div>
            <div>
              <label className="block regular-14 text-gray-70 mb-1">Northeast State</label>
              <select 
                name="Northeast_State" 
                value={formData.Northeast_State} 
                onChange={handleChange} 
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={1}>Arunachal Pradesh</option>
                <option value={2}>Assam</option>
                <option value={3}>Manipur</option>
                <option value={4}>Meghalaya</option>
                <option value={5}>Mizoram</option>
                <option value={6}>Nagaland</option>
                <option value={7}>Sikkim</option>
                <option value={8}>Tripura</option>
              </select>
            </div>
            <div>
              <label className="block regular-14 text-gray-70 mb-1">Outbreak Month</label>
              <select 
                name="Start_of_Outbreak_Month" 
                value={formData.Start_of_Outbreak_Month} 
                onChange={handleChange} 
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={1}>January</option>
                <option value={2}>February</option>
                <option value={3}>March</option>
                <option value={4}>April</option>
                <option value={5}>May</option>
                <option value={6}>June</option>
                <option value={7}>July</option>
                <option value={8}>August</option>
                <option value={9}>September</option>
                <option value={10}>October</option>
                <option value={11}>November</option>
                <option value={12}>December</option>
              </select>
            </div>
          </div>
        </div>

        {/* Water Quality Parameters Section */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="bold-18 text-gray-90 mb-3">💧 Water Quality Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block regular-14 text-gray-70 mb-1">pH Level (6.0-9.5)</label>
              <input 
                type="number" 
                name="ph" 
                value={formData.ph} 
                onChange={handleChange} 
                placeholder="7.0" 
                min="6.0" 
                max="9.5" 
                step="0.1"
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500" 
              />
            </div>
            <div>
              <label className="block regular-14 text-gray-70 mb-1">Dissolved Oxygen (mg/L)</label>
              <input 
                type="number" 
                name="dissolved_oxygen" 
                value={formData.dissolved_oxygen} 
                onChange={handleChange} 
                placeholder="5.0" 
                min="0" 
                step="0.1"
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500" 
              />
            </div>
            <div>
              <label className="block regular-14 text-gray-70 mb-1">BOD (mg/L)</label>
              <input 
                type="number" 
                name="bod" 
                value={formData.bod} 
                onChange={handleChange} 
                placeholder="3.0" 
                min="0" 
                step="0.1"
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500" 
              />
            </div>
            <div>
              <label className="block regular-14 text-gray-70 mb-1">Nitrate-N (mg/L)</label>
              <input 
                type="number" 
                name="nitrate_n" 
                value={formData.nitrate_n} 
                onChange={handleChange} 
                placeholder="5.0" 
                min="0" 
                step="0.1"
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500" 
              />
            </div>
            <div>
              <label className="block regular-14 text-gray-70 mb-1">Fecal Coliform (CFU/100mL)</label>
              <input 
                type="number" 
                name="fecal_coliform" 
                value={formData.fecal_coliform} 
                onChange={handleChange} 
                placeholder="20" 
                min="0" 
                step="1"
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500" 
              />
            </div>
            <div>
              <label className="block regular-14 text-gray-70 mb-1">Total Coliform (CFU/100mL)</label>
              <input 
                type="number" 
                name="total_coliform" 
                value={formData.total_coliform} 
                onChange={handleChange} 
                placeholder="100" 
                min="0" 
                step="1"
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500" 
              />
            </div>
            <div>
              <label className="block regular-14 text-gray-70 mb-1">Temperature (°C)</label>
              <input 
                type="number" 
                name="temperature" 
                value={formData.temperature} 
                onChange={handleChange} 
                placeholder="25.0" 
                min="0" 
                max="50" 
                step="0.1"
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500" 
              />
            </div>
          </div>
        </div>
        <Button
            type="submit"
            title={isLoading ? "Predicting..." : "Predict Disease Outbreak"}
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
          <h3 className="bold-20 text-gray-90 mb-4">🔮 3-Month Future Predictions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(prediction).map(([monthKey, p]: [string, any], index) => {
              const monthNames = {1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
                                7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'}
              const riskColors = {
                'Low': 'bg-green-100 border-green-300 text-green-800',
                'Medium': 'bg-yellow-100 border-yellow-300 text-yellow-800',
                'High': 'bg-orange-100 border-orange-300 text-orange-800',
                'Critical': 'bg-red-100 border-red-300 text-red-800'
              }
              
              return (
                <div key={index} className={`p-4 rounded-lg border-2 ${riskColors[p.risk_level] || 'bg-gray-100 border-gray-300'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="bold-16">{monthNames[p.month] || `Month ${p.month}`}</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                      {p.risk_level}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold">Cases:</span> {p.predicted_cases}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Disease:</span> {p.most_likely_disease}
                    </p>
                    <p className="text-xs opacity-75">
                      Seasonal Factor: {p.seasonal_factor?.toFixed(2) || 'N/A'}
                    </p>
                    {p.recommendations && p.recommendations.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold mb-1">Key Action:</p>
                        <p className="text-xs opacity-75">{p.recommendations[0]}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Note:</span> These predictions are based on current outbreak data, 
              water quality parameters, and seasonal patterns. Results may vary based on intervention measures.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Prediction

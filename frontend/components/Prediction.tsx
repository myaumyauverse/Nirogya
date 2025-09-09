'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import Button from './Button'
import { useLanguage } from '@/contexts/LanguageContext'

interface PredictionResult {
  month: string
  predicted_cases: number
  risk_level: string
  most_likely_disease: string
  seasonal_factor: number
  recommendations: string[]
}

interface DiseaseCorrelationAnalysis {
  disease_prediction: {
    predicted_cases: number
    confidence: string
    most_likely_disease: string
    disease_probability: number
    method: string
  }
  water_assessment: {
    wqi: number
    quality_category: string
    quality_risk: string
    risk_factors: string[]
    critical_violations: string[]
  }
  correlation_analysis: {
    correlation_score: number
    correlation_strength: string
    combined_risk_level: string
    correlation_factors: string[]
    disease_water_match: boolean
    critical_intervention_needed: boolean
  }
  future_predictions: {[key: string]: PredictionResult}
  recommendations: string[]
  risk_scores: {
    disease_risk: number
    water_risk: number
    correlation_risk: number
    combined_risk: number
  }
  alert_level: string
  analysis_timestamp: string
}

interface FormData {
  No_of_Cases: number | string
  Northeast_State: number
  Start_of_Outbreak_Month: number
  ph: number | string
  dissolved_oxygen: number | string
  bod: number | string
  nitrate_n: number | string
  fecal_coliform: number | string
  total_coliform: number | string
  temperature: number | string
}

const Prediction = () => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<FormData>({
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
  const [analysis, setAnalysis] = useState<DiseaseCorrelationAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [alertSending, setAlertSending] = useState(false)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Handle empty values or invalid numbers
    if (value === '') {
      setFormData({ ...formData, [name]: '' })
    } else {
      const numericValue = parseFloat(value)
      // Only update if the parsed value is a valid number
      if (!isNaN(numericValue)) {
        setFormData({ ...formData, [name]: numericValue })
      }
      // If it's NaN, don't update the state (keep the previous valid value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setAnalysis(null)

    // Convert string values to numbers, using default values for empty strings
    const requestData = {
      outbreak_data: {
        No_of_Cases: typeof formData.No_of_Cases === 'string' && formData.No_of_Cases === '' ? 150 : Number(formData.No_of_Cases),
        Northeast_State: formData.Northeast_State,
        Start_of_Outbreak_Month: formData.Start_of_Outbreak_Month,
      },
      water_params: {
        ph: typeof formData.ph === 'string' && formData.ph === '' ? 8.5 : Number(formData.ph),
        dissolved_oxygen: typeof formData.dissolved_oxygen === 'string' && formData.dissolved_oxygen === '' ? 3.0 : Number(formData.dissolved_oxygen),
        bod: typeof formData.bod === 'string' && formData.bod === '' ? 5.0 : Number(formData.bod),
        nitrate_n: typeof formData.nitrate_n === 'string' && formData.nitrate_n === '' ? 12.0 : Number(formData.nitrate_n),
        fecal_coliform: typeof formData.fecal_coliform === 'string' && formData.fecal_coliform === '' ? 80.0 : Number(formData.fecal_coliform),
        total_coliform: typeof formData.total_coliform === 'string' && formData.total_coliform === '' ? 450.0 : Number(formData.total_coliform),
        temperature: typeof formData.temperature === 'string' && formData.temperature === '' ? 28.0 : Number(formData.temperature),
      },
      include_future: true,
      months_ahead: 3,
    }

    try {
      // Use the complete integrated analysis endpoint instead of just future-trends
      const response = await axios.post('http://localhost:5000/api/analyze', requestData)
      if (response.data.success) {
        setAnalysis(response.data.analysis)
      } else {
        setError(response.data.error || 'Analysis failed')
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

  const sendSMSAlert = async () => {
    if (!analysis) return

    setAlertSending(true)
    setAlertMessage(null)

    try {
      const alertData = {
        risk_level: analysis.correlation_analysis.combined_risk_level,
        risk_score: analysis.risk_scores.combined_risk,
        location: `Northeast State ${formData.Northeast_State}`,
        water_params: {
          ph: typeof formData.ph === 'string' && formData.ph === '' ? 8.5 : Number(formData.ph),
          dissolved_oxygen: typeof formData.dissolved_oxygen === 'string' && formData.dissolved_oxygen === '' ? 3.0 : Number(formData.dissolved_oxygen),
          bod: typeof formData.bod === 'string' && formData.bod === '' ? 5.0 : Number(formData.bod),
          nitrate_n: typeof formData.nitrate_n === 'string' && formData.nitrate_n === '' ? 12.0 : Number(formData.nitrate_n),
          fecal_coliform: typeof formData.fecal_coliform === 'string' && formData.fecal_coliform === '' ? 80.0 : Number(formData.fecal_coliform),
          total_coliform: typeof formData.total_coliform === 'string' && formData.total_coliform === '' ? 450.0 : Number(formData.total_coliform),
          temperature: typeof formData.temperature === 'string' && formData.temperature === '' ? 28.0 : Number(formData.temperature),
        }
      }

      const response = await axios.post('http://localhost:8001/api/sms-alert', alertData)
      
      if (response.data.success) {
        setAlertMessage(`✅ Alert sent successfully to ${response.data.sent_to.length} contacts`)
      }
    }
    finally {
      setAlertSending(false)
    }
  }

  const shouldShowAlertButton = () => {
    if (!analysis) return false
    const riskLevel = analysis.correlation_analysis.combined_risk_level.toLowerCase()
    return riskLevel === 'medium' || riskLevel === 'high' || riskLevel === 'critical'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="bold-24 text-gray-90 mb-4">{t('prediction.title')}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Outbreak Information Section */}
        <div className="bg-primary-50 p-4 rounded-lg">
          <h3 className="bold-18 text-gray-90 mb-3">📊 {t('prediction.outbreakInfo.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block regular-14 text-gray-70 mb-1">{t('prediction.outbreakInfo.cases')}</label>
              <input
                type="number"
                name="No_of_Cases"
                value={formData.No_of_Cases === '' ? '' : formData.No_of_Cases}
                onChange={handleChange}
                placeholder="150"
                min="0"
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block regular-14 text-gray-70 mb-1">{t('prediction.outbreakInfo.state')}</label>
              <select
                name="Northeast_State"
                value={formData.Northeast_State}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={1}>{t('states.arunachal')}</option>
                <option value={2}>{t('states.assam')}</option>
                <option value={3}>{t('states.manipur')}</option>
                <option value={4}>{t('states.meghalaya')}</option>
                <option value={5}>{t('states.mizoram')}</option>
                <option value={6}>{t('states.nagaland')}</option>
                <option value={7}>{t('states.sikkim')}</option>
                <option value={8}>{t('states.tripura')}</option>
              </select>
            </div>
            <div>
              <label className="block regular-14 text-gray-70 mb-1">{t('prediction.outbreakInfo.month')}</label>
              <select
                name="Start_of_Outbreak_Month"
                value={formData.Start_of_Outbreak_Month}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={1}>{t('months.january')}</option>
                <option value={2}>{t('months.february')}</option>
                <option value={3}>{t('months.march')}</option>
                <option value={4}>{t('months.april')}</option>
                <option value={5}>{t('months.may')}</option>
                <option value={6}>{t('months.june')}</option>
                <option value={7}>{t('months.july')}</option>
                <option value={8}>{t('months.august')}</option>
                <option value={9}>{t('months.september')}</option>
                <option value={10}>{t('months.october')}</option>
                <option value={11}>{t('months.november')}</option>
                <option value={12}>{t('months.december')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Water Quality Parameters Section */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="bold-18 text-gray-90 mb-3">💧 {t('prediction.waterQuality.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block regular-14 text-gray-70 mb-1">{t('prediction.waterQuality.ph')}</label>
              <input
                type="number"
                name="ph"
                value={formData.ph === '' ? '' : formData.ph}
                onChange={handleChange}
                placeholder="7.0"
                min="0.0"
                max="14.0"
                step="0.1"
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block regular-14 text-gray-70 mb-1">{t('prediction.waterQuality.dissolvedOxygen')}</label>
              <input
                type="number"
                name="dissolved_oxygen"
                value={formData.dissolved_oxygen === '' ? '' : formData.dissolved_oxygen}
                onChange={handleChange}
                placeholder="5.0"
                min="0"
                step="0.1"
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block regular-14 text-gray-70 mb-1">{t('prediction.waterQuality.bod')}</label>
              <input
                type="number"
                name="bod"
                value={formData.bod === '' ? '' : formData.bod}
                onChange={handleChange}
                placeholder="3.0"
                min="0"
                step="0.1"
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500" 
              />
            </div>
            <div>
              <label className="block regular-14 text-gray-70 mb-1">{t('prediction.waterQuality.nitrate')}</label>
              <input
                type="number"
                name="nitrate_n"
                value={formData.nitrate_n === '' ? '' : formData.nitrate_n}
                onChange={handleChange}
                placeholder="5.0"
                min="0"
                step="0.1"
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block regular-14 text-gray-70 mb-1">{t('prediction.waterQuality.fecalColiform')}</label>
              <input
                type="number"
                name="fecal_coliform"
                value={formData.fecal_coliform === '' ? '' : formData.fecal_coliform}
                onChange={handleChange}
                placeholder="20"
                min="0"
                step="1"
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block regular-14 text-gray-70 mb-1">{t('prediction.waterQuality.totalColiform')}</label>
              <input
                type="number"
                name="total_coliform"
                value={formData.total_coliform === '' ? '' : formData.total_coliform}
                onChange={handleChange}
                placeholder="100"
                min="0"
                step="1"
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block regular-14 text-gray-70 mb-1">{t('prediction.waterQuality.temperature')}</label>
              <input
                type="number"
                name="temperature"
                value={formData.temperature === '' ? '' : formData.temperature}
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
            title={isLoading ? t('prediction.analyzing') : t('prediction.analyzeButton')}
            variant="btn_primary"
            disabled={isLoading}
        />
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">⚠️ {t('prediction.error.title')}</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
        </div>
      )}

      {analysis && (
        <motion.div
          className="mt-8 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Alert Level Banner */}
          <div className={`p-4 rounded-lg border-2 ${
            analysis.alert_level.includes('CRITICAL') ? 'bg-red-100 border-red-300 text-red-800' :
            analysis.alert_level.includes('HIGH') ? 'bg-orange-100 border-orange-300 text-orange-800' :
            analysis.alert_level.includes('MEDIUM') ? 'bg-yellow-100 border-yellow-300 text-yellow-800' :
            'bg-green-100 border-green-300 text-green-800'
          }`}>
            <div className="flex items-center justify-between">
              <h2 className="bold-20">{analysis.alert_level}</h2>
              <span className="text-sm opacity-75">
                📅 {new Date(analysis.analysis_timestamp).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Disease Prediction Section */}
          <div className="bg-primary-50 p-6 rounded-lg">
            <h3 className="bold-18 text-gray-90 mb-4">🦠 {t('prediction.results.diseaseTitle')}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Main Disease Card - Larger */}
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-lg h-full flex flex-col justify-center">
                  <h4 className="regular-14 text-gray-70 mb-2">{t('prediction.results.mostLikely')}</h4>
                  <p className="bold-24 text-primary-500 mb-2">{analysis.disease_prediction.most_likely_disease}</p>
                  <p className="regular-12 text-gray-60">{t('prediction.results.basedOn')}</p>
                </div>
              </div>

              {/* Secondary Info Cards - Smaller, Stacked */}
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="regular-12 text-gray-70 mb-1">{t('prediction.results.confidence')}</h4>
                  <p className="bold-18 text-blue-500">{analysis.disease_prediction.confidence}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="regular-12 text-gray-70 mb-1">Probability</h4>
                  <p className="bold-18 text-purple-500">{analysis.disease_prediction.disease_probability}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Water Quality Assessment Section */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="bold-18 text-gray-90 mb-4">💧 Water Quality Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="regular-14 text-gray-70 mb-1">WQI Score</h4>
                <p className="bold-16 text-blue-500">{analysis.water_assessment.wqi.toFixed(1)}/100</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="regular-14 text-gray-70 mb-1">Quality Category</h4>
                <p className="bold-16 text-green-500">{analysis.water_assessment.quality_category}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="regular-14 text-gray-70 mb-1">Risk Level</h4>
                <p className={`bold-16 ${
                  analysis.water_assessment.quality_risk === 'Very High' ? 'text-red-600' :
                  analysis.water_assessment.quality_risk === 'High' ? 'text-orange-500' :
                  analysis.water_assessment.quality_risk === 'Medium' ? 'text-yellow-500' :
                  analysis.water_assessment.quality_risk === 'Low' ? 'text-green-500' :
                  analysis.water_assessment.quality_risk === 'Very Low' ? 'text-green-600' :
                  'text-gray-500'
                }`}>{analysis.water_assessment.quality_risk}</p>
              </div>
            </div>
            
            {analysis.water_assessment.risk_factors.length > 0 && (
              <div className="bg-white p-4 rounded-lg">
                <h4 className="regular-14 text-gray-70 mb-2">⚠️ Risk Factors Identified</h4>
                <div className="space-y-1">
                  {analysis.water_assessment.risk_factors.map((factor, index) => (
                    <p key={index} className="text-sm text-red-600">• {factor}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Disease-Water Correlation Section */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="bold-18 text-gray-90 mb-4">🔗 Disease-Water Quality Correlation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="regular-14 text-gray-70 mb-1">Correlation Strength</h4>
                <p className="bold-16 text-purple-500">{analysis.correlation_analysis.correlation_strength}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="regular-14 text-gray-70 mb-1">Correlation Score</h4>
                <p className="bold-16 text-indigo-500">{analysis.correlation_analysis.correlation_score}/100</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="regular-14 text-gray-70 mb-1">Combined Risk</h4>
                <p className={`bold-16 ${
                  analysis.correlation_analysis.combined_risk_level === 'Critical' ? 'text-red-500' :
                  analysis.correlation_analysis.combined_risk_level === 'High' ? 'text-orange-500' :
                  analysis.correlation_analysis.combined_risk_level === 'Medium' ? 'text-yellow-500' :
                  'text-green-500'
                }`}>{analysis.correlation_analysis.combined_risk_level}</p>
              </div>
            </div>
            
            {analysis.correlation_analysis.correlation_factors.length > 0 && (
              <div className="bg-white p-4 rounded-lg">
                <h4 className="regular-14 text-gray-70 mb-2">🎯 Contributing Factors</h4>
                <div className="space-y-1">
                  {analysis.correlation_analysis.correlation_factors.map((factor, index) => (
                    <p key={index} className="text-sm text-purple-600">• {factor}</p>
                  ))}
                </div>
              </div>
            )}
            
            {analysis.correlation_analysis.critical_intervention_needed && (
              <div className="bg-red-100 border-2 border-red-300 p-4 rounded-lg mt-4">
                <h4 className="bold-16 text-red-800 mb-2">🚨 CRITICAL INTERVENTION REQUIRED</h4>
                <p className="text-sm text-red-700">
                  The correlation analysis indicates that immediate intervention is needed to prevent disease escalation.
                </p>
              </div>
            )}
          </div>

          {/* Risk Assessment Breakdown */}
          <div className="bg-primary-50 p-6 rounded-lg">
            <h3 className="bold-18 text-gray-90 mb-4">📊 Risk Assessment Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="regular-14 text-gray-70 mb-1">Disease Risk</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.risk_scores.disease_risk}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{analysis.risk_scores.disease_risk.toFixed(1)}</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="regular-14 text-gray-70 mb-1">Water Risk</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.risk_scores.water_risk}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{analysis.risk_scores.water_risk.toFixed(1)}</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="regular-14 text-gray-70 mb-1">Correlation Risk</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.risk_scores.correlation_risk}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{analysis.risk_scores.correlation_risk.toFixed(1)}</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-primary-300">
                <h4 className="regular-14 text-gray-70 mb-1">🎯 Combined Risk</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        analysis.risk_scores.combined_risk >= 80 ? 'bg-red-500' :
                        analysis.risk_scores.combined_risk >= 60 ? 'bg-orange-500' :
                        analysis.risk_scores.combined_risk >= 40 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${analysis.risk_scores.combined_risk}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold">{analysis.risk_scores.combined_risk.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SMS Alert Section */}
          {shouldShowAlertButton() && (
            <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg">
              <h3 className="bold-18 text-red-800 mb-4">🚨 Emergency Alert System</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">!</div>
                  <div>
                    <p className="text-red-800 font-semibold">High Risk Water Quality Detected</p>
                    <p className="text-red-700 text-sm">
                      Risk Level: <span className="font-bold">{analysis.correlation_analysis.combined_risk_level}</span> 
                      ({analysis.risk_scores.combined_risk.toFixed(1)}/100)
                    </p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <p className="text-sm text-gray-700 mb-3">
                    This will send immediate SMS alerts to emergency contacts:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Contact 1: +917985419891</li>
                    <li>• Contact 2: +917008520688</li>
                    <li>• Contact 3: +91851282269</li>
                  </ul>
                </div>

                <div className="flex items-center space-x-4">
                  <Button 
                    type="button"
                    title="Send Emergency Alert"
                    variant="btn_red"
                    onClick={sendSMSAlert}
                    disabled={alertSending}
                  >
                    {alertSending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending Alert...
                      </>
                    ) : (
                      <>
                        📱 Send Emergency Alert
                      </>
                    )}
                  </Button>
                  
                  {alertMessage && (
                    <div className={`text-sm px-3 py-2 rounded ${
                      alertMessage.includes('✅') 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {alertMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Future Predictions Section */}
          {analysis.future_predictions && (
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="bold-18 text-gray-90 mb-4">🔮 {t('prediction.results.futureTitle')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(analysis.future_predictions).map(([monthKey, p]: [string, any], index) => {
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
                          <span className="font-semibold">{t('prediction.results.cases')}:</span> {p.predicted_cases}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">{t('prediction.results.disease')}:</span> {p.most_likely_disease}
                        </p>
                        <p className="text-xs opacity-75">
                          {t('prediction.results.seasonalFactor')}: {p.seasonal_factor?.toFixed(2) || 'N/A'}
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
            </div>
          )}

          {/* Integrated Recommendations Section */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="bold-18 text-gray-90 mb-4">💡 Integrated Recommendations</h3>
            <div className="space-y-3">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 bg-white p-3 rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <p className="text-sm text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">📋 {t('prediction.results.summary')}:</span> {t('prediction.results.summaryText')}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Prediction

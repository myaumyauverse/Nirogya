'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import Button from './Button'

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
  const [analysis, setAnalysis] = useState<DiseaseCorrelationAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setAnalysis(null)

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
            title={isLoading ? "Analyzing..." : "🧪 Run Complete Disease-Water Analysis"}
            variant="btn_primary"
            disabled={isLoading}
        />
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">⚠️ Analysis Error</p>
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
            <h3 className="bold-18 text-gray-90 mb-4">🦠 Disease Prediction Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="regular-14 text-gray-70 mb-1">Most Likely Disease</h4>
                <p className="bold-16 text-primary-500">{analysis.disease_prediction.most_likely_disease}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="regular-14 text-gray-70 mb-1">Predicted Cases</h4>
                <p className="bold-16 text-orange-500">{Math.round(analysis.disease_prediction.predicted_cases)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="regular-14 text-gray-70 mb-1">Confidence Level</h4>
                <p className="bold-16 text-blue-500">{analysis.disease_prediction.confidence}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="regular-14 text-gray-70 mb-1">Probability</h4>
                <p className="bold-16 text-purple-500">{analysis.disease_prediction.disease_probability}%</p>
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
                  analysis.water_assessment.quality_risk === 'Very High' ? 'text-red-500' :
                  analysis.water_assessment.quality_risk === 'High' ? 'text-orange-500' :
                  analysis.water_assessment.quality_risk === 'Medium' ? 'text-yellow-500' :
                  'text-green-500'
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
          <div className="bg-gray-50 p-6 rounded-lg">
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

          {/* Future Predictions Section */}
          {analysis.future_predictions && (
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="bold-18 text-gray-90 mb-4">🔮 3-Month Future Outbreak Predictions</h3>
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
              <span className="font-semibold">📋 Analysis Summary:</span> This comprehensive report combines disease outbreak predictions, 
              water quality assessment, correlation analysis, and future trends to provide actionable health insights. 
              The analysis uses ML models with 91.6% accuracy and WHO/BIS water quality standards for assessment.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Prediction

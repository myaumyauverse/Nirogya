'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, BarChart3, TrendingUp, Users, MapPin, AlertTriangle, Activity, Calendar, Thermometer } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const StatisticsPage = () => {
  const { t } = useLanguage()
  const [selectedState, setSelectedState] = useState('all')
  const [selectedDisease, setSelectedDisease] = useState('all')

  // Data from the model
  const stateData = [
    { state: "Meghalaya", diarrhea: 10.0, fever: 23.0, ari: 4.8, population: 2966889, riskLevel: "High" },
    { state: "Tripura", diarrhea: 6.0, fever: 15.0, ari: 1.5, population: 3673917, riskLevel: "Medium" },
    { state: "Assam", diarrhea: 5.5, fever: 16.0, ari: 2.5, population: 31205576, riskLevel: "Medium" },
    { state: "Arunachal Pradesh", diarrhea: 5.5, fever: 9.0, ari: 2.1, population: 1383727, riskLevel: "Medium" },
    { state: "Sikkim", diarrhea: 5.0, fever: 12.0, ari: 0.8, population: 610577, riskLevel: "Low" },
    { state: "Manipur", diarrhea: 5.0, fever: 14.0, ari: 1.2, population: 2855794, riskLevel: "Medium" },
    { state: "Mizoram", diarrhea: 4.3, fever: 13.0, ari: 0.9, population: 1097206, riskLevel: "Low" },
    { state: "Nagaland", diarrhea: 3.4, fever: 11.0, ari: 1.0, population: 1978502, riskLevel: "Low" }
  ]

  const keyMetrics = [
    {
      label: t('stats.totalPopulation'),
      value: "2.1M+",
      description: t('stats.peopleAtRisk'),
      icon: Users,
      color: "bg-blue-500",
      trend: "+12% from 2019"
    },
    {
      label: t('stats.highestDiarrhea'),
      value: "10%",
      description: "Meghalaya leads in prevalence",
      icon: Activity,
      color: "bg-red-500",
      trend: t('stats.criticalLevel')
    },
    {
      label: t('stats.averageFever'),
      value: "14.1%",
      description: t('stats.acrossAllStates'),
      icon: Thermometer,
      color: "bg-orange-500",
      trend: "+5% seasonal"
    },
    {
      label: t('stats.statesMonitored'),
      value: "8",
      description: t('stats.completeNortheast'),
      icon: MapPin,
      color: "bg-green-500",
      trend: t('stats.coverage')
    }
  ]

  const diseaseComparisons = [
    { disease: "Diarrhea", avgRate: 5.6, highestState: "Meghalaya", highestRate: 10.0, color: "bg-blue-500", strokeColor: "#3b82f6", maxScale: 10 },
    { disease: "Fever", avgRate: 14.1, highestState: "Meghalaya", highestRate: 23.0, color: "bg-red-500", strokeColor: "#ef4444", maxScale: 25 },
    { disease: "ARI", avgRate: 1.8, highestState: "Meghalaya", highestRate: 4.8, color: "bg-yellow-500", strokeColor: "#eab308", maxScale: 5 }
  ]

  const monthlyTrends = [
    { month: "Jan", diarrhea: 4.2, fever: 12.1, ari: 1.5 },
    { month: "Feb", diarrhea: 3.8, fever: 11.5, ari: 1.3 },
    { month: "Mar", diarrhea: 4.5, fever: 13.2, ari: 1.8 },
    { month: "Apr", diarrhea: 5.1, fever: 15.8, ari: 2.1 },
    { month: "May", diarrhea: 6.2, fever: 18.5, ari: 2.8 },
    { month: "Jun", diarrhea: 7.8, fever: 21.2, ari: 3.2 },
    { month: "Jul", diarrhea: 8.5, fever: 23.1, ari: 3.8 },
    { month: "Aug", diarrhea: 7.9, fever: 22.5, ari: 3.5 },
    { month: "Sep", diarrhea: 6.8, fever: 19.8, ari: 2.9 },
    { month: "Oct", diarrhea: 5.5, fever: 16.2, ari: 2.3 },
    { month: "Nov", diarrhea: 4.8, fever: 14.1, ari: 1.9 },
    { month: "Dec", diarrhea: 4.1, fever: 12.8, ari: 1.6 }
  ]

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200'
      case 'Medium': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'Low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-primary-200">
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-primary-600 group">
              <span className="text-primary-600 font-semibold group-hover:text-white transition-colors duration-300">{t('nav.backToHome')}</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <span className="bold-20 text-primary-600">Nirogya</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-container padding-container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
              <BarChart3 className="text-primary-600" size={32} />
            </div>
            <h1 className="bold-52 lg:bold-64 text-gray-90 mb-6">
              {t('stats.title')}
            </h1>
            <p className="regular-18 text-primary-600 font-medium mb-4">
              {t('stats.subtitle')}
            </p>
            <p className="regular-16 text-gray-50 max-w-3xl mx-auto leading-relaxed">
              {t('stats.description')}
            </p>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {keyMetrics.map((metric, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-primary-100"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 ${metric.color} rounded-full flex items-center justify-center`}>
                    <metric.icon className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="regular-12 text-gray-50 uppercase tracking-wide">{metric.label}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <h3 className="bold-32 text-gray-90 mb-1">{metric.value}</h3>
                  <p className="regular-14 text-gray-50">{metric.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-primary-500" />
                  <span className="regular-12 text-primary-600 font-medium">{metric.trend}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* State Comparison Section */}
      <section className="py-16 bg-white">
        <div className="max-container padding-container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="bold-40 lg:bold-48 text-gray-90 mb-4">
              {t('charts.stateAnalysis')}
            </h2>
            <p className="regular-16 text-gray-50 max-w-2xl mx-auto">
              {t('charts.stateAnalysisDescription')}
            </p>
          </motion.div>

          {/* Interactive State Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stateData.map((state, index) => (
              <motion.div
                key={state.state}
                className={`bg-gradient-to-br from-white to-primary-50 rounded-xl p-6 shadow-md border cursor-pointer transition-all ${
                  selectedState === state.state ? 'border-primary-500 shadow-lg' : 'border-primary-100'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -3 }}
                onClick={() => setSelectedState(selectedState === state.state ? 'all' : state.state)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="bold-18 text-primary-900">{state.state}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(state.riskLevel)}`}>
                    {state.riskLevel}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="regular-14 text-primary-600">Diarrhea</span>
                    <span className="bold-14 text-blue-600">{state.diarrhea}%</span>
                  </div>
                  <div className="w-full bg-primary-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-blue-500 h-2 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.min((state.diarrhea / 10) * 100, 100)}%` }}
                      transition={{ duration: 1.5, delay: 0.8 + index * 0.1, ease: "easeOut" }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="regular-14 text-primary-600">Fever</span>
                    <span className="bold-14 text-red-600">{state.fever}%</span>
                  </div>
                  <div className="w-full bg-primary-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-red-500 h-2 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.min((state.fever / 25) * 100, 100)}%` }}
                      transition={{ duration: 1.5, delay: 1.0 + index * 0.1, ease: "easeOut" }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="regular-14 text-primary-600">ARI</span>
                    <span className="bold-14 text-yellow-600">{state.ari}%</span>
                  </div>
                  <div className="w-full bg-primary-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-yellow-500 h-2 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.min((state.ari / 5) * 100, 100)}%` }}
                      transition={{ duration: 1.5, delay: 1.2 + index * 0.1, ease: "easeOut" }}
                    />
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-primary-100">
                  <p className="regular-12 text-primary-600">
                    Population: {(state.population / 1000000).toFixed(1)}M
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Disease Comparison Charts */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="max-container padding-container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="bold-40 lg:bold-48 text-gray-90 mb-4">
              {t('charts.diseaseComparison')}
            </h2>
            <p className="regular-16 text-gray-50 max-w-2xl mx-auto">
              {t('charts.diseaseComparisonDescription')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {diseaseComparisons.map((disease, index) => (
              <motion.div
                key={disease.disease}
                className="bg-white rounded-xl p-8 shadow-lg border border-primary-100"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center mb-6">
                  <h3 className="bold-24 text-primary-900 mb-2">{disease.disease}</h3>
                  <p className="regular-14 text-primary-600">{t('charts.regionalAnalysis')}</p>
                </div>

                {/* Circular Progress */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    {/* Background circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#bfdbfe"
                      strokeWidth="8"
                      fill="none"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke={disease.strokeColor}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                      animate={{
                        strokeDashoffset: 2 * Math.PI * 50 * (1 - Math.min(disease.avgRate / disease.maxScale, 1))
                      }}
                      transition={{ duration: 2, delay: 1 + index * 0.3, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                      className="bold-20 text-primary-900"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.5 + index * 0.3 }}
                    >
                      {disease.avgRate}%
                    </motion.span>
                  </div>
                </div>

                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 2 + index * 0.3 }}
                >
                  <div className="flex justify-between items-center p-2 bg-primary-50 rounded">
                    <span className="regular-14 text-primary-700">{t('charts.averageRate')}</span>
                    <span className="bold-14 text-primary-900">{disease.avgRate}%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-primary-100 rounded">
                    <span className="regular-14 text-primary-700">{t('charts.highestIn')}</span>
                    <span className="bold-14 text-primary-600">{disease.highestState}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="regular-14 text-red-700">{t('charts.peakRate')}</span>
                    <span className="bold-14 text-red-600">{disease.highestRate}%</span>
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                    <div className="flex justify-between text-xs text-primary-600 mb-1">
                      <span>0%</span>
                      <span>{disease.maxScale}%</span>
                    </div>
                    <div className="w-full bg-primary-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`h-2 rounded-full ${disease.color}`}
                        initial={{ width: "0%" }}
                        animate={{ width: `${(disease.avgRate / disease.maxScale) * 100}%` }}
                        transition={{ duration: 1.5, delay: 2.2 + index * 0.3, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Trends */}
      <section className="py-16 bg-white">
        <div className="max-container padding-container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="bold-40 lg:bold-48 text-gray-90 mb-4">
              {t('charts.seasonalTrends')}
            </h2>
            <p className="regular-16 text-gray-50 max-w-2xl mx-auto">
              {t('charts.seasonalDescription')}
            </p>
          </motion.div>

          {/* Trend Chart */}
          <div className="bg-gradient-to-br from-white to-primary-50 rounded-2xl p-8 shadow-lg border border-primary-100 mb-12">
            <div className="mb-6">
              <h3 className="bold-20 text-gray-90 mb-2">{t('charts.monthlyPrevalence')}</h3>
              <p className="regular-14 text-gray-50">{t('charts.monsoonNote')}</p>
            </div>

            {/* Chart Area */}
            <div className="relative h-80 bg-white rounded-xl p-6 border border-gray-200">
              <div className="absolute inset-6">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-50">
                  <span>25%</span>
                  <span>20%</span>
                  <span>15%</span>
                  <span>10%</span>
                  <span>5%</span>
                  <span>0%</span>
                </div>

                {/* Chart lines */}
                <div className="ml-8 h-full relative">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[0, 20, 40, 60, 80, 100].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2="100"
                        y2={y}
                        stroke="#f3f4f6"
                        strokeWidth="0.5"
                      />
                    ))}

                    {/* Fever line */}
                    <motion.polyline
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      points={monthlyTrends.map((data, index) =>
                        `${(index / 11) * 100},${100 - (data.fever / 25) * 100}`
                      ).join(' ')}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 1.5 }}
                    />

                    {/* Diarrhea line */}
                    <motion.polyline
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      points={monthlyTrends.map((data, index) =>
                        `${(index / 11) * 100},${100 - (data.diarrhea / 25) * 100}`
                      ).join(' ')}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 1.7 }}
                    />

                    {/* ARI line */}
                    <motion.polyline
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="2"
                      points={monthlyTrends.map((data, index) =>
                        `${(index / 11) * 100},${100 - (data.ari / 25) * 100}`
                      ).join(' ')}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 1.9 }}
                    />
                  </svg>

                  {/* X-axis labels */}
                  <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-50">
                    {monthlyTrends.map((data) => (
                      <span key={data.month}>{data.month}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-8 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-red-500"></div>
                <span className="regular-14 text-gray-70">Fever</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-blue-500"></div>
                <span className="regular-14 text-gray-70">Diarrhea</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-yellow-500"></div>
                <span className="regular-14 text-gray-70">ARI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Insights */}
      <section className="py-16 bg-primary-500">
        <div className="max-container padding-container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h2 className="bold-40 lg:bold-48 text-white mb-4">
              Key Insights & Recommendations
            </h2>
            <p className="regular-16 text-primary-100 max-w-2xl mx-auto">
              Data-driven insights to guide public health interventions and policy decisions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: t('insights.monsoonImpact'),
                insight: t('insights.monsoonInsight'),
                recommendation: t('insights.monsoonRecommendation'),
                icon: "🌧️"
              },
              {
                title: t('insights.geographicHotspots'),
                insight: t('insights.geographicInsight'),
                recommendation: t('insights.geographicRecommendation'),
                icon: "📍"
              },
              {
                title: t('insights.ageVulnerability'),
                insight: t('insights.ageInsight'),
                recommendation: t('insights.ageRecommendation'),
                icon: "👶"
              },
              {
                title: t('insights.waterQuality'),
                insight: t('insights.waterInsight'),
                recommendation: t('insights.waterRecommendation'),
                icon: "💧"
              },
              {
                title: t('insights.healthcareAccess'),
                insight: t('insights.healthcareInsight'),
                recommendation: t('insights.healthcareRecommendation'),
                icon: "🏥"
              },
              {
                title: t('insights.preventionSuccess'),
                insight: t('insights.preventionInsight'),
                recommendation: t('insights.preventionRecommendation'),
                icon: "💉"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h3 className="bold-18 text-gray-90">{item.title}</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="bold-14 text-primary-600 mb-1">Key Finding</h4>
                    <p className="regular-14 text-gray-70">{item.insight}</p>
                  </div>
                  <div>
                    <h4 className="bold-14 text-green-600 mb-1">Recommendation</h4>
                    <p className="regular-14 text-gray-70">{item.recommendation}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-container padding-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <h2 className="bold-40 lg:bold-48 text-gray-90 mb-4">
              {t('action.title')}
            </h2>
            <p className="regular-18 text-gray-50 mb-8 max-w-2xl mx-auto">
              {t('action.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started">
                <button className="px-8 py-4 bg-primary-500 text-white rounded-xl bold-16 hover:bg-primary-600 transition-all transform hover:scale-105 shadow-lg">
                  {t('action.symptomAnalysis')}
                </button>
              </Link>
              <Link href="/waterborne-diseases">
                <button className="px-8 py-4 bg-transparent border-2 border-primary-500 text-primary-600 rounded-xl bold-16 hover:bg-primary-50 transition-all transform hover:scale-105">
                  {t('action.learnMore')}
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default StatisticsPage

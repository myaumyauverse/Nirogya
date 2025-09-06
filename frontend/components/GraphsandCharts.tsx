'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

const GraphsandCharts = () => {
  const { t } = useLanguage()
  const neStats = [
    { number: "10%", label: "Diarrhea prevalence in Meghalaya", state: "Meghalaya", icon: "/location.svg" },
    { number: "4.8%", label: "ARI prevalence in Meghalaya", state: "Meghalaya", icon: "/location.svg" },
    { number: "23%", label: "Fever prevalence in Meghalaya", state: "Meghalaya", icon: "/calendar.svg" },
    { number: "6%", label: "Overall diarrhea in Northeast", state: "Northeast", icon: "/tech.svg" }
  ]

  const stateData = [
    { state: "Meghalaya", diarrhea: 10.0, fever: 23.0, ari: 4.8 },
    { state: "Tripura", diarrhea: 6.0, fever: 15.0, ari: 1.5 },
    { state: "Assam", diarrhea: 5.5, fever: 16.0, ari: 2.5 },
    { state: "Arunachal Pradesh", diarrhea: 5.5, fever: 9.0, ari: 2.1 },
    { state: "Sikkim", diarrhea: 5.0, fever: 12.0, ari: 0.8 },
    { state: "Manipur", diarrhea: 5.0, fever: 14.0, ari: 1.2 },
    { state: "Mizoram", diarrhea: 4.3, fever: 13.0, ari: 0.9 },
    { state: "Nagaland", diarrhea: 3.4, fever: 11.0, ari: 1.0 }
  ]

  return (
    <section id="statistics" className="bg-white py-20">
      <div className="max-container padding-container">
        <div className="mb-16">
          <h2 className="bold-40 lg:bold-52 text-gray-90 mb-6 text-left">
            {t('diseases.title')}
          </h2>
          <p className="regular-16 text-gray-50 max-w-3xl text-left">
            {t('stats.description')}
          </p>
        </div>

        {/* Key Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {neStats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 text-center border border-primary-200 hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="w-12 h-12 bg-primary-300 rounded-full flex items-center justify-center mx-auto mb-3"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <Image
                  src={stat.icon}
                  alt={stat.label}
                  width={24}
                  height={24}
                  className="filter brightness-0 invert"
                />
              </motion.div>
              <motion.h3
                className="bold-28 text-primary-700 mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
              >
                {stat.number}
              </motion.h3>
              <motion.p
                className="regular-14 text-gray-70 mb-1 leading-tight"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                viewport={{ once: true }}
              >
                {stat.label}
              </motion.p>
              <span className="text-xs text-primary-600 font-medium">{stat.state}</span>
            </motion.div>
          ))}
        </div>

        {/* State-wise Data Table */}
        <div className="bg-gray-10 rounded-2xl p-8 border border-gray-20 mb-12">
          <h3 className="bold-24 text-gray-90 mb-6 text-center">
            {t('table.stateWisePrevalence')}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-30">
                  <th className="text-left py-4 px-4 bold-16 text-gray-90">{t('table.state')}</th>
                  <th className="text-center py-4 px-4 bold-16 text-gray-90">{t('table.diarrhea')}</th>
                  <th className="text-center py-4 px-4 bold-16 text-gray-90">{t('table.fever')}</th>
                  <th className="text-center py-4 px-4 bold-16 text-gray-90">{t('table.ari')}</th>
                </tr>
              </thead>
              <tbody>
                {stateData.map((state, index) => (
                  <motion.tr
                    key={state.state}
                    className="border-b border-gray-20 hover:bg-primary-50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <td className="py-4 px-4 regular-16 text-gray-90 font-medium">{state.state}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`regular-16 font-medium ${state.diarrhea >= 8 ? 'text-red-600' : state.diarrhea >= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                        {state.diarrhea}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`regular-16 font-medium ${state.fever >= 20 ? 'text-red-600' : state.fever >= 15 ? 'text-orange-600' : 'text-green-600'}`}>
                        {state.fever}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`regular-16 font-medium ${state.ari >= 3 ? 'text-red-600' : state.ari >= 2 ? 'text-orange-600' : 'text-green-600'}`}>
                        {state.ari}%
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white bold-16">!</span>
            </div>
            <h4 className="bold-18 text-gray-90 mb-3">{t('table.highestRisk')}</h4>
            <p className="regular-14 text-gray-70 mb-2">
              <strong>Meghalaya</strong> {t('insights.highestRiskDescription')}
            </p>
            <ul className="text-sm text-gray-70 space-y-1">
              <li>• {t('insights.diarrhea')}</li>
              <li>• {t('insights.fever')}</li>
              <li>• {t('insights.ari')}</li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white bold-16">⚠</span>
            </div>
            <h4 className="bold-18 text-gray-90 mb-3">{t('insights.contributingFactors')}</h4>
            <p className="regular-14 text-gray-70 mb-2">
              {t('insights.contributingDescription')}
            </p>
            <ul className="text-sm text-gray-70 space-y-1">
              <li>• {t('insights.poorSanitation')}</li>
              <li>• {t('insights.lackCleanWater')}</li>
              <li>• {t('insights.lowerSocioeconomic')}</li>
              <li>• {t('insights.ruralLiving')}</li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white bold-16">✓</span>
            </div>
            <h4 className="bold-18 text-gray-90 mb-3">{t('table.preventionWorks')}</h4>
            <p className="regular-14 text-gray-70 mb-2">
              {t('insights.preventionDescription')}
            </p>
            <ul className="text-sm text-gray-70 space-y-1">
              <li>• {t('insights.improvedWaterTreatment')}</li>
              <li>• {t('insights.betterSanitationCoverage')}</li>
              <li>• {t('insights.healthEducationPrograms')}</li>
              <li>• {t('insights.vaccinationInitiatives')}</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default GraphsandCharts

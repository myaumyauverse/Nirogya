'use client'

import React from 'react'
import Prediction from '@/components/Prediction'
import RecordBook from '@/components/RecordBook'
import PatientManagement from '@/components/PatientManagement'
import ZoomMeetingManager from '@/components/ZoomMeetingManager'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { motion } from 'framer-motion'

const DoctorDashboardPage = () => {
  const { doctor } = useAuth()
  const { t } = useLanguage()

  return (
    <section className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-20">
      <div className="max-container padding-container">
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <h1 className="bold-40 text-gray-90">{t('doctor.dashboard.title')}</h1>
          {doctor && (
            <motion.div
              className="mt-2 lg:mt-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="regular-18 text-gray-70">
                {t('doctor.dashboard.greeting')} <span className="bold-18 text-primary-600">{doctor.name}</span>
              </p>
              <p className="regular-14 text-gray-50 text-right lg:text-left">
                {doctor.designation}
              </p>
            </motion.div>
          )}
        </div>

        <div className="space-y-8">
          {/* Patient Management - Full Width */}
          <PatientManagement />

          {/* Zoom Meeting Manager - Full Width */}
          <ZoomMeetingManager />

          {/* Prediction and RecordBook - Side by Side */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <Prediction />
            <RecordBook />
          </div>
        </div>
      </div>
    </section>
  )
}

export default DoctorDashboardPage

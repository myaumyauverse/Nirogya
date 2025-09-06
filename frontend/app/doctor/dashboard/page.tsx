'use client'

import React from 'react'
import Prediction from '@/components/Prediction'
import RecordBook from '@/components/RecordBook'

const DoctorDashboardPage = () => {

  return (
    <section className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-20">
      <div className="max-container padding-container">
        <h1 className="bold-40 text-gray-90 mb-8">Doctor Dashboard</h1>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Prediction />
          <RecordBook />
        </div>
      </div>
    </section>
  )
}

export default DoctorDashboardPage

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './Button'
import { useLanguage } from '@/contexts/LanguageContext'

interface PHCCenter {
  id: string
  name: string
  location: string
  district: string
  state: string
  available_doctors: string[]
  contact: string
}

const PHCAppointmentRequest = () => {
  const { t } = useLanguage()
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    patient_email: '',
    phc_id: '',
    preferred_date: '',
    preferred_time: '',
    reason: '',
    emergency: false
  })

  // Demo PHC centers in Northeast India
  const phcCenters: PHCCenter[] = [
    {
      id: 'phc_guwahati_1',
      name: 'Guwahati Urban PHC',
      location: 'Fancy Bazaar',
      district: 'Kamrup Metro',
      state: 'Assam',
      available_doctors: ['Dr. Rajesh Kumar', 'Dr. Priya Sharma'],
      contact: '+91 361 2345678'
    },
    {
      id: 'phc_imphal_1',
      name: 'Imphal East PHC',
      location: 'Porompat',
      district: 'Imphal East',
      state: 'Manipur',
      available_doctors: ['Dr. Ningombam Singh', 'Dr. Chanu Devi'],
      contact: '+91 385 2456789'
    },
    {
      id: 'phc_shillong_1',
      name: 'Shillong Civil Hospital PHC',
      location: 'Police Bazaar',
      district: 'East Khasi Hills',
      state: 'Meghalaya',
      available_doctors: ['Dr. Patricia Lyngdoh', 'Dr. Banteidor Nongrum'],
      contact: '+91 364 2567890'
    },
    {
      id: 'phc_aizawl_1',
      name: 'Aizawl Central PHC',
      location: 'Dawrpui',
      district: 'Aizawl',
      state: 'Mizoram',
      available_doctors: ['Dr. Lalthanzuala', 'Dr. Lalnunmawii'],
      contact: '+91 389 2678901'
    },
    {
      id: 'phc_kohima_1',
      name: 'Kohima District Hospital PHC',
      location: 'Raj Bhavan Road',
      district: 'Kohima',
      state: 'Nagaland',
      available_doctors: ['Dr. Temjen Jamir', 'Dr. Neidonuo Angami'],
      contact: '+91 370 2789012'
    },
    {
      id: 'phc_agartala_1',
      name: 'Agartala Government Medical College PHC',
      location: 'Kunjaban',
      district: 'West Tripura',
      state: 'Tripura',
      available_doctors: ['Dr. Biplab Debbarma', 'Dr. Sumita Chakraborty'],
      contact: '+91 381 2890123'
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData({ ...formData, [name]: checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Save to localStorage for doctor dashboard
      const appointmentRequest = {
        id: `req_${Date.now()}`,
        ...formData,
        phc_name: phcCenters.find(phc => phc.id === formData.phc_id)?.name || 'Unknown PHC',
        status: 'pending',
        created_at: new Date().toISOString()
      }

      const existingRequests = JSON.parse(localStorage.getItem('appointmentRequests') || '[]')
      const updatedRequests = [...existingRequests, appointmentRequest]
      localStorage.setItem('appointmentRequests', JSON.stringify(updatedRequests))

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setShowModal(false)
        setFormData({
          patient_name: '',
          patient_phone: '',
          patient_email: '',
          phc_id: '',
          preferred_date: '',
          preferred_time: '',
          reason: '',
          emergency: false
        })
      }, 3000)

    } catch (error) {
      console.error('Failed to submit appointment request:', error)
      alert('Failed to submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedPHC = phcCenters.find(phc => phc.id === formData.phc_id)

  return (
    <>
      {/* Trigger Button */}
      <Button
        type="button"
        title={t('phc.requestAppointment')}
        variant="btn_secondary"
        onClick={() => setShowModal(true)}
      />

      {/* Appointment Request Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-primary-50 to-white rounded-lg p-6 w-full max-w-2xl border border-primary-200 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {!submitted ? (
                <>
                  <h3 className="bold-24 text-primary-700 mb-6">{t('phc.requestAppointmentTitle')}</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Patient Information */}
                    <div className="bg-gradient-to-r from-primary-100 to-primary-50 rounded-lg p-4">
                      <h4 className="bold-16 text-primary-700 mb-4">{t('phc.patientInformation')}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('phc.fullName')}</label>
                          <input
                            type="text"
                            name="patient_name"
                            value={formData.patient_name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-white rounded-lg border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all hover:shadow-md"
                            placeholder="Enter your full name"
                          />
                        </div>
                        
                        <div>
                          <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('phc.phoneNumber')}</label>
                          <input
                            type="tel"
                            name="patient_phone"
                            value={formData.patient_phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-white rounded-lg border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all hover:shadow-md"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('phc.email')}</label>
                          <input
                            type="email"
                            name="patient_email"
                            value={formData.patient_email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white rounded-lg border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all hover:shadow-md"
                            placeholder="your.email@example.com (optional)"
                          />
                        </div>
                      </div>
                    </div>

                    {/* PHC Selection */}
                    <div className="bg-gradient-to-r from-blue-50 to-primary-50 rounded-lg p-4">
                      <h4 className="bold-16 text-primary-700 mb-4">{t('phc.selectPHC')}</h4>
                      
                      <div>
                        <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('phc.phcCenter')}</label>
                        <select
                          name="phc_id"
                          value={formData.phc_id}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-white rounded-lg border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all hover:shadow-md"
                        >
                          <option value="">{t('phc.selectPHCOption')}</option>
                          {phcCenters.map((phc) => (
                            <option key={phc.id} value={phc.id}>
                              {phc.name} - {phc.location}, {phc.district}, {phc.state}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedPHC && (
                        <div className="mt-4 p-3 bg-white rounded-lg border border-primary-200">
                          <h5 className="font-semibold text-gray-900 mb-2">{selectedPHC.name}</h5>
                          <p className="text-sm text-gray-600 mb-1">
                            📍 {selectedPHC.location}, {selectedPHC.district}, {selectedPHC.state}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            📞 {selectedPHC.contact}
                          </p>
                          <p className="text-sm text-gray-600">
                            👨‍⚕️ Available Doctors: {selectedPHC.available_doctors.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Appointment Details */}
                    <div className="bg-gradient-to-r from-green-50 to-primary-50 rounded-lg p-4">
                      <h4 className="bold-16 text-primary-700 mb-4">{t('phc.appointmentDetails')}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('phc.preferredDate')}</label>
                          <input
                            type="date"
                            name="preferred_date"
                            value={formData.preferred_date}
                            onChange={handleInputChange}
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 bg-white rounded-lg border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all hover:shadow-md"
                          />
                        </div>
                        
                        <div>
                          <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('phc.preferredTime')}</label>
                          <select
                            name="preferred_time"
                            value={formData.preferred_time}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-white rounded-lg border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all hover:shadow-md"
                          >
                            <option value="">{t('phc.selectTime')}</option>
                            <option value="09:00">09:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="14:00">02:00 PM</option>
                            <option value="15:00">03:00 PM</option>
                            <option value="16:00">04:00 PM</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('phc.reasonForVisit')}</label>
                        <textarea
                          name="reason"
                          value={formData.reason}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          className="w-full px-4 py-3 bg-white rounded-lg border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all hover:shadow-md resize-none"
                          placeholder="Please describe your symptoms or reason for consultation..."
                        />
                      </div>
                      
                      <div className="mt-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="emergency"
                            checked={formData.emergency}
                            onChange={handleInputChange}
                            className="mr-3 text-red-600 focus:ring-red-500"
                          />
                          <span className="regular-14 text-red-600 font-medium">{t('phc.emergencyCase')}</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        title={isSubmitting ? t('phc.submitting') : t('phc.submitRequest')}
                        variant="btn_primary"
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        title={t('phc.cancel')}
                        variant="btn_secondary"
                        onClick={() => setShowModal(false)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="bold-20 text-gray-90 mb-2">{t('phc.requestSubmitted')}</h3>
                  <p className="regular-16 text-gray-70 mb-4">
                    {t('phc.requestSubmittedMessage')}
                  </p>
                  <p className="text-sm text-primary-600">
                    {t('phc.doctorWillContact')}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default PHCAppointmentRequest

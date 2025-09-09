'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Button from '@/components/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

const DoctorLoginPage = () => {
  const router = useRouter()
  const { login } = useAuth()
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Extract name from email if name is not provided
    const doctorName = formData.name.trim() || formData.email.split('@')[0]

    // Login with name and email
    login(doctorName, formData.email)

    // Redirect to dashboard
    router.push('/doctor/dashboard')
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center py-12">
      <div className="max-container padding-container flex flex-col items-center">
        <motion.div
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="bold-32 text-gray-90 mb-2 text-center">{t('doctor.login.title')}</h2>
          <p className="regular-16 text-gray-50 mb-8 text-center">
            {t('doctor.login.subtitle')}
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="name" className="block regular-16 text-gray-90 mb-2">
                {t('doctor.login.name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('doctor.login.namePlaceholder')}
                className="w-full px-4 py-3 bg-gray-10 rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>

            <div>
              <label htmlFor="email" className="block regular-16 text-gray-90 mb-2">
                {t('doctor.login.email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('doctor.login.emailPlaceholder')}
                required
                className="w-full px-4 py-3 bg-gray-10 rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block regular-16 text-gray-90 mb-2"
              >
                {t('doctor.login.password')}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('doctor.login.passwordPlaceholder')}
                required
                className="w-full px-4 py-3 bg-gray-10 rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>

            <Button
                type="submit"
                title={t('doctor.login.loginButton')}
                variant="btn_primary_dark"
                full
            />
          </form>
        </motion.div>
      </div>
    </section>
  )
}

export default DoctorLoginPage

'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Button from '@/components/Button'

const DoctorLoginPage = () => {
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login: just redirect to the dashboard
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
          <h2 className="bold-32 text-gray-90 mb-2 text-center">Doctor Login</h2>
          <p className="regular-16 text-gray-50 mb-8 text-center">
            Access your medical dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block regular-16 text-gray-90 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="doctor@nirogya.in"
                required
                className="w-full px-4 py-3 bg-gray-10 rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block regular-16 text-gray-90 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-gray-10 rounded-lg border border-gray-20 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>

            <Button
                type="submit"
                title="Login"
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

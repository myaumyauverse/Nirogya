'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Doctor {
  name: string
  email: string
  designation: string
  loginTime: string
}

interface AuthContextType {
  doctor: Doctor | null
  login: (name: string, email: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

// Random designations for doctors
const designations = [
  'Chief Medical Officer',
  'Senior Physician',
  'Consultant Physician',
  'Medical Specialist',
  'Public Health Officer',
  'Infectious Disease Specialist',
  'Community Health Expert',
  'Medical Research Officer',
  'Clinical Director',
  'Health Program Manager',
  'Epidemiologist',
  'Preventive Medicine Specialist',
  'Primary Care Physician',
  'Medical Advisor',
  'Health Policy Specialist'
]

const getRandomDesignation = (): string => {
  return designations[Math.floor(Math.random() * designations.length)]
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [doctor, setDoctor] = useState<Doctor | null>(null)

  useEffect(() => {
    // Load saved doctor info from localStorage
    const savedDoctor = localStorage.getItem('doctor-info')
    if (savedDoctor) {
      try {
        const doctorData = JSON.parse(savedDoctor)
        setDoctor(doctorData)
      } catch (error) {
        console.error('Error parsing saved doctor info:', error)
        localStorage.removeItem('doctor-info')
      }
    }
  }, [])

  const login = (name: string, email: string) => {
    const doctorData: Doctor = {
      name: name.trim(),
      email: email.trim(),
      designation: getRandomDesignation(),
      loginTime: new Date().toISOString()
    }
    
    setDoctor(doctorData)
    localStorage.setItem('doctor-info', JSON.stringify(doctorData))
  }

  const logout = () => {
    setDoctor(null)
    localStorage.removeItem('doctor-info')
  }

  const isAuthenticated = doctor !== null

  return (
    <AuthContext.Provider value={{ doctor, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

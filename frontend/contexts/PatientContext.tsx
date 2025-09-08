'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Patient {
  id: string
  name: string
  phone: string
  age: number
  location: string
  dateAdded: string
  symptoms: string
  diseases: string[]
  status: 'Active' | 'Recovered' | 'Under Treatment' | 'Critical'
  lastVisit: string
  notes?: string
  emergencyContact?: string
}

interface PatientContextType {
  patients: Patient[]
  addPatient: (patient: Omit<Patient, 'id' | 'dateAdded'>) => void
  updatePatient: (id: string, updates: Partial<Patient>) => void
  deletePatient: (id: string) => void
  getPatient: (id: string) => Patient | undefined
  searchPatients: (query: string) => Patient[]
}

const PatientContext = createContext<PatientContextType | undefined>(undefined)

export const usePatients = () => {
  const context = useContext(PatientContext)
  if (!context) {
    throw new Error('usePatients must be used within a PatientProvider')
  }
  return context
}

interface PatientProviderProps {
  children: React.ReactNode
}

// Sample patient data for demonstration
const samplePatients: Patient[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    age: 34,
    location: 'Guwahati, Assam',
    dateAdded: '2024-01-15',
    symptoms: 'Fever, diarrhea, abdominal pain',
    diseases: ['Cholera'],
    status: 'Under Treatment',
    lastVisit: '2024-01-20',
    notes: 'Patient responding well to treatment'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    phone: '+91 87654 32109',
    age: 28,
    location: 'Imphal, Manipur',
    dateAdded: '2024-01-10',
    symptoms: 'Nausea, vomiting, jaundice',
    diseases: ['Hepatitis A'],
    status: 'Recovered',
    lastVisit: '2024-01-18',
    notes: 'Full recovery achieved'
  },
  {
    id: '3',
    name: 'Amit Das',
    phone: '+91 76543 21098',
    age: 45,
    location: 'Shillong, Meghalaya',
    dateAdded: '2024-01-12',
    symptoms: 'Severe diarrhea, dehydration',
    diseases: ['Dysentery'],
    status: 'Critical',
    lastVisit: '2024-01-22',
    notes: 'Requires immediate attention'
  }
]

export const PatientProvider: React.FC<PatientProviderProps> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([])

  useEffect(() => {
    // Load saved patients from localStorage
    const savedPatients = localStorage.getItem('patients-data')
    if (savedPatients) {
      try {
        const patientsData = JSON.parse(savedPatients)
        setPatients(patientsData)
      } catch (error) {
        console.error('Error parsing saved patients data:', error)
        // Use sample data if parsing fails
        setPatients(samplePatients)
        localStorage.setItem('patients-data', JSON.stringify(samplePatients))
      }
    } else {
      // Initialize with sample data
      setPatients(samplePatients)
      localStorage.setItem('patients-data', JSON.stringify(samplePatients))
    }
  }, [])

  const addPatient = (patientData: Omit<Patient, 'id' | 'dateAdded'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0],
      lastVisit: new Date().toISOString().split('T')[0]
    }
    
    const updatedPatients = [...patients, newPatient]
    setPatients(updatedPatients)
    localStorage.setItem('patients-data', JSON.stringify(updatedPatients))
  }

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    const updatedPatients = patients.map(patient =>
      patient.id === id ? { ...patient, ...updates } : patient
    )
    setPatients(updatedPatients)
    localStorage.setItem('patients-data', JSON.stringify(updatedPatients))
  }

  const deletePatient = (id: string) => {
    const updatedPatients = patients.filter(patient => patient.id !== id)
    setPatients(updatedPatients)
    localStorage.setItem('patients-data', JSON.stringify(updatedPatients))
  }

  const getPatient = (id: string): Patient | undefined => {
    return patients.find(patient => patient.id === id)
  }

  const searchPatients = (query: string): Patient[] => {
    if (!query.trim()) return patients
    
    const lowercaseQuery = query.toLowerCase()
    return patients.filter(patient =>
      patient.name.toLowerCase().includes(lowercaseQuery) ||
      patient.location.toLowerCase().includes(lowercaseQuery) ||
      patient.symptoms.toLowerCase().includes(lowercaseQuery) ||
      patient.diseases.some(disease => disease.toLowerCase().includes(lowercaseQuery)) ||
      patient.phone.includes(query)
    )
  }

  return (
    <PatientContext.Provider value={{
      patients,
      addPatient,
      updatePatient,
      deletePatient,
      getPatient,
      searchPatients
    }}>
      {children}
    </PatientContext.Provider>
  )
}

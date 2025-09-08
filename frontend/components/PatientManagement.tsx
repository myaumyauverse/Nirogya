'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePatients, Patient } from '@/contexts/PatientContext'
import { useLanguage } from '@/contexts/LanguageContext'
import Button from './Button'

const PatientManagement = () => {
  const { patients, addPatient, updatePatient, deletePatient, searchPatients } = usePatients()
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patients)

  const [newPatient, setNewPatient] = useState({
    name: '',
    phone: '',
    age: '',
    location: '',
    symptoms: '',
    diseases: '',
    status: 'Active' as Patient['status'],
    notes: '',
    emergencyContact: ''
  })

  const [editPatient, setEditPatient] = useState({
    name: '',
    phone: '',
    age: '',
    location: '',
    symptoms: '',
    diseases: '',
    status: 'Active' as Patient['status'],
    notes: '',
    emergencyContact: ''
  })

  React.useEffect(() => {
    const results = searchPatients(searchTerm)
    setFilteredPatients(results)
  }, [searchTerm, patients, searchPatients])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newPatient.name.trim() || !newPatient.phone.trim() || !newPatient.age) {
      alert('Please fill in all required fields')
      return
    }

    const patientData = {
      ...newPatient,
      age: parseInt(newPatient.age),
      diseases: newPatient.diseases.split(',').map(d => d.trim()).filter(d => d),
      lastVisit: new Date().toISOString().split('T')[0]
    }

    addPatient(patientData)
    
    // Reset form
    setNewPatient({
      name: '',
      phone: '',
      age: '',
      location: '',
      symptoms: '',
      diseases: '',
      status: 'Active',
      notes: '',
      emergencyContact: ''
    })
    setShowAddForm(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewPatient({
      ...newPatient,
      [e.target.name]: e.target.value
    })
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditPatient({
      ...editPatient,
      [e.target.name]: e.target.value
    })
  }

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient)
    setEditPatient({
      name: patient.name,
      phone: patient.phone,
      age: patient.age.toString(),
      location: patient.location,
      symptoms: patient.symptoms,
      diseases: patient.diseases.join(', '),
      status: patient.status,
      notes: patient.notes || '',
      emergencyContact: patient.emergencyContact || ''
    })
    setShowEditForm(true)
  }

  const handleUpdatePatient = (e: React.FormEvent) => {
    e.preventDefault()

    if (!editPatient.name.trim() || !editPatient.phone.trim() || !editPatient.age) {
      alert('Please fill in all required fields')
      return
    }

    if (!editingPatient) return

    const updatedPatientData = {
      ...editingPatient,
      name: editPatient.name,
      phone: editPatient.phone,
      age: parseInt(editPatient.age),
      location: editPatient.location,
      symptoms: editPatient.symptoms,
      diseases: editPatient.diseases.split(',').map(d => d.trim()).filter(d => d),
      status: editPatient.status,
      notes: editPatient.notes,
      emergencyContact: editPatient.emergencyContact
    }

    updatePatient(editingPatient.id, updatedPatientData)

    // Reset form
    setEditPatient({
      name: '',
      phone: '',
      age: '',
      location: '',
      symptoms: '',
      diseases: '',
      status: 'Active',
      notes: '',
      emergencyContact: ''
    })
    setEditingPatient(null)
    setShowEditForm(false)
  }

  const getStatusColor = (status: Patient['status']) => {
    switch (status) {
      case 'Active': return 'bg-blue-100 text-blue-800'
      case 'Recovered': return 'bg-green-100 text-green-800'
      case 'Under Treatment': return 'bg-yellow-100 text-yellow-800'
      case 'Critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 via-white to-primary-100 rounded-2xl shadow-lg p-6 border border-primary-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="bold-24 text-gray-90 mb-4 sm:mb-0">{t('patients.title')}</h2>
        <Button
          type="button"
          title={t('patients.addNew')}
          variant="btn_primary"
          onClick={() => setShowAddForm(true)}
        />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder={t('patients.searchPlaceholder')}
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-3 bg-white rounded-lg border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all shadow-sm hover:shadow-md"
        />
      </div>

      {/* Patient Count */}
      <div className="mb-4 text-sm text-primary-600 font-medium bg-primary-50 px-3 py-2 rounded-lg inline-block">
        {t('patients.showing')} {filteredPatients.length} {t('patients.of')} {patients.length} {t('patients.patients')}
      </div>

      {/* Patients Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-primary-200">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-primary-50 to-primary-100">
            <tr>
              <th className="p-3 text-xs font-semibold text-primary-700 uppercase tracking-wider text-left">{t('patients.name')}</th>
              <th className="p-3 text-xs font-semibold text-primary-700 uppercase tracking-wider text-left">{t('patients.age')}</th>
              <th className="p-3 text-xs font-semibold text-primary-700 uppercase tracking-wider text-left">{t('patients.location')}</th>
              <th className="p-3 text-xs font-semibold text-primary-700 uppercase tracking-wider text-left">{t('patients.status')}</th>
              <th className="p-3 text-xs font-semibold text-primary-700 uppercase tracking-wider text-left">{t('patients.lastVisit')}</th>
              <th className="p-3 text-xs font-semibold text-primary-700 uppercase tracking-wider text-left">{t('patients.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-200">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-primary-50 cursor-pointer transition-colors duration-200">
                <td className="p-3 text-sm font-medium text-gray-900">{patient.name}</td>
                <td className="p-3 text-sm text-gray-700">{patient.age}</td>
                <td className="p-3 text-sm text-gray-700">{patient.location}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                </td>
                <td className="p-3 text-sm text-gray-700">{patient.lastVisit}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedPatient(patient)}
                      className="text-primary-600 hover:text-primary-800 hover:bg-primary-100 px-2 py-1 rounded text-sm font-medium transition-all duration-200"
                    >
                      {t('patients.view')}
                    </button>
                    <button
                      onClick={() => handleEditPatient(patient)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 px-2 py-1 rounded text-sm font-medium transition-all duration-200"
                    >
                      {t('patients.edit')}
                    </button>
                    <button
                      onClick={() => deletePatient(patient.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-100 px-2 py-1 rounded text-sm font-medium transition-all duration-200"
                    >
                      {t('patients.delete')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPatients.length === 0 && (
          <div className="text-center py-8 text-primary-600 bg-primary-50 rounded-lg">
            <p className="font-medium">{t('patients.noPatients')}</p>
          </div>
        )}
      </div>

      {/* Patient Detail Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-primary-50 via-white to-primary-100 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-primary-200 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-primary-200">
                <h3 className="bold-20 text-primary-700">{t('patients.patientDetails')}</h3>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-primary-500 hover:text-primary-700 hover:bg-primary-100 rounded-full w-8 h-8 flex items-center justify-center text-xl transition-all duration-200"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.name')}</label>
                    <p className="bold-16 text-gray-90">{selectedPatient.name}</p>
                  </div>

                  <div>
                    <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.phone')}</label>
                    <p className="regular-16 text-gray-90">{selectedPatient.phone}</p>
                  </div>

                  <div>
                    <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.age')}</label>
                    <p className="regular-16 text-gray-90">{selectedPatient.age} years</p>
                  </div>

                  <div>
                    <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.status')}</label>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedPatient.status)}`}>
                      {selectedPatient.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.location')}</label>
                  <p className="regular-16 text-gray-90">{selectedPatient.location}</p>
                </div>

                <div>
                  <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.symptoms')}</label>
                  <p className="regular-16 text-gray-90 bg-primary-50 p-3 rounded-lg border border-primary-200">{selectedPatient.symptoms}</p>
                </div>

                <div>
                  <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.diseases')}</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.diseases.map((disease, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                        {disease}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.dateAdded')}</label>
                    <p className="regular-16 text-gray-90">{selectedPatient.dateAdded}</p>
                  </div>

                  <div>
                    <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.lastVisit')}</label>
                    <p className="regular-16 text-gray-90">{selectedPatient.lastVisit}</p>
                  </div>
                </div>

                {selectedPatient.notes && (
                  <div>
                    <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.notes')}</label>
                    <p className="regular-16 text-gray-90 bg-primary-50 p-3 rounded-lg border border-primary-200">{selectedPatient.notes}</p>
                  </div>
                )}

                {selectedPatient.emergencyContact && (
                  <div>
                    <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.emergencyContact')}</label>
                    <p className="regular-16 text-gray-90">{selectedPatient.emergencyContact}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-6 border-t">
                <Button
                  type="button"
                  title={t('patients.close')}
                  variant="btn_secondary"
                  onClick={() => setSelectedPatient(null)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-primary-50 via-white to-primary-100 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-primary-200 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="bold-20 text-primary-700 mb-4 pb-4 border-b border-primary-200">{t('patients.addNew')}</h3>
              
              <form onSubmit={handleAddPatient} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.name')} *</label>
                    <input
                      type="text"
                      name="name"
                      value={newPatient.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all bg-white hover:shadow-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.phone')} *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={newPatient.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all bg-white hover:shadow-md"
                    />
                  </div>

                  <div>
                    <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.age')} *</label>
                    <input
                      type="number"
                      name="age"
                      value={newPatient.age}
                      onChange={handleInputChange}
                      required
                      min="0"
                      max="120"
                      className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all bg-white hover:shadow-md"
                    />
                  </div>

                  <div>
                    <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.status')}</label>
                    <select
                      name="status"
                      value={newPatient.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all bg-white hover:shadow-md"
                    >
                      <option value="Active">{t('patients.statusActive')}</option>
                      <option value="Under Treatment">{t('patients.statusTreatment')}</option>
                      <option value="Recovered">{t('patients.statusRecovered')}</option>
                      <option value="Critical">{t('patients.statusCritical')}</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.location')}</label>
                  <input
                    type="text"
                    name="location"
                    value={newPatient.location}
                    onChange={handleInputChange}
                    placeholder="City, District, State"
                    className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all bg-white hover:shadow-md"
                  />
                </div>

                <div>
                  <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.symptoms')}</label>
                  <textarea
                    name="symptoms"
                    value={newPatient.symptoms}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Describe symptoms..."
                    className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all bg-white hover:shadow-md"
                  />
                </div>

                <div>
                  <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.diseases')}</label>
                  <input
                    type="text"
                    name="diseases"
                    value={newPatient.diseases}
                    onChange={handleInputChange}
                    placeholder="Cholera, Hepatitis A (comma separated)"
                    className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all bg-white hover:shadow-md"
                  />
                </div>

                <div>
                  <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.notes')}</label>
                  <textarea
                    name="notes"
                    value={newPatient.notes}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Additional notes..."
                    className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all bg-white hover:shadow-md"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    title={t('patients.save')}
                    variant="btn_primary"
                  />
                  <Button
                    type="button"
                    title={t('patients.cancel')}
                    variant="btn_secondary"
                    onClick={() => setShowAddForm(false)}
                  />
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Patient Modal */}
      <AnimatePresence>
        {showEditForm && editingPatient && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-primary-50 via-white to-primary-100 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-primary-200 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="bold-20 text-primary-700 mb-4 pb-4 border-b border-primary-200">{t('patients.editPatient')}</h3>

              <form onSubmit={handleUpdatePatient} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.name')} *</label>
                    <input
                      type="text"
                      name="name"
                      value={editPatient.name}
                      onChange={handleEditInputChange}
                      required
                      className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all bg-white hover:shadow-md"
                    />
                  </div>

                  <div>
                    <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.phone')} *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editPatient.phone}
                      onChange={handleEditInputChange}
                      required
                      className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all bg-white hover:shadow-md"
                    />
                  </div>

                  <div>
                    <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.age')} *</label>
                    <input
                      type="number"
                      name="age"
                      value={editPatient.age}
                      onChange={handleEditInputChange}
                      required
                      min="0"
                      max="120"
                      className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all bg-white hover:shadow-md"
                    />
                  </div>

                  <div>
                    <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.status')}</label>
                    <select
                      name="status"
                      value={editPatient.status}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all bg-white hover:shadow-md"
                    >
                      <option value="Active">{t('patients.statusActive')}</option>
                      <option value="Under Treatment">{t('patients.statusTreatment')}</option>
                      <option value="Recovered">{t('patients.statusRecovered')}</option>
                      <option value="Critical">{t('patients.statusCritical')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.location')}</label>
                  <input
                    type="text"
                    name="location"
                    value={editPatient.location}
                    onChange={handleEditInputChange}
                    placeholder="City, District, State"
                    className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all bg-white hover:shadow-md"
                  />
                </div>

                <div>
                  <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.symptoms')}</label>
                  <textarea
                    name="symptoms"
                    value={editPatient.symptoms}
                    onChange={handleEditInputChange}
                    rows={3}
                    placeholder="Describe symptoms..."
                    className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all bg-white hover:shadow-md"
                  />
                </div>

                <div>
                  <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.diseases')}</label>
                  <input
                    type="text"
                    name="diseases"
                    value={editPatient.diseases}
                    onChange={handleEditInputChange}
                    placeholder="Cholera, Hepatitis A (comma separated)"
                    className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all bg-white hover:shadow-md"
                  />
                </div>

                <div>
                  <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.notes')}</label>
                  <textarea
                    name="notes"
                    value={editPatient.notes}
                    onChange={handleEditInputChange}
                    rows={2}
                    placeholder="Additional notes..."
                    className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all bg-white hover:shadow-md"
                  />
                </div>

                <div>
                  <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('patients.emergencyContact')}</label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={editPatient.emergencyContact}
                    onChange={handleEditInputChange}
                    placeholder="Emergency contact number"
                    className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all bg-white hover:shadow-md"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    title={t('patients.updatePatient')}
                    variant="btn_primary"
                  />
                  <Button
                    type="button"
                    title={t('patients.cancel')}
                    variant="btn_secondary"
                    onClick={() => {
                      setShowEditForm(false)
                      setEditingPatient(null)
                    }}
                  />
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PatientManagement

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './Button'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePatients } from '@/contexts/PatientContext'

interface ZoomMeeting {
  id: string
  topic: string
  start_time: string
  duration: number
  join_url: string
  password?: string
  patient_ids: string[]
  status: 'scheduled' | 'started' | 'ended'
  created_at: string
}

interface AppointmentRequest {
  id: string
  patient_name: string
  patient_phone: string
  patient_email: string
  phc_name: string
  preferred_date: string
  preferred_time: string
  reason: string
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
  created_at: string
}

const ZoomMeetingManager = () => {
  const { t } = useLanguage()
  const { patients } = usePatients()
  
  const [meetings, setMeetings] = useState<ZoomMeeting[]>([])
  const [appointmentRequests, setAppointmentRequests] = useState<AppointmentRequest[]>([])
  const [showCreateMeeting, setShowCreateMeeting] = useState(false)
  const [showNotifyModal, setShowNotifyModal] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<ZoomMeeting | null>(null)
  const [selectedPatients, setSelectedPatients] = useState<string[]>([])
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false)
  const [isNotifying, setIsNotifying] = useState(false)

  const [meetingForm, setMeetingForm] = useState({
    topic: '',
    date: '',
    time: '',
    duration: 60,
    agenda: ''
  })

  // Load appointment requests from localStorage
  useEffect(() => {
    const savedRequests = localStorage.getItem('appointmentRequests')
    if (savedRequests) {
      setAppointmentRequests(JSON.parse(savedRequests))
    }

    // Load existing meetings
    const savedMeetings = localStorage.getItem('zoomMeetings')
    if (savedMeetings) {
      setMeetings(JSON.parse(savedMeetings))
    }
  }, [])

  // Save meetings to localStorage
  const saveMeetings = (updatedMeetings: ZoomMeeting[]) => {
    setMeetings(updatedMeetings)
    localStorage.setItem('zoomMeetings', JSON.stringify(updatedMeetings))
  }

  // Create Zoom meeting
  const handleCreateMeeting = async () => {
    setIsCreatingMeeting(true)
    
    try {
      // Simulate Zoom API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newMeeting: ZoomMeeting = {
        id: `meeting_${Date.now()}`,
        topic: meetingForm.topic,
        start_time: `${meetingForm.date}T${meetingForm.time}:00`,
        duration: meetingForm.duration,
        join_url: `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`,
        password: Math.random().toString(36).substring(2, 8),
        patient_ids: [],
        status: 'scheduled',
        created_at: new Date().toISOString()
      }

      const updatedMeetings = [...meetings, newMeeting]
      saveMeetings(updatedMeetings)
      
      setShowCreateMeeting(false)
      setMeetingForm({ topic: '', date: '', time: '', duration: 60, agenda: '' })
      
    } catch (error) {
      console.error('Failed to create meeting:', error)
      alert('Failed to create meeting. Please try again.')
    } finally {
      setIsCreatingMeeting(false)
    }
  }

  // Notify patients about meeting
  const handleNotifyPatients = async () => {
    if (!selectedMeeting || selectedPatients.length === 0) return
    
    setIsNotifying(true)
    
    try {
      // Simulate notification API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update meeting with patient IDs
      const updatedMeetings = meetings.map(meeting => 
        meeting.id === selectedMeeting.id 
          ? { ...meeting, patient_ids: [...new Set([...meeting.patient_ids, ...selectedPatients])] }
          : meeting
      )
      saveMeetings(updatedMeetings)
      
      setShowNotifyModal(false)
      setSelectedPatients([])
      setSelectedMeeting(null)
      
      alert(`Meeting link sent to ${selectedPatients.length} patient(s) successfully!`)
      
    } catch (error) {
      console.error('Failed to notify patients:', error)
      alert('Failed to send notifications. Please try again.')
    } finally {
      setIsNotifying(false)
    }
  }

  // Schedule appointment from request
  const handleScheduleFromRequest = (request: AppointmentRequest) => {
    setMeetingForm({
      topic: `Consultation with ${request.patient_name}`,
      date: request.preferred_date,
      time: request.preferred_time,
      duration: 30,
      agenda: `Reason: ${request.reason}`
    })
    setShowCreateMeeting(true)
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 via-white to-primary-100 rounded-2xl shadow-lg p-6 border border-primary-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="bold-24 text-primary-700">{t('zoom.title')}</h2>
        <Button
          type="button"
          title={t('zoom.createMeeting')}
          variant="btn_primary"
          onClick={() => setShowCreateMeeting(true)}
        />
      </div>

      {/* Appointment Requests Section */}
      {appointmentRequests.length > 0 && (
        <div className="mb-8">
          <h3 className="bold-18 text-primary-700 mb-4">{t('zoom.appointmentRequests')}</h3>
          <div className="bg-white rounded-lg border border-primary-200 overflow-hidden">
            {appointmentRequests.filter(req => req.status === 'pending').map((request) => (
              <div key={request.id} className="p-4 border-b border-primary-100 last:border-b-0 hover:bg-primary-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h4 className="font-semibold text-gray-900">{request.patient_name}</h4>
                      <span className="text-sm text-primary-600 bg-primary-100 px-2 py-1 rounded">
                        {request.phc_name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Preferred:</span> {request.preferred_date} at {request.preferred_time}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Reason:</span> {request.reason}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      title={t('zoom.schedule')}
                      variant="btn_primary"
                      onClick={() => handleScheduleFromRequest(request)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Meetings Section */}
      <div className="mb-6">
        <h3 className="bold-18 text-primary-700 mb-4">{t('zoom.scheduledMeetings')}</h3>
        {meetings.length === 0 ? (
          <div className="text-center py-8 text-primary-600 bg-primary-50 rounded-lg">
            <p className="font-medium">{t('zoom.noMeetings')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <motion.div
                key={meeting.id}
                className="bg-white rounded-lg border border-primary-200 p-4 hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{meeting.topic}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {new Date(meeting.start_time).toLocaleString()} • {meeting.duration} minutes
                    </p>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                        meeting.status === 'started' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {meeting.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {meeting.patient_ids.length} patient(s) notified
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      title={t('zoom.notify')}
                      variant="btn_secondary"
                      onClick={() => {
                        setSelectedMeeting(meeting)
                        setShowNotifyModal(true)
                      }}
                    />
                    <Button
                      type="button"
                      title={t('zoom.joinMeeting')}
                      variant="btn_primary"
                      onClick={() => window.open(meeting.join_url, '_blank')}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Meeting Modal */}
      <AnimatePresence>
        {showCreateMeeting && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-primary-50 to-white rounded-lg p-6 w-full max-w-md border border-primary-200"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="bold-20 text-primary-700 mb-4">{t('zoom.createNewMeeting')}</h3>

              <div className="space-y-4">
                <div>
                  <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('zoom.meetingTopic')}</label>
                  <input
                    type="text"
                    value={meetingForm.topic}
                    onChange={(e) => setMeetingForm({ ...meetingForm, topic: e.target.value })}
                    placeholder="Patient Consultation"
                    className="w-full px-4 py-3 bg-white rounded-lg border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all hover:shadow-md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('zoom.date')}</label>
                    <input
                      type="date"
                      value={meetingForm.date}
                      onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                      className="w-full px-4 py-3 bg-white rounded-lg border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all hover:shadow-md"
                    />
                  </div>

                  <div>
                    <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('zoom.time')}</label>
                    <input
                      type="time"
                      value={meetingForm.time}
                      onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                      className="w-full px-4 py-3 bg-white rounded-lg border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all hover:shadow-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('zoom.duration')}</label>
                  <select
                    value={meetingForm.duration}
                    onChange={(e) => setMeetingForm({ ...meetingForm, duration: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-white rounded-lg border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all hover:shadow-md"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block regular-14 text-primary-700 mb-1 font-medium">{t('zoom.agenda')}</label>
                  <textarea
                    value={meetingForm.agenda}
                    onChange={(e) => setMeetingForm({ ...meetingForm, agenda: e.target.value })}
                    placeholder="Meeting agenda or notes..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white rounded-lg border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all hover:shadow-md resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  type="button"
                  title={isCreatingMeeting ? t('zoom.creating') : t('zoom.createMeeting')}
                  variant="btn_primary"
                  onClick={handleCreateMeeting}
                  disabled={isCreatingMeeting || !meetingForm.topic || !meetingForm.date || !meetingForm.time}
                />
                <Button
                  type="button"
                  title={t('zoom.cancel')}
                  variant="btn_secondary"
                  onClick={() => setShowCreateMeeting(false)}
                  disabled={isCreatingMeeting}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notify Patients Modal */}
      <AnimatePresence>
        {showNotifyModal && selectedMeeting && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-primary-50 to-white rounded-lg p-6 w-full max-w-lg border border-primary-200"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="bold-20 text-primary-700 mb-4">{t('zoom.notifyPatients')}</h3>
              <p className="regular-14 text-gray-600 mb-4">
                {t('zoom.selectPatientsToNotify')}: <span className="font-semibold">{selectedMeeting.topic}</span>
              </p>

              <div className="max-h-64 overflow-y-auto border border-primary-200 rounded-lg bg-white">
                {patients.map((patient) => (
                  <label key={patient.id} className="flex items-center p-3 hover:bg-primary-50 cursor-pointer border-b border-primary-100 last:border-b-0">
                    <input
                      type="checkbox"
                      checked={selectedPatients.includes(patient.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPatients([...selectedPatients, patient.id])
                        } else {
                          setSelectedPatients(selectedPatients.filter(id => id !== patient.id))
                        }
                      }}
                      className="mr-3 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-600">{patient.phone} • {patient.location}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  type="button"
                  title={isNotifying ? t('zoom.sending') : `${t('zoom.notify')} (${selectedPatients.length})`}
                  variant="btn_primary"
                  onClick={handleNotifyPatients}
                  disabled={isNotifying || selectedPatients.length === 0}
                />
                <Button
                  type="button"
                  title={t('zoom.cancel')}
                  variant="btn_secondary"
                  onClick={() => {
                    setShowNotifyModal(false)
                    setSelectedPatients([])
                    setSelectedMeeting(null)
                  }}
                  disabled={isNotifying}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ZoomMeetingManager

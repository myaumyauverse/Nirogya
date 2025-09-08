'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2, AlertCircle, CheckCircle, Volume2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePatients } from '@/contexts/PatientContext'

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

interface DiseaseMatch {
  id: number
  name: string
  confidence: number
  description: string
  matching_symptoms: string[]
  transmission: string
  severity: string
  treatment: string
  prevention: string
  region_specific_info: string
}

interface AnalysisResult {
  status: string
  message?: string
  diseases: DiseaseMatch[]
  disclaimer: string
  user_name: string
  severity_assessment: string
  recommendations: string[]
  emergency_contacts: {
    ambulance: string
    health_helpline: string
    disaster_management: string
  }
}

const GetStartedPage = () => {
  const { t } = useLanguage()
  const { addPatient } = usePatients()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    symptoms: ''
  })

  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [speechError, setSpeechError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    // Check for speech recognition support
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      setSpeechSupported(!!SpeechRecognition)

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-IN' // Indian English

        recognitionRef.current.onstart = () => {
          setIsListening(true)
          setSpeechError(null) // Clear any previous errors when successfully starting
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = ''
          let interimTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          if (finalTranscript) {
            // Add final transcript to the symptoms field
            setFormData(prev => ({
              ...prev,
              symptoms: prev.symptoms ? prev.symptoms + ' ' + finalTranscript : finalTranscript
            }))
            setTranscript('') // Clear interim transcript
          } else {
            // Show interim transcript for live feedback
            setTranscript(interimTranscript)
          }
        }

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)

          // Provide user-friendly error messages
          let errorMessage = 'Speech recognition failed. '
          switch (event.error) {
            case 'network':
              errorMessage += 'Please check your internet connection and try again.'
              break
            case 'not-allowed':
              errorMessage += 'Microphone access was denied. Please allow microphone access and try again.'
              break
            case 'no-speech':
              errorMessage += 'No speech was detected. Please try speaking again.'
              break
            case 'audio-capture':
              errorMessage += 'Microphone not found or not working. Please check your microphone.'
              break
            case 'service-not-allowed':
              errorMessage += 'Speech recognition service is not available.'
              break
            default:
              errorMessage += 'Please try again.'
          }

          // Set error state to display in UI
          setSpeechError(errorMessage)

          // Clear error after 5 seconds
          setTimeout(() => setSpeechError(null), 5000)
        }
      }

    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const startListening = () => {
    if (recognitionRef.current && speechSupported) {
      setSpeechError(null) // Clear any previous errors
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const clearSpeechInput = () => {
    setFormData(prev => ({ ...prev, symptoms: '' }))
    setTranscript('')
    if (isListening) {
      stopListening()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.phone.trim() || !formData.location.trim() || !formData.symptoms.trim()) {
      alert('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    setAnalysisResult(null)

    try {
      const response = await fetch('http://localhost:8001/analyze-symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          symptoms: formData.symptoms,
          audio_input: isListening
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: AnalysisResult = await response.json()
      setAnalysisResult(result)

      // Save patient data to the patient management system
      const patientData = {
        name: formData.name,
        phone: formData.phone,
        age: 0, // Default age since not collected in get-started form
        location: formData.location,
        symptoms: formData.symptoms,
        diseases: result.analysis?.predicted_diseases || [],
        status: 'Active' as const,
        notes: `Diagnosed via symptom analysis. Predicted disease: ${result.analysis?.most_likely_disease || 'Unknown'}`,
        emergencyContact: ''
      }

      addPatient(patientData)

      // Results processed successfully - no speech output needed

    } catch (error) {
      console.error('Error analyzing symptoms:', error)
      alert('Sorry, there was an error analyzing your symptoms. Please try again or contact support.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-primary-200">
        <div className="w-full px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-primary-600 group">
            <span className="text-primary-600 font-semibold group-hover:text-white transition-colors duration-300">{t('nav.backToHome')}</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-container padding-container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
              <Image src="/user.svg" alt="User" width={32} height={32} className="text-primary-600" />
            </div>
            <h1 className="bold-40 lg:bold-52 text-gray-90 mb-4">
              {t('getStarted.title')}
            </h1>
            <p className="regular-18 text-gray-50 max-w-2xl mx-auto mb-2">
              {t('getStarted.subtitle')}
            </p>
            <p className="regular-16 text-primary-600 italic">
              {t('getStarted.disclaimer')}
            </p>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block bold-18 text-gray-90 mb-3">
                  {t('getStarted.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('getStarted.form.namePlaceholder')}
                  className="w-full px-6 py-4 border-2 border-primary-200 rounded-xl focus:border-primary-400 focus:outline-none transition-colors regular-16 bg-gray-10"
                  required
                />
              </div>

              {/* Phone Number Field */}
              <div>
                <label htmlFor="phone" className="block bold-18 text-gray-90 mb-3">
                  {t('getStarted.form.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t('getStarted.form.phonePlaceholder')}
                  className="w-full px-6 py-4 border-2 border-primary-200 rounded-xl focus:border-primary-400 focus:outline-none transition-colors regular-16 bg-gray-10"
                  required
                />
              </div>

              {/* Location Field */}
              <div>
                <label htmlFor="location" className="block bold-18 text-gray-90 mb-3">
                  {t('getStarted.form.location')}
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder={t('getStarted.form.locationPlaceholder')}
                  className="w-full px-6 py-4 border-2 border-primary-200 rounded-xl focus:border-primary-400 focus:outline-none transition-colors regular-16 bg-gray-10"
                  required
                />
              </div>

              {/* Symptoms Field */}
              <div>
                <label htmlFor="symptoms" className="block bold-18 text-gray-90 mb-3">
                  {t('getStarted.form.symptoms')}
                </label>
                <div className="mb-4">
                  <p className="regular-14 text-gray-50 mb-2">You can mention things like:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-primary-600">
                    <span>• Stomach pain or discomfort</span>
                    <span>• Nausea or vomiting</span>
                    <span>• Diarrhea or digestive issues</span>
                    <span>• Fever or chills</span>
                    <span>• Fatigue or weakness</span>
                    <span>• Headaches</span>
                    <span>• Any other concerns</span>
                    <span>• Recent water/food consumption</span>
                  </div>
                </div>

                {/* Enhanced Speech-to-Text Controls */}
                <div className="mb-6 p-4 bg-primary-50 rounded-xl border border-primary-200">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="bold-18 text-gray-90">Voice Input Chatbot</h3>
                  </div>

                  {speechSupported ? (
                    <>
                      <p className="text-sm text-gray-70 mb-4">
                        Click the button below and speak your symptoms. Your speech will be converted to text automatically.
                        <br />
                        <span className="text-xs text-gray-60">Note: Voice input requires an internet connection to work.</span>
                      </p>

                      <div className="flex items-center gap-4 mb-4">
                        <button
                          type="button"
                          onClick={isListening ? stopListening : startListening}
                          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
                            isListening
                              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg animate-pulse'
                              : 'bg-primary-500 hover:bg-primary-600 text-white shadow-md'
                          }`}
                        >
                          <Volume2 size={20} className="mr-2" />
                          {isListening ? t('getStarted.form.stopRecording') : t('getStarted.form.voiceInput')}
                        </button>

                        {formData.symptoms && (
                          <button
                            type="button"
                            onClick={clearSpeechInput}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors text-sm"
                          >
                            {t('getStarted.form.clearText')}
                          </button>
                        )}

                        {isListening && (
                          <div className="flex items-center gap-2 text-red-600">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">Recording...</span>
                          </div>
                        )}
                      </div>

                      {transcript && (
                        <div className="p-3 bg-white rounded-lg border border-primary-200">
                          <p className="text-sm text-gray-60 mb-1">Live Transcription:</p>
                          <p className="text-primary-700 italic">"{transcript}"</p>
                        </div>
                      )}

                      {speechError && (
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200 mt-3">
                          <div className="flex items-center gap-2">
                            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                            <p className="text-sm text-red-700">{speechError}</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                      ⚠️ Voice input not supported in this browser. Please use manual text input below.
                    </div>
                  )}
                </div>

                <div className="relative">
                  <textarea
                    id="symptoms"
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    placeholder={t('getStarted.form.symptomsPlaceholder')}
                    rows={8}
                    className="w-full px-6 py-4 border-2 border-primary-200 rounded-xl focus:border-primary-400 focus:outline-none transition-colors regular-16 bg-gray-10 resize-none"
                    required
                  />
                  {isListening && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 text-red-500">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm">Recording...</span>
                    </div>
                  )}
                </div>
                <p className="regular-14 text-gray-50 mt-2 italic">
                  Remember: This information helps us provide better guidance, but it's not a substitute for professional medical advice.
                </p>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-12 py-4 rounded-xl bold-16 transition-all transform shadow-lg ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary-500 hover:bg-primary-600 hover:scale-105 text-white'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      {t('getStarted.form.analyzing')}
                    </div>
                  ) : (
                    t('getStarted.form.submit')
                  )}
                </button>
                <p className="regular-14 text-gray-50 mt-4">
                  {t('getStarted.form.submitDescription')}
                </p>
              </div>
            </form>
          </div>

          {/* Analysis Results */}
          {analysisResult && (
            <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="mb-6">
                <h2 className="bold-32 text-gray-90">Analysis Results</h2>
              </div>

              {/* Severity Assessment */}
              <div className={`p-6 rounded-xl mb-6 ${
                analysisResult.severity_assessment.includes('High Risk')
                  ? 'bg-red-50 border-l-4 border-red-500'
                  : analysisResult.severity_assessment.includes('Moderate Risk')
                  ? 'bg-yellow-50 border-l-4 border-yellow-500'
                  : 'bg-green-50 border-l-4 border-green-500'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {analysisResult.severity_assessment.includes('High Risk') ? (
                    <AlertCircle className="text-red-500" size={24} />
                  ) : (
                    <CheckCircle className="text-green-500" size={24} />
                  )}
                  <h3 className="bold-20 text-gray-90">Risk Assessment</h3>
                </div>
                <p className="regular-16 text-gray-70">{analysisResult.severity_assessment}</p>
              </div>

              {/* Disease Matches */}
              {analysisResult.diseases.length > 0 && (
                <div className="mb-6">
                  <h3 className="bold-20 text-gray-90 mb-4">Potential Conditions</h3>
                  <div className="space-y-4">
                    {analysisResult.diseases.slice(0, 3).map((disease, index) => (
                      <div key={disease.id} className="border border-primary-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="bold-18 text-gray-90 capitalize">
                            {disease.name.replace(/_/g, ' ')}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className={`px-3 py-1 rounded-full text-sm ${
                              disease.confidence > 0.8 ? 'bg-green-100 text-green-800' :
                              disease.confidence > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {Math.round(disease.confidence * 100)}% match
                            </div>
                          </div>
                        </div>
                        <p className="regular-14 text-gray-70 mb-3">{disease.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-semibold text-gray-90">Severity: </span>
                            <span className="text-gray-70">{disease.severity}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-90">Transmission: </span>
                            <span className="text-gray-70">{disease.transmission}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="mb-6">
                <h3 className="bold-20 text-gray-90 mb-4">Personalized Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisResult.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-primary-50 rounded-lg">
                      <CheckCircle className="text-primary-600 mt-1 flex-shrink-0" size={20} />
                      <span className="regular-14 text-gray-90">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="bold-18 text-red-800 mb-3">Emergency Contacts</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="bold-16 text-red-700">Ambulance</div>
                    <div className="regular-14 text-red-600">{analysisResult.emergency_contacts.ambulance}</div>
                  </div>
                  <div className="text-center">
                    <div className="bold-16 text-red-700">Health Helpline</div>
                    <div className="regular-14 text-red-600">{analysisResult.emergency_contacts.health_helpline}</div>
                  </div>
                  <div className="text-center">
                    <div className="bold-16 text-red-700">Disaster Management</div>
                    <div className="regular-14 text-red-600">{analysisResult.emergency_contacts.disaster_management}</div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                <p className="regular-12 text-gray-60 italic text-center">{analysisResult.disclaimer}</p>
              </div>
            </div>
          )}

          {/* Reassurance Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-success-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="bold-16 text-gray-90 mb-2">Private & Secure</h3>
              <p className="regular-14 text-gray-50">Your information is kept confidential and secure</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💙</span>
              </div>
              <h3 className="bold-16 text-gray-90 mb-2">Caring Support</h3>
              <p className="regular-14 text-gray-50">We're here to help with compassion and understanding</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-accent-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="bold-16 text-gray-90 mb-2">Quick Response</h3>
              <p className="regular-14 text-gray-50">Get immediate guidance and next steps</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default GetStartedPage

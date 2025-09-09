'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Droplets, Activity, Clock, MapPin } from 'lucide-react'

interface Alert {
  id: string
  text: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  region: string
  source: string
  timestamp: string
  type: 'disease_outbreak' | 'water_quality' | 'contamination' | 'advisory'
}

interface NewsTickerData {
  success: boolean
  alerts: Alert[]
  last_updated: string
  next_update: string
  total_alerts: number
}

const NewsTicker: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load demo alerts (API endpoint not implemented yet)
  const fetchAlerts = async () => {
    try {
      console.log('Loading news ticker alerts...')

      // For now, use demo data since API endpoint is not implemented
      // In production, this would fetch from a real news/alerts API
      const demoAlerts: Alert[] = [
        {
          id: 'demo_1',
          text: '🚨 Water quality alert: High contamination detected in Guwahati region - Boil water before consumption',
          severity: 'high' as const,
          region: 'Assam',
          source: 'Nirogya Health System',
          timestamp: new Date().toISOString(),
          type: 'water_quality' as const
        },
        {
          id: 'demo_2',
          text: '📊 Disease outbreak monitoring: 15 new cases of waterborne illness reported in Imphal',
          severity: 'medium' as const,
          region: 'Manipur',
          source: 'Public Health Department',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          type: 'disease_outbreak' as const
        },
        {
          id: 'demo_3',
          text: '✅ Water treatment plant in Shillong restored to full capacity - Water quality improving',
          severity: 'low' as const,
          region: 'Meghalaya',
          source: 'Water Authority',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          type: 'water_quality' as const
        },
        {
          id: 'demo_4',
          text: '🔬 Weekly water quality report: 85% of tested sources meet safety standards across Northeast',
          severity: 'low' as const,
          region: 'Northeast India',
          source: 'Nirogya System',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          type: 'advisory' as const
        },
        {
          id: 'demo_5',
          text: '⚠️ Monsoon season advisory: Increased risk of waterborne diseases - Take preventive measures',
          severity: 'medium' as const,
          region: 'Northeast India',
          source: 'Health Ministry',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
          type: 'advisory' as const
        }
      ]

      setAlerts(demoAlerts)
      setLastUpdated(new Date().toISOString())
      console.log(`Loaded ${demoAlerts.length} demo alerts`)
      setIsLoading(false)

    } catch (error) {
      console.error('Error loading news ticker alerts:', error)
      // Set minimal fallback data on error
      setAlerts([
        {
          id: 'error_fallback',
          text: 'Nirogya system monitoring water quality and disease outbreaks – Stay safe!',
          severity: 'low' as const,
          region: 'Northeast India',
          source: 'Nirogya System',
          timestamp: new Date().toISOString(),
          type: 'advisory' as const
        }
      ])
      setIsLoading(false)
    }
  }

  // Initialize and set up intervals
  useEffect(() => {
    fetchAlerts()

    // Set up hourly updates
    updateIntervalRef.current = setInterval(fetchAlerts, 60 * 60 * 1000) // 1 hour

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current)
      }
    }
  }, [])

  // Handle ticker rotation
  useEffect(() => {
    if (alerts.length > 1 && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % alerts.length)
      }, 8000) // Change every 8 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [alerts.length, isPaused])

  // Get severity color and icon
  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          bgColor: 'bg-red-600',
          textColor: 'text-white',
          icon: <AlertTriangle className="w-4 h-4" />,
          pulseColor: 'bg-red-400'
        }
      case 'high':
        return {
          bgColor: 'bg-orange-500',
          textColor: 'text-white',
          icon: <AlertTriangle className="w-4 h-4" />,
          pulseColor: 'bg-orange-300'
        }
      case 'medium':
        return {
          bgColor: 'bg-yellow-500',
          textColor: 'text-white',
          icon: <Droplets className="w-4 h-4" />,
          pulseColor: 'bg-yellow-300'
        }
      default:
        return {
          bgColor: 'bg-blue-500',
          textColor: 'text-white',
          icon: <Activity className="w-4 h-4" />,
          pulseColor: 'bg-blue-300'
        }
    }
  }

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'disease_outbreak':
        return <AlertTriangle className="w-4 h-4" />
      case 'water_quality':
        return <Droplets className="w-4 h-4" />
      case 'contamination':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="bg-primary-500 text-white py-2 px-4">
        <div className="max-container flexCenter">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm">Loading health alerts...</span>
          </div>
        </div>
      </div>
    )
  }

  if (alerts.length === 0) {
    return null
  }

  const currentAlert = alerts[currentIndex]
  const severityConfig = getSeverityConfig(currentAlert.severity)

  return (
    <motion.div
      className={`${severityConfig.bgColor} ${severityConfig.textColor} py-2 px-4 relative overflow-hidden`}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background pulse for critical alerts */}
      {currentAlert.severity === 'critical' && (
        <motion.div
          className={`absolute inset-0 ${severityConfig.pulseColor} opacity-20`}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div className="max-container relative z-10">
        <div className="flex items-center justify-between">
          {/* Left side - Flash News label */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <motion.div
              className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded text-xs font-bold"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {getTypeIcon(currentAlert.type)}
              <span>FLASH NEWS</span>
            </motion.div>
          </div>

          {/* Center - Scrolling alert text */}
          <div 
            className="flex-1 mx-4 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAlert.id}
                className="flex items-center space-x-4"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center space-x-2">
                  {severityConfig.icon}
                  <span className="text-sm font-medium whitespace-nowrap">
                    {currentAlert.text}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-xs opacity-80">
                  <MapPin className="w-3 h-3" />
                  <span>{currentAlert.region}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right side - Controls and info */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Alert counter */}
            {alerts.length > 1 && (
              <div className="text-xs bg-white/20 px-2 py-1 rounded">
                {currentIndex + 1}/{alerts.length}
              </div>
            )}

            {/* Last updated */}
            <div className="flex items-center space-x-1 text-xs opacity-80">
              <Clock className="w-3 h-3" />
              <span>
                {lastUpdated ? 
                  new Date(lastUpdated).toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) : 
                  'Now'
                }
              </span>
            </div>

            {/* Manual navigation for multiple alerts */}
            {alerts.length > 1 && (
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentIndex((prev) => (prev - 1 + alerts.length) % alerts.length)}
                  className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded flex items-center justify-center text-xs transition-colors"
                  aria-label="Previous alert"
                >
                  ‹
                </button>
                <button
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % alerts.length)}
                  className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded flex items-center justify-center text-xs transition-colors"
                  aria-label="Next alert"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar for auto-rotation */}
        {alerts.length > 1 && !isPaused && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-white/40"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 8, ease: 'linear' }}
            key={currentIndex}
          />
        )}
      </div>
    </motion.div>
  )
}

export default NewsTicker

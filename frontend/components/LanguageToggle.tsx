'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const LanguageToggle = () => {
  const { currentLanguage, setLanguage, languages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLang = languages.find(lang => lang.code === currentLanguage)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-primary-200 hover:border-primary-300 transition-all duration-200 shadow-sm hover:shadow-md"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe size={16} className="text-primary-600" />
        <span className="text-sm font-medium text-primary-700">
          {currentLang?.flag} {currentLang?.nativeName}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} className="text-primary-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 bg-white border border-primary-200 rounded-xl shadow-lg overflow-hidden z-50 min-w-[200px]"
          >
            <div className="py-2">
              {languages.map((language) => (
                <motion.button
                  key={language.code}
                  onClick={() => {
                    setLanguage(language.code)
                    setIsOpen(false)
                  }}
                  className={`group w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-200 ${
                    currentLanguage === language.code
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                      : 'hover:bg-gray-100 text-gray-700 hover:text-gray-500'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className={`text-lg transition-all duration-200 ${
                    currentLanguage === language.code ? '' : 'group-hover:opacity-60'
                  }`}>{language.flag}</span>
                  <div className="flex-1">
                    <div className={`font-medium text-sm transition-all duration-200 ${
                      currentLanguage === language.code ? '' : 'group-hover:text-gray-400'
                    }`}>{language.nativeName}</div>
                    <div className={`text-xs transition-all duration-200 ${
                      currentLanguage === language.code ? 'text-gray-500' : 'text-gray-500 group-hover:text-gray-400'
                    }`}>{language.name}</div>
                  </div>
                  {currentLanguage === language.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-primary-500 rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </div>
            
            {/* Language Info Footer */}
            <div className="border-t border-primary-100 px-4 py-3 bg-primary-25">
              <p className="text-xs text-primary-600 text-center">
                Northeast India Languages
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageToggle

'use client'

import React from 'react'
import Button from './Button'
import WaterDiseases from './WaterDiseases'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

const Intro = () => {
  const { t } = useLanguage()
  return (
    <section className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 relative">
      <div className="max-container padding-container flex flex-col xl:flex-row gap-12 py-20 md:gap-16 lg:py-32 items-center">
        
        {/* LEFT SIDE — INTRO TEXT */}
        <div className='relative z-20 flex flex-1 flex-col xl:w-1/2'>
          <motion.h1
            className="bold-52 lg:bold-64 text-gray-90 mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('home.title')}
          </motion.h1>

          <motion.p
            className="regular-18 text-primary-600 font-medium mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {t('home.subtitle')}
          </motion.p>

          <motion.p
            className="regular-16 text-gray-50 xl:max-w-[520px] mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {t('home.description')}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link href="/get-started">
              <Button type="button" title={t('home.getStarted')} variant="btn_primary_dark"/>
            </Link>
            <Link href="/waterborne-diseases">
              <Button type="button" title={t('home.learnMore')} variant="btn_white_text"/>
            </Link>
          </motion.div>

          <motion.div
            className="flex items-center gap-6 text-sm text-gray-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary-300 rounded-full"></div>
              <span>{t('home.symptomAnalysis')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent-100 rounded-full"></div>
              <span>{t('home.support247')}</span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE — WATER DISEASES ANIMATION */}
        <div className="relative z-10 flex flex-1 justify-center items-center xl:w-1/2">
          <WaterDiseases />
        </div>

      </div>
    </section>
  )
}

export default Intro

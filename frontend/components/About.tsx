'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

const About = () => {
  const { t } = useLanguage()

  return (
    <section className="bg-white py-20">
      <div className="max-container padding-container">
        <div className="max-w-4xl">
          <motion.h2
            className="bold-40 lg:bold-52 mb-6 text-gray-90 text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t('understanding.title')}
          </motion.h2>
          <motion.p
            className="regular-16 text-gray-50 mb-6 leading-relaxed text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {t('understanding.description')}
          </motion.p>
          <motion.p
            className="regular-16 text-gray-50 mb-8 leading-relaxed text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {t('understanding.commonDiseases')}
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
            <div className="flex items-center gap-3 bg-success-50 p-4 rounded-xl">
              <div className="w-3 h-3 bg-success-100 rounded-full"></div>
              <span className="regular-14 text-gray-90 font-medium">{t('tabs.prevention')}</span>
            </div>
            <div className="flex items-center gap-3 bg-primary-50 p-4 rounded-xl">
              <div className="w-3 h-3 bg-primary-300 rounded-full"></div>
              <span className="regular-14 text-gray-90 font-medium">{t('tabs.awareness')}</span>
            </div>
            <div className="flex items-center gap-3 bg-accent-50 p-4 rounded-xl">
              <div className="w-3 h-3 bg-accent-100 rounded-full"></div>
              <span className="regular-14 text-gray-90 font-medium">{t('tabs.treatment')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

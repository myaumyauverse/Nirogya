'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertTriangle, Users, Clock, MapPin } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const WaterborneDiseasesPage = () => {
  const { t } = useLanguage()
  const diseases = [
    {
      id: 'cholera',
      name: 'Cholera',
      severity: 'High',
      severityColor: 'bg-red-500',
      description: 'A severe diarrheal disease caused by Vibrio cholerae bacteria',
      symptoms: ['Severe watery diarrhea', 'Vomiting', 'Dehydration', 'Muscle cramps', 'Shock'],
      transmission: 'Contaminated water and food, poor sanitation',
      mortality: '50-70% if untreated, <1% with proper treatment',
      prevention: ['Safe drinking water', 'Proper sanitation', 'Good hygiene practices', 'Oral rehydration therapy'],
      impact: 'Can cause devastating outbreaks, particularly in areas with poor water infrastructure. Endemic in many developing regions.'
    },
    {
      id: 'typhoidFever',
      name: 'Typhoid Fever',
      severity: 'High',
      severityColor: 'bg-red-500',
      description: 'A bacterial infection caused by Salmonella typhi',
      symptoms: ['High fever', 'Headache', 'Abdominal pain', 'Rose-colored rash', 'Weakness'],
      transmission: 'Contaminated water, food handled by infected persons',
      mortality: '10-20% if untreated, 1-4% with treatment',
      prevention: ['Vaccination', 'Safe water', 'Food safety', 'Proper sanitation'],
      impact: 'Affects approximately 17 million people worldwide annually. Can lead to serious complications if untreated.'
    },
    {
      id: 'hepatitisA',
      name: 'Hepatitis A',
      severity: 'Moderate',
      severityColor: 'bg-orange-500',
      description: 'A viral infection affecting the liver',
      symptoms: ['Fatigue', 'Nausea', 'Abdominal pain', 'Jaundice', 'Dark urine'],
      transmission: 'Contaminated water and food, poor hygiene',
      mortality: 'Low (0.1-0.3%), higher in elderly',
      prevention: ['Vaccination', 'Safe water', 'Good hygiene', 'Proper sanitation'],
      impact: 'Common in areas with poor sanitation. Early infection provides lifelong immunity.'
    },
    {
      id: 'dysentery',
      name: 'Dysentery',
      severity: 'Moderate',
      severityColor: 'bg-orange-500',
      description: 'Severe diarrhea containing blood and mucus, caused by Shigella bacteria',
      symptoms: ['Bloody diarrhea', 'Fever', 'Abdominal cramps', 'Tenesmus', 'Dehydration'],
      transmission: 'Contaminated water, poor sanitation, person-to-person',
      mortality: '5-15% in severe cases if untreated',
      prevention: ['Safe water', 'Hand hygiene', 'Proper sanitation', 'Food safety'],
      impact: 'Particularly affects children under 5. Can lead to complications like hemolytic uremic syndrome.'
    },
    {
      id: 'giardiasis',
      name: 'Giardiasis',
      severity: 'Moderate',
      severityColor: 'bg-yellow-500',
      description: 'A parasitic infection caused by Giardia lamblia',
      symptoms: ['Diarrhea', 'Gas', 'Greasy stools', 'Stomach cramps', 'Nausea'],
      transmission: 'Contaminated water, person-to-person contact',
      mortality: 'Very low, but can cause chronic symptoms',
      prevention: ['Water treatment', 'Good hygiene', 'Avoiding contaminated water sources'],
      impact: 'Common in developing countries. Can cause persistent symptoms and malnutrition in children.'
    },
    {
      id: 'cryptosporidiosis',
      name: 'Cryptosporidiosis',
      severity: 'Moderate',
      severityColor: 'bg-yellow-500',
      description: 'A parasitic disease caused by Cryptosporidium',
      symptoms: ['Watery diarrhea', 'Stomach cramps', 'Nausea', 'Vomiting', 'Fever'],
      transmission: 'Contaminated water, resistant to chlorination',
      mortality: 'Low in healthy individuals, higher in immunocompromised',
      prevention: ['Proper water filtration', 'Boiling water', 'Good hygiene'],
      impact: 'Particularly dangerous for immunocompromised individuals. Resistant to standard water treatment.'
    }
  ]

  const regionalStats = [
    { label: t('global.annualDeaths'), value: '1.7 million', icon: Users },
    { label: t('global.childrenAffected'), value: '90%', icon: Users },
    { label: t('global.peopleWithoutWater'), value: '1.1 billion', icon: MapPin },
    { label: t('global.diseaseBurden'), value: '54.2 million', icon: Clock }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-primary-200">
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-primary-600 group">
              <span className="text-primary-600 font-semibold group-hover:text-white transition-colors duration-300">{t('nav.backToHome')}</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <span className="bold-20 text-primary-600">Nirogya</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-container padding-container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
              <AlertTriangle className="text-primary-600" size={32} />
            </div>
            <h1 className="bold-52 lg:bold-64 text-gray-90 mb-6">
              {t('waterborne.title')}
            </h1>
            <p className="regular-18 text-primary-600 font-medium mb-4">
              {t('waterborne.subtitle')}
            </p>
            <p className="regular-16 text-gray-50 max-w-3xl mx-auto leading-relaxed">
              {t('waterborne.description')}
            </p>
          </motion.div>

          {/* Statistics */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {regionalStats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md border border-primary-100"
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="flex items-center gap-3 mb-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <motion.div
                    className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  >
                    <stat.icon className="text-primary-600" size={20} />
                  </motion.div>
                  <span className="regular-14 text-gray-50">{stat.label}</span>
                </motion.div>
                <motion.p
                  className="bold-24 text-primary-600"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                >
                  {stat.value}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Diseases Section */}
      <section className="py-16 bg-white">
        <div className="max-container padding-container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="bold-40 lg:bold-48 text-gray-90 mb-4">
              {t('diseases.title')}
            </h2>
            <p className="regular-16 text-gray-50 max-w-2xl mx-auto">
              {t('diseases.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {diseases.map((disease, index) => (
              <motion.div
                key={disease.id}
                className="bg-gradient-to-br from-white to-primary-50 rounded-2xl p-8 shadow-lg border border-primary-100"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Disease Header */}
                <motion.div
                  className="flex items-start justify-between mb-6"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <span className="text-white text-lg font-bold">{index + 1}</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    >
                      <h3 className="bold-24 text-gray-90 mb-1">{t(`disease.${disease.id}`) || disease.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="regular-14 text-gray-50">{t('waterborne.severity')}:</span>
                        <motion.span
                          className={`px-3 py-1 rounded-full text-white text-sm font-medium ${disease.severityColor}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                        >
                          {t(`disease.${disease.severity.toLowerCase()}`)}
                        </motion.span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Description */}
                <motion.p
                  className="regular-16 text-gray-50 mb-6 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  {disease.description}
                </motion.p>

                {/* Details Grid */}
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                >
                  {/* Symptoms */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    <h4 className="bold-16 text-gray-90 mb-3">{t('waterborne.commonSymptoms')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {disease.symptoms.map((symptom, idx) => (
                        <motion.span
                          key={idx}
                          className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.9 + index * 0.1 + idx * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {symptom}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Transmission & Mortality */}
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
                    >
                      <h4 className="bold-14 text-gray-90 mb-2">{t('waterborne.transmission')}</h4>
                      <p className="regular-14 text-gray-50">{disease.transmission}</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                    >
                      <h4 className="bold-14 text-gray-90 mb-2">{t('waterborne.mortalityRate')}</h4>
                      <p className="regular-14 text-gray-50">{disease.mortality}</p>
                    </motion.div>
                  </motion.div>

                  {/* Prevention */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
                  >
                    <h4 className="bold-16 text-gray-90 mb-3">{t('waterborne.preventionMethods')}</h4>
                    <ul className="space-y-1">
                      {disease.prevention.map((method, idx) => (
                        <motion.li
                          key={idx}
                          className="regular-14 text-gray-50 flex items-center gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 1.4 + index * 0.1 + idx * 0.05 }}
                        >
                          <motion.div
                            className="w-1.5 h-1.5 bg-primary-500 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2, delay: 1.5 + index * 0.1 + idx * 0.05 }}
                          ></motion.div>
                          {method}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Impact */}
                  <motion.div
                    className="bg-primary-50 rounded-lg p-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h4 className="bold-14 text-primary-700 mb-2">{t('waterborne.impactSignificance')}</h4>
                    <p className="regular-14 text-primary-600">{disease.impact}</p>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Northeast India Specific Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="max-container padding-container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="bold-40 lg:bold-48 text-gray-90 mb-4">
              {t('northeast.title')}
            </h2>
            <p className="regular-16 text-gray-50 max-w-3xl mx-auto">
              {t('northeast.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <motion.div
              className="bg-white rounded-xl p-6 shadow-md"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="text-blue-600" size={24} />
              </div>
              <h3 className="bold-20 text-gray-90 mb-3">{t('northeast.geographicFactors')}</h3>
              <ul className="space-y-2 regular-14 text-gray-50">
                <li>• {t('geo.highRainfall')}</li>
                <li>• {t('geo.mountainous')}</li>
                <li>• {t('geo.remoteCommunities')}</li>
                <li>• {t('geo.limitedInfrastructure')}</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="text-green-600" size={24} />
              </div>
              <h3 className="bold-20 text-gray-90 mb-3">{t('northeast.commonIssues')}</h3>
              <ul className="space-y-2 regular-14 text-gray-50">
                <li>• {t('issues.contaminatedWater')}</li>
                <li>• {t('issues.poorSanitation')}</li>
                <li>• {t('issues.seasonalOutbreaks')}</li>
                <li>• {t('issues.limitedHealthcare')}</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-md"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Users className="text-purple-600" size={24} />
              </div>
              <h3 className="bold-20 text-gray-90 mb-3">{t('northeast.vulnerableGroups')}</h3>
              <ul className="space-y-2 regular-14 text-gray-50">
                <li>• {t('vulnerable.childrenUnder5')}</li>
                <li>• {t('vulnerable.pregnantWomen')}</li>
                <li>• {t('vulnerable.elderly')}</li>
                <li>• {t('vulnerable.immunocompromised')}</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Prevention & Action Section */}
      <section className="py-16 bg-white">
        <div className="max-container padding-container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h2 className="bold-40 lg:bold-48 text-gray-90 mb-4">
              {t('prevention.title')}
            </h2>
            <p className="regular-16 text-gray-50 max-w-2xl mx-auto">
              {t('prevention.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: t('prevention.waterTreatment'),
                icon: "💧",
                steps: ["Boil water for 1 minute", "Use water purification tablets", "Install proper filtration systems", "Store treated water safely"]
              },
              {
                title: t('prevention.sanitation'),
                icon: "🚿",
                steps: ["Use proper toilet facilities", "Dispose of waste safely", "Keep water sources clean", "Maintain drainage systems"]
              },
              {
                title: t('prevention.personalHygiene'),
                icon: "🧼",
                steps: ["Wash hands frequently", "Use soap and clean water", "Avoid contaminated food", "Practice safe food handling"]
              },
              {
                title: t('prevention.communityAction'),
                icon: "🏘️",
                steps: ["Report water contamination", "Support infrastructure projects", "Educate family and neighbors", "Follow health guidelines"]
              },
              {
                title: t('prevention.medicalCare'),
                icon: "🏥",
                steps: ["Seek early treatment", "Get vaccinated when available", "Follow medication schedules", "Monitor symptoms closely"]
              },
              {
                title: t('prevention.emergencyResponse'),
                icon: "🚨",
                steps: ["Know warning signs", "Have oral rehydration salts", "Contact healthcare providers", "Follow outbreak protocols"]
              }
            ].map((category, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-6 shadow-md border border-primary-100"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
              >
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="bold-20 text-gray-90">{category.title}</h3>
                </div>
                <ul className="space-y-2">
                  {category.steps.map((step, idx) => (
                    <li key={idx} className="regular-14 text-gray-50 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                      {step}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-500">
        <div className="max-container padding-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <h2 className="bold-40 lg:bold-48 text-white mb-4">
              {t('cta.needHelp')}
            </h2>
            <p className="regular-18 text-primary-100 mb-8 max-w-2xl mx-auto">
              {t('cta.helpDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started">
                <button className="px-8 py-4 bg-white text-primary-600 rounded-xl bold-16 hover:bg-primary-50 transition-all transform hover:scale-105 shadow-lg">
                  {t('cta.analyzeSymptoms')}
                </button>
              </Link>
              <Link href="/">
                <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl bold-16 hover:bg-white hover:text-primary-600 transition-all transform hover:scale-105">
                  {t('cta.backToHome')}
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default WaterborneDiseasesPage

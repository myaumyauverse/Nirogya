'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'as' | 'bn' | 'hi' | 'mni' | 'garo'

export interface LanguageOption {
  code: Language
  name: string
  nativeName: string
  flag: string
}

export const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', flag: '🇮🇳' },
  { code: 'garo', name: 'Garo', nativeName: 'A·chik', flag: '🇮🇳' }
]

interface LanguageContextType {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
  languages: LanguageOption[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: React.ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en')

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('preferred-language') as Language
    if (savedLanguage && languages.find(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
    localStorage.setItem('preferred-language', language)
  }

  const t = (key: string): string => {
    return getTranslation(key, currentLanguage)
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Translation function
const getTranslation = (key: string, language: Language): string => {
  const translations = getTranslations()
  return translations[language]?.[key] || translations['en'][key] || key
}

// Translations object
const getTranslations = () => ({
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.getStarted': 'Get Started',
    'nav.testimonials': 'Testimonials',
    'nav.statistics': 'Statistics',
    'nav.doctorLogin': 'Doctor Login',
    'nav.logout': 'Logout',
    'nav.backToHome': '← Back to Home',

    // Home Page
    'home.title': 'Waterborne Disease Awareness',
    'home.subtitle': 'Northeast India',
    'home.description': 'Empowering communities with knowledge and tools to prevent waterborne diseases. Get instant symptom analysis, learn about prevention, and access healthcare resources.',
    'home.getStarted': 'Get Started',
    'home.learnMore': 'Learn More',
    'home.symptomAnalysis': 'Symptom Analysis',
    'home.support247': '24/7 Support',
    'home.hepatitisA': 'Hepatitis A',
    'home.hepatitisADesc': 'A viral liver infection transmitted through contaminated water and food.',

    // Statistics Page
    'stats.title': 'Waterborne Disease Statistics',
    'stats.subtitle': 'Northeast India - Comprehensive Data Analysis',
    'stats.description': 'Based on NFHS-5 (2019-21) data and ongoing health surveillance, this comprehensive analysis provides insights into waterborne disease patterns across Northeast India\'s eight states.',
    'stats.totalPopulation': 'TOTAL POPULATION AFFECTED',
    'stats.highestDiarrhea': 'HIGHEST DIARRHEA RATE',
    'stats.averageFever': 'AVERAGE FEVER CASES',
    'stats.statesMonitored': 'STATES MONITORED',
    'stats.peopleAtRisk': 'People at risk in Northeast India',
    'stats.criticalLevel': 'Critical level',
    'stats.acrossAllStates': 'Across all 8 states',
    'stats.completeNortheast': 'Complete Northeast coverage',
    'stats.coverage': '100% coverage',

    // Understanding Section
    'understanding.title': 'Understanding Waterborne Diseases',
    'understanding.description': 'Waterborne diseases are caused by pathogenic microorganisms that are transmitted in water. These diseases can be spread while bathing, washing, drinking water, or by eating food exposed to contaminated water.',
    'understanding.commonDiseases': 'Common waterborne diseases include cholera, typhoid, hepatitis A, diarrhea, and dysentery. Prevention is key to avoiding these diseases through proper water treatment, sanitation, and hygiene practices.',

    // Doctor Login
    'doctor.login.title': 'Doctor Login',
    'doctor.login.subtitle': 'Access your medical dashboard',
    'doctor.login.name': 'Doctor Name',
    'doctor.login.namePlaceholder': 'Dr. John Doe',
    'doctor.login.email': 'Email Address',
    'doctor.login.emailPlaceholder': 'doctor@nirogya.in',
    'doctor.login.password': 'Password',
    'doctor.login.passwordPlaceholder': '••••••••',
    'doctor.login.loginButton': 'Login',

    // Doctor Dashboard
    'doctor.dashboard.title': 'Doctor Dashboard',
    'doctor.dashboard.greeting': 'Hi',

    // Prediction Component
    'prediction.title': 'Disease Prediction',
    'prediction.outbreakInfo.title': 'Outbreak Information',
    'prediction.outbreakInfo.cases': 'Number of Cases',
    'prediction.outbreakInfo.state': 'Northeast State',
    'prediction.outbreakInfo.month': 'Outbreak Month',
    'prediction.waterQuality.title': 'Water Quality Parameters',
    'prediction.waterQuality.ph': 'pH Level (0.0-14.0)',
    'prediction.waterQuality.dissolvedOxygen': 'Dissolved Oxygen (mg/L)',
    'prediction.waterQuality.bod': 'BOD (mg/L)',
    'prediction.waterQuality.nitrate': 'Nitrate-N (mg/L)',
    'prediction.waterQuality.fecalColiform': 'Fecal Coliform (CFU/100ml)',
    'prediction.waterQuality.totalColiform': 'Total Coliform (CFU/100ml)',
    'prediction.waterQuality.temperature': 'Temperature (°C)',
    'prediction.analyzeButton': '🧪 Run Complete Disease-Water Analysis',
    'prediction.analyzing': 'Analyzing...',

    // States
    'states.arunachal': 'Arunachal Pradesh',
    'states.assam': 'Assam',
    'states.manipur': 'Manipur',
    'states.meghalaya': 'Meghalaya',
    'states.mizoram': 'Mizoram',
    'states.nagaland': 'Nagaland',
    'states.sikkim': 'Sikkim',
    'states.tripura': 'Tripura',

    // Months
    'months.january': 'January',
    'months.february': 'February',
    'months.march': 'March',
    'months.april': 'April',
    'months.may': 'May',
    'months.june': 'June',
    'months.july': 'July',
    'months.august': 'August',
    'months.september': 'September',
    'months.october': 'October',
    'months.november': 'November',
    'months.december': 'December',

    // RecordBook Component
    'recordBook.title': 'Patient Records',
    'recordBook.searchPlaceholder': 'Search by patient name, disease, or location...',
    'recordBook.addRecord': 'Add New Record',
    'recordBook.patientName': 'Patient Name',
    'recordBook.age': 'Age',
    'recordBook.disease': 'Disease',
    'recordBook.location': 'Location',
    'recordBook.date': 'Date',
    'recordBook.status': 'Status',
    'recordBook.actions': 'Actions',
    'recordBook.noRecords': 'No records found matching your search criteria.',
    'recordBook.edit': 'Edit',
    'recordBook.delete': 'Delete',
    'recordBook.showing': 'Showing',
    'recordBook.of': 'of',
    'recordBook.records': 'records',
    'recordBook.cases': 'Cases',
    'recordBook.deaths': 'Deaths',
    'recordBook.state': 'State',
    'recordBook.district': 'District',

    // Prediction Analysis Results
    'prediction.error.title': 'Analysis Error',
    'prediction.results.title': 'Disease-Water Quality Analysis Results',
    'prediction.results.diseaseTitle': 'Disease Prediction Analysis',
    'prediction.results.mostLikely': 'Most Likely Disease',
    'prediction.results.basedOn': 'Based on outbreak data and water quality analysis',
    'prediction.results.confidence': 'Confidence',
    'prediction.results.riskLevel': 'Risk Level',
    'prediction.results.waterAssessment': 'Water Quality Assessment',
    'prediction.results.wqi': 'Water Quality Index (WQI)',
    'prediction.results.category': 'Category',
    'prediction.results.riskFactors': 'Risk Factors',
    'prediction.results.violations': 'Parameter Violations',
    'prediction.results.recommendations': 'Recommendations',
    'prediction.results.futureOutlook': 'Future Outbreak Predictions',
    'prediction.results.cases': 'Cases',
    'prediction.results.disease': 'Disease',
    'prediction.results.seasonalFactor': 'Seasonal Factor',
    'prediction.results.summary': 'Analysis Summary',
    'prediction.results.summaryText': 'This comprehensive report combines disease outbreak predictions, water quality assessment, correlation analysis, and future trends to provide actionable health insights. The analysis uses ML models with 91.6% accuracy and WHO/BIS water quality standards for assessment.',
    'prediction.results.futureTitle': '3-Month Future Outbreak Predictions',
    'prediction.results.combinedRisk': 'Combined Risk',
    'prediction.results.correlationRisk': 'Correlation Risk',
    'prediction.results.waterRisk': 'Water Risk',
    'prediction.results.diseaseRisk': 'Disease Risk',

    // Global Statistics
    'global.annualDeaths': 'Annual Deaths Globally',
    'global.childrenAffected': 'Children Under 5 Affected',
    'global.peopleWithoutWater': 'People Without Safe Water',
    'global.diseaseBurden': 'Disease Burden (DALYs)',

    // Major Diseases
    'diseases.title': 'Major Waterborne Diseases',
    'diseases.subtitle': 'Learn about the most common waterborne diseases, their symptoms, transmission methods, and prevention strategies.',

    // Individual Disease Names and Descriptions
    'diseases.cholera': 'Cholera',
    'diseases.choleraDesc': 'A bacterial infection causing severe diarrhea and dehydration, commonly spread by unsafe water.',
    'diseases.typhoid': 'Typhoid',
    'diseases.typhoidDesc': 'A bacterial disease spread by contaminated food and water, causing fever, weakness, and abdominal pain.',
    'diseases.dysentery': 'Dysentery',
    'diseases.dysenteryDesc': 'An intestinal infection causing bloody diarrhea, usually caused by unsafe drinking water.',
    'diseases.giardiasis': 'Giardiasis',
    'diseases.giardiasisDesc': 'A parasitic disease causing stomach cramps and diarrhea, spread via unsafe water.',

    // Action Tabs
    'tabs.prevention': 'Prevention',
    'tabs.awareness': 'Awareness',
    'tabs.treatment': 'Treatment',

    // Take Action Section
    'action.title': 'Take Action Today',
    'action.description': 'Use our tools to assess symptoms, learn about prevention, or access healthcare resources.',
    'action.symptomAnalysis': 'Symptom Analysis',
    'action.learnMore': 'Learn More',

    // Key Insights Cards
    'insights.monsoonImpact': 'Monsoon Impact',
    'insights.monsoonInsight': 'Disease rates increase by 40-60% during monsoon season (June-September)',
    'insights.monsoonRecommendation': 'Strengthen preventive measures before monsoon onset',
    'insights.geographicHotspots': 'Geographic Hotspots',
    'insights.geographicInsight': 'Meghalaya consistently shows 2-3x higher rates than other states',
    'insights.geographicRecommendation': 'Targeted interventions in high-risk areas needed',
    'insights.ageVulnerability': 'Age Vulnerability',
    'insights.ageInsight': 'Children under 5 account for 70% of severe cases',
    'insights.ageRecommendation': 'Focus on pediatric care and maternal education',
    'insights.waterQuality': 'Water Quality',
    'insights.waterInsight': 'States with better water infrastructure show 50% lower rates',
    'insights.waterRecommendation': 'Accelerate clean water access programs',
    'insights.healthcareAccess': 'Healthcare Access',
    'insights.healthcareInsight': 'Early treatment reduces mortality by 80-90%',
    'insights.healthcareRecommendation': 'Improve rural healthcare facility coverage',
    'insights.preventionSuccess': 'Prevention Success',
    'insights.preventionInsight': 'Vaccination programs show 60% reduction in target diseases',
    'insights.preventionRecommendation': 'Expand immunization coverage in remote areas',

    // Chart Sections
    'charts.seasonalTrends': 'Seasonal Trends',
    'charts.seasonalDescription': 'Monthly variation patterns showing peak seasons for different waterborne diseases.',
    'charts.diseaseComparison': 'Disease Comparison Analysis',
    'charts.diseaseComparisonDescription': 'Comparative analysis of different waterborne diseases across the region.',
    'charts.stateAnalysis': 'State-wise Analysis',
    'charts.stateAnalysisDescription': 'Detailed breakdown of waterborne disease prevalence across all Northeast Indian states.',
    'charts.monthlyPrevalence': 'Monthly Disease Prevalence (%)',
    'charts.monsoonNote': 'Monsoon season (June-September) shows highest rates',
    'charts.regionalAnalysis': 'Regional Analysis',
    'charts.averageRate': 'Average Rate',
    'charts.highestIn': 'Highest In',
    'charts.peakRate': 'Peak Rate',

    // Table Headers
    'table.state': 'State',
    'table.diarrhea': 'Diarrhea',
    'table.fever': 'Fever',
    'table.ari': 'ARI',
    'table.stateWisePrevalence': 'State-wise Waterborne Disease Prevalence (%)',
    'table.highestRisk': 'Highest Risk',
    'table.preventionWorks': 'Prevention Works',

    // Waterborne Diseases Page
    'waterborne.title': 'Understanding Waterborne Diseases',
    'waterborne.subtitle': 'Comprehensive Guide for Northeast India',
    'waterborne.description': 'Waterborne diseases are illnesses caused by pathogens transmitted through contaminated water. These diseases pose significant health challenges, particularly in developing regions where access to clean water and proper sanitation may be limited.',
    'waterborne.severity': 'Severity',
    'waterborne.commonSymptoms': 'Common Symptoms',
    'waterborne.transmission': 'Transmission',
    'waterborne.mortalityRate': 'Mortality Rate',
    'waterborne.preventionMethods': 'Prevention Methods',
    'waterborne.impactSignificance': 'Impact & Significance',

    // Northeast India Section
    'northeast.title': 'Northeast India: Unique Challenges',
    'northeast.description': 'The northeastern states of India face specific challenges related to waterborne diseases due to geographical, climatic, and infrastructural factors.',
    'northeast.geographicFactors': 'Geographic Factors',
    'northeast.commonIssues': 'Common Issues',
    'northeast.vulnerableGroups': 'Vulnerable Groups',

    // Prevention Section
    'prevention.title': 'Prevention & Action Steps',
    'prevention.description': 'Take these essential steps to protect yourself and your community from waterborne diseases.',
    'prevention.waterTreatment': 'Water Treatment',
    'prevention.sanitation': 'Sanitation',
    'prevention.personalHygiene': 'Personal Hygiene',
    'prevention.communityAction': 'Community Action',
    'prevention.medicalCare': 'Medical Care',
    'prevention.emergencyResponse': 'Emergency Response',

    // Call to Action
    'cta.needHelp': 'Need Immediate Help?',
    'cta.helpDescription': 'If you\'re experiencing symptoms or need guidance on waterborne diseases, our symptom analysis tool can help provide personalized recommendations.',
    'cta.analyzeSymptoms': 'Analyze Symptoms',
    'cta.backToHome': 'Back to Home',

    // Disease Names and Severity
    'disease.cholera': 'Cholera',
    'disease.typhoidFever': 'Typhoid Fever',
    'disease.hepatitisA': 'Hepatitis A',
    'disease.dysentery': 'Dysentery',
    'disease.giardiasis': 'Giardiasis',
    'disease.cryptosporidiosis': 'Cryptosporidiosis',
    'disease.high': 'High',
    'disease.moderate': 'Moderate',

    // Geographic Factors
    'geo.highRainfall': 'High rainfall and flooding',
    'geo.mountainous': 'Mountainous terrain',
    'geo.remoteCommunities': 'Remote rural communities',
    'geo.limitedInfrastructure': 'Limited infrastructure access',

    // Common Issues
    'issues.contaminatedWater': 'Contaminated water sources',
    'issues.poorSanitation': 'Poor sanitation facilities',
    'issues.seasonalOutbreaks': 'Seasonal disease outbreaks',
    'issues.limitedHealthcare': 'Limited healthcare access',

    // Vulnerable Groups
    'vulnerable.childrenUnder5': 'Children under 5 years',
    'vulnerable.pregnantWomen': 'Pregnant women',
    'vulnerable.elderly': 'Elderly population',
    'vulnerable.immunocompromised': 'Immunocompromised individuals',

    // Key Insights Cards
    'insights.highestRiskDescription': 'shows the highest prevalence across all waterborne diseases:',
    'insights.diarrhea': 'Diarrhea: 10% (highest)',
    'insights.fever': 'Fever: 23% (highest)',
    'insights.ari': 'ARI: 4.8% (highest)',
    'insights.contributingFactors': 'Contributing Factors',
    'insights.contributingDescription': 'Research shows higher prevalence linked to:',
    'insights.poorSanitation': 'Poor sanitation facilities',
    'insights.lackCleanWater': 'Lack of clean water access',
    'insights.lowerSocioeconomic': 'Lower socioeconomic status',
    'insights.ruralLiving': 'Rural living conditions',
    'insights.preventionDescription': 'States with better outcomes show:',
    'insights.improvedWaterTreatment': 'Improved water treatment',
    'insights.betterSanitationCoverage': 'Better sanitation coverage',
    'insights.healthEducationPrograms': 'Health education programs',
    'insights.vaccinationInitiatives': 'Vaccination initiatives',

    // Additional missing keys
    'stats.peopleAtRisk': 'People at risk in Northeast India',
    'stats.criticalLevel': 'Critical level',
    'stats.acrossAllStates': 'Across all 8 states',
    'stats.completeNortheast': 'Complete Northeast coverage',
    'stats.coverage': '100% coverage',

    // Get Started Page
    'getStarted.title': 'We\'re Here to Help You',
    'getStarted.subtitle': 'Your health and well-being matter to us. Please share some basic information so we can provide you with the most relevant guidance and support.',
    'getStarted.disclaimer': 'This tool provides general health information and is not a substitute for professional medical advice.',
    'getStarted.form.name': 'Your Name',
    'getStarted.form.namePlaceholder': 'Enter your full name',
    'getStarted.form.age': 'Age',
    'getStarted.form.agePlaceholder': 'Enter your age',
    'getStarted.form.location': 'Location',
    'getStarted.form.locationPlaceholder': 'City, State',
    'getStarted.form.symptoms': 'Describe Your Symptoms',
    'getStarted.form.symptomsPlaceholder': 'Please describe what you\'re experiencing in detail...',
    'getStarted.form.voiceInput': 'Start Voice Input',
    'getStarted.form.stopRecording': '🔴 Stop Recording',
    'getStarted.form.clearText': 'Clear Text',
    'getStarted.form.submit': 'Get Personalized Guidance',
    'getStarted.form.analyzing': 'Analyzing Symptoms...',
    'getStarted.form.submitDescription': 'We\'ll analyze your information and provide helpful resources and recommendations.',

    // Statistics Page
    'stats.title': 'Waterborne Disease Statistics',
    'stats.subtitle': 'Northeast India - Comprehensive Data Analysis',
    'stats.description': 'Based on NFHS-5 (2019-21) data and ongoing health surveillance, this comprehensive analysis provides insights into waterborne disease patterns across Northeast India\'s eight states.',
    'stats.totalPopulation': 'Total Population Affected',
    'stats.highestDiarrhea': 'Highest Diarrhea Rate',
    'stats.averageFever': 'Average Fever Cases',
    'stats.statesMonitored': 'States Monitored',

    // Waterborne Diseases Page
    'diseases.title': 'Waterborne Diseases in Northeast India',
    'diseases.subtitle': 'Comprehensive Guide to Prevention and Treatment',
    'diseases.description': 'Learn about the most common waterborne diseases affecting communities in Northeast India, their symptoms, prevention methods, and treatment options.',

    // Common Terms
    'common.diarrhea': 'Diarrhea',
    'common.fever': 'Fever',
    'common.ari': 'ARI',
    'common.symptoms': 'Symptoms',
    'common.prevention': 'Prevention',
    'common.treatment': 'Treatment',
    'common.severity': 'Severity',
    'common.high': 'High',
    'common.medium': 'Medium',
    'common.low': 'Low',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  },

  as: {
    // Navigation
    'nav.home': 'ঘৰ',
    'nav.getStarted': 'আৰম্ভ কৰক',
    'nav.testimonials': 'প্ৰশংসাপত্ৰ',
    'nav.statistics': 'পৰিসংখ্যা',
    'nav.doctorLogin': 'চিকিৎসক লগইন',
    'nav.logout': 'লগআউট',
    'nav.backToHome': '← ঘৰলৈ উভতি যাওক',

    // Home Page
    'home.title': 'পানীজনিত ৰোগৰ সজাগতা',
    'home.subtitle': 'উত্তৰ-পূৰ্ব ভাৰত',
    'home.description': 'পানীজনিত ৰোগ প্ৰতিৰোধৰ বাবে জ্ঞান আৰু সঁজুলিৰে সমাজক শক্তিশালী কৰা। তৎক্ষণাৎ লক্ষণ বিশ্লেষণ, প্ৰতিৰোধৰ বিষয়ে জানক আৰু স্বাস্থ্যসেৱা সম্পদ লাভ কৰক।',
    'home.getStarted': 'আৰম্ভ কৰক',
    'home.learnMore': 'অধিক জানক',
    'home.symptomAnalysis': 'লক্ষণ বিশ্লেষণ',
    'home.support247': '২৪/৭ সহায়তা',
    'home.hepatitisA': 'হেপাটাইটিছ এ',
    'home.hepatitisADesc': 'দূষিত পানী আৰু খাদ্যৰ জৰিয়তে সংক্ৰমিত হোৱা এক ভাইৰেল যকৃতৰ সংক্ৰমণ।',

    // Statistics Page
    'stats.title': 'পানীজনিত ৰোগৰ পৰিসংখ্যা',
    'stats.subtitle': 'উত্তৰ-পূৰ্ব ভাৰত - বিস্তৃত তথ্য বিশ্লেষণ',
    'stats.description': 'NFHS-5 (2019-21) তথ্য আৰু চলমান স্বাস্থ্য নিৰীক্ষণৰ ভিত্তিত, এই বিস্তৃত বিশ্লেষণে উত্তৰ-পূৰ্ব ভাৰতৰ আঠটা ৰাজ্যত পানীজনিত ৰোগৰ আৰ্হিৰ অন্তৰ্দৃষ্টি প্ৰদান কৰে।',
    'stats.totalPopulation': 'মুঠ প্ৰভাৱিত জনসংখ্যা',
    'stats.highestDiarrhea': 'সৰ্বোচ্চ ডায়েৰিয়াৰ হাৰ',
    'stats.averageFever': 'গড় জ্বৰৰ ক্ষেত্ৰ',
    'stats.statesMonitored': 'নিৰীক্ষণ কৰা ৰাজ্যসমূহ',
    'stats.peopleAtRisk': 'উত্তৰ-পূৰ্ব ভাৰতত বিপদত থকা লোক',
    'stats.criticalLevel': 'গুৰুতৰ স্তৰ',
    'stats.acrossAllStates': 'সকলো ৮টা ৰাজ্যত',
    'stats.completeNortheast': 'সম্পূৰ্ণ উত্তৰ-পূৰ্ব কভাৰেজ',
    'stats.coverage': '১০০% কভাৰেজ',

    // Understanding Section
    'understanding.title': 'পানীজনিত ৰোগ বুজা',
    'understanding.description': 'পানীজনিত ৰোগ ৰোগজনক অণুজীৱৰ দ্বাৰা হয় যি পানীত সংক্ৰমিত হয়। এই ৰোগসমূহ গা ধোৱা, ধোৱা, পানী খোৱা বা দূষিত পানীৰ সংস্পৰ্শত অহা খাদ্য খোৱাৰ সময়ত বিয়পিব পাৰে।',
    'understanding.commonDiseases': 'সাধাৰণ পানীজনিত ৰোগসমূহৰ ভিতৰত হৈজা, টাইফয়েড, হেপাটাইটিছ এ, ডায়েৰিয়া আৰু আমাশয় আছে। উপযুক্ত পানী শোধন, স্বাস্থ্যবিধি আৰু পৰিষ্কাৰ-পৰিচ্ছন্নতাৰ অভ্যাসৰ জৰিয়তে এই ৰোগসমূহ প্ৰতিৰোধ কৰাটো মুখ্য।',

    // Global Statistics
    'global.annualDeaths': 'বিশ্বব্যাপী বাৰ্ষিক মৃত্যু',
    'global.childrenAffected': '৫ বছৰৰ তলৰ শিশু প্ৰভাৱিত',
    'global.peopleWithoutWater': 'নিৰাপদ পানী নোহোৱা লোক',
    'global.diseaseBurden': 'ৰোগৰ বোজা (DALYs)',

    // Major Diseases
    'diseases.title': 'প্ৰধান পানীজনিত ৰোগ',
    'diseases.subtitle': 'সবচেয়ে সাধাৰণ পানীজনিত ৰোগ, সিহঁতৰ লক্ষণ, সংক্ৰমণৰ পদ্ধতি আৰু প্ৰতিৰোধৰ কৌশলৰ বিষয়ে জানক।',

    // Individual Disease Names and Descriptions
    'diseases.cholera': 'হৈজা',
    'diseases.choleraDesc': 'এক বেক্টেৰিয়াজনিত সংক্ৰমণ যি গুৰুতৰ ডায়েৰিয়া আৰু পানীশূন্যতাৰ কাৰণ হয়, সাধাৰণতে অনিৰাপদ পানীৰ দ্বাৰা বিয়পে।',
    'diseases.typhoid': 'টাইফয়েড',
    'diseases.typhoidDesc': 'দূষিত খাদ্য আৰু পানীৰ দ্বাৰা বিয়পা এক বেক্টেৰিয়াজনিত ৰোগ, যি জ্বৰ, দুৰ্বলতা আৰু পেটৰ বিষৰ কাৰণ হয়।',
    'diseases.dysentery': 'আমাশয়',
    'diseases.dysenteryDesc': 'এক আন্ত্ৰিক সংক্ৰমণ যি তেজযুক্ত ডায়েৰিয়াৰ কাৰণ হয়, সাধাৰণতে অনিৰাপদ খোৱাপানীৰ কাৰণে হয়।',
    'diseases.giardiasis': 'গিয়াৰ্ডিয়াছিছ',
    'diseases.giardiasisDesc': 'এক পৰজীৱী ৰোগ যি পেটৰ বিষ আৰু ডায়েৰিয়াৰ কাৰণ হয়, অনিৰাপদ পানীৰ জৰিয়তে বিয়পে।',

    // Action Tabs
    'tabs.prevention': 'প্ৰতিৰোধ',
    'tabs.awareness': 'সজাগতা',
    'tabs.treatment': 'চিকিৎসা',

    // Take Action Section
    'action.title': 'আজিয়েই ব্যৱস্থা লওক',
    'action.description': 'লক্ষণ মূল্যায়ন, প্ৰতিৰোধৰ বিষয়ে জানিবলৈ বা স্বাস্থ্যসেৱা সম্পদ লাভ কৰিবলৈ আমাৰ সঁজুলি ব্যৱহাৰ কৰক।',
    'action.symptomAnalysis': 'লক্ষণ বিশ্লেষণ',
    'action.learnMore': 'অধিক জানক',

    // Key Insights Cards
    'insights.monsoonImpact': 'বৰষুণৰ প্ৰভাৱ',
    'insights.monsoonInsight': 'বৰষুণৰ সময়ত (জুন-ছেপ্টেম্বৰ) ৰোগৰ হাৰ ৪০-৬০% বৃদ্ধি পায়',
    'insights.monsoonRecommendation': 'বৰষুণ আৰম্ভ হোৱাৰ আগতে প্ৰতিৰোধমূলক ব্যৱস্থা শক্তিশালী কৰক',
    'insights.geographicHotspots': 'ভৌগোলিক হটস্পট',
    'insights.geographicInsight': 'মেঘালয়ে অন্যান্য ৰাজ্যৰ তুলনাত ২-৩ গুণ বেছি হাৰ দেখুৱায়',
    'insights.geographicRecommendation': 'উচ্চ বিপদাশংকা অঞ্চলত লক্ষ্যভিত্তিক হস্তক্ষেপৰ প্ৰয়োজন',
    'insights.ageVulnerability': 'বয়সৰ দুৰ্বলতা',
    'insights.ageInsight': '৫ বছৰৰ তলৰ শিশুৱে গুৰুতৰ ক্ষেত্ৰৰ ৭০% গঠন কৰে',
    'insights.ageRecommendation': 'শিশু চিকিৎসা আৰু মাতৃ শিক্ষাত গুৰুত্ব দিয়ক',
    'insights.waterQuality': 'পানীৰ গুণগত মান',
    'insights.waterInsight': 'উন্নত পানী আন্তঃগাঁথনি থকা ৰাজ্যসমূহে ৫০% কম হাৰ দেখুৱায়',
    'insights.waterRecommendation': 'বিশুদ্ধ পানী প্ৰৱেশ কাৰ্যসূচী ত্বৰান্বিত কৰক',
    'insights.healthcareAccess': 'স্বাস্থ্যসেৱা প্ৰৱেশ',
    'insights.healthcareInsight': 'প্ৰাৰম্ভিক চিকিৎসাই মৃত্যুৰ হাৰ ৮০-৯০% হ্ৰাস কৰে',
    'insights.healthcareRecommendation': 'গ্ৰাম্য স্বাস্থ্য সুবিধা কভাৰেজ উন্নত কৰক',
    'insights.preventionSuccess': 'প্ৰতিৰোধৰ সফলতা',
    'insights.preventionInsight': 'টিকাকৰণ কাৰ্যসূচীয়ে লক্ষ্যভিত্তিক ৰোগত ৬০% হ্ৰাস দেখুৱায়',
    'insights.preventionRecommendation': 'দূৰৱৰ্তী অঞ্চলত টিকাকৰণ কভাৰেজ সম্প্ৰসাৰণ কৰক',

    // Chart Sections
    'charts.seasonalTrends': 'ঋতুগত প্ৰৱণতা',
    'charts.seasonalDescription': 'বিভিন্ন পানীবাহিত ৰোগৰ বাবে শীৰ্ষ ঋতু দেখুওৱা মাহেকীয়া পৰিৱৰ্তনৰ আৰ্হি।',
    'charts.diseaseComparison': 'ৰোগ তুলনা বিশ্লেষণ',
    'charts.diseaseComparisonDescription': 'অঞ্চলটোত বিভিন্ন পানীবাহিত ৰোগৰ তুলনামূলক বিশ্লেষণ।',
    'charts.stateAnalysis': 'ৰাজ্যভিত্তিক বিশ্লেষণ',
    'charts.stateAnalysisDescription': 'সকলো উত্তৰ-পূৰ্বাঞ্চলীয় ভাৰতীয় ৰাজ্যত পানীবাহিত ৰোগৰ প্ৰসাৰৰ বিস্তৃত বিৱৰণ।',
    'charts.monthlyPrevalence': 'মাহেকীয়া ৰোগৰ প্ৰসাৰ (%)',
    'charts.monsoonNote': 'বৰষুণৰ সময় (জুন-ছেপ্টেম্বৰ) সৰ্বোচ্চ হাৰ দেখুৱায়',
    'charts.regionalAnalysis': 'আঞ্চলিক বিশ্লেষণ',
    'charts.averageRate': 'গড় হাৰ',
    'charts.highestIn': 'সৰ্বোচ্চ',
    'charts.peakRate': 'শীৰ্ষ হাৰ',

    // Table Headers
    'table.state': 'ৰাজ্য',
    'table.diarrhea': 'ডায়েৰিয়া',
    'table.fever': 'জ্বৰ',
    'table.ari': 'এআৰআই',
    'table.stateWisePrevalence': 'ৰাজ্যভিত্তিক পানীবাহিত ৰোগৰ প্ৰসাৰ (%)',
    'table.highestRisk': 'সৰ্বোচ্চ বিপদাশংকা',
    'table.preventionWorks': 'প্ৰতিৰোধ কাৰ্যকৰী',

    // Waterborne Diseases Page
    'waterborne.title': 'পানীবাহিত ৰোগ বুজা',
    'waterborne.subtitle': 'উত্তৰ-পূৰ্বাঞ্চলীয় ভাৰতৰ বাবে বিস্তৃত গাইড',
    'waterborne.description': 'পানীবাহিত ৰোগ হৈছে দূষিত পানীৰ জৰিয়তে সংক্ৰমিত ৰোগজনকৰ দ্বাৰা হোৱা অসুখ। এই ৰোগসমূহে বিশেষকৈ উন্নয়নশীল অঞ্চলত গুৰুত্বপূৰ্ণ স্বাস্থ্য প্ৰত্যাহ্বান সৃষ্টি কৰে য\'ত বিশুদ্ধ পানী আৰু উপযুক্ত পৰিচ্ছন্নতাৰ প্ৰৱেশ সীমিত হ\'ব পাৰে।',
    'waterborne.severity': 'গুৰুত্ব',
    'waterborne.commonSymptoms': 'সাধাৰণ লক্ষণ',
    'waterborne.transmission': 'সংক্ৰমণ',
    'waterborne.mortalityRate': 'মৃত্যুৰ হাৰ',
    'waterborne.preventionMethods': 'প্ৰতিৰোধৰ পদ্ধতি',
    'waterborne.impactSignificance': 'প্ৰভাৱ আৰু গুৰুত্ব',

    // Northeast India Section
    'northeast.title': 'উত্তৰ-পূৰ্বাঞ্চলীয় ভাৰত: অনন্য প্ৰত্যাহ্বান',
    'northeast.description': 'ভাৰতৰ উত্তৰ-পূৰ্বাঞ্চলীয় ৰাজ্যসমূহে ভৌগোলিক, জলবায়ু আৰু আন্তঃগাঁথনিগত কাৰকৰ বাবে পানীবাহিত ৰোগৰ সৈতে জড়িত নিৰ্দিষ্ট প্ৰত্যাহ্বানৰ সন্মুখীন হয়।',
    'northeast.geographicFactors': 'ভৌগোলিক কাৰক',
    'northeast.commonIssues': 'সাধাৰণ সমস্যা',
    'northeast.vulnerableGroups': 'দুৰ্বল গোট',

    // Prevention Section
    'prevention.title': 'প্ৰতিৰোধ আৰু কাৰ্য পদক্ষেপ',
    'prevention.description': 'পানীবাহিত ৰোগৰ পৰা নিজকে আৰু আপোনাৰ সমাজক সুৰক্ষিত কৰিবলৈ এই অত্যাৱশ্যকীয় পদক্ষেপসমূহ লওক।',
    'prevention.waterTreatment': 'পানী চিকিৎসা',
    'prevention.sanitation': 'পৰিচ্ছন্নতা',
    'prevention.personalHygiene': 'ব্যক্তিগত স্বাস্থ্যবিধি',
    'prevention.communityAction': 'সামুদায়িক কাৰ্য',
    'prevention.medicalCare': 'চিকিৎসা সেৱা',
    'prevention.emergencyResponse': 'জৰুৰীকালীন সঁহাৰি',

    // Call to Action
    'cta.needHelp': 'তৎক্ষণাৎ সহায় লাগে?',
    'cta.helpDescription': 'যদি আপুনি লক্ষণসমূহ অনুভৱ কৰি আছে বা পানীবাহিত ৰোগৰ বিষয়ে নিৰ্দেশনা বিচাৰিছে, আমাৰ লক্ষণ বিশ্লেষণ সঁজুলিয়ে ব্যক্তিগত পৰামৰ্শ প্ৰদান কৰাত সহায় কৰিব পাৰে।',
    'cta.analyzeSymptoms': 'লক্ষণ বিশ্লেষণ কৰক',
    'cta.backToHome': 'ঘৰলৈ উভতি যাওক',

    // Disease Names and Severity
    'disease.cholera': 'কলেৰা',
    'disease.typhoidFever': 'টাইফয়েড জ্বৰ',
    'disease.hepatitisA': 'হেপাটাইটিছ এ',
    'disease.dysentery': 'আমাশয়',
    'disease.giardiasis': 'জিয়াৰ্ডিয়াছিছ',
    'disease.cryptosporidiosis': 'ক্ৰিপ্টোস্পৰিডিয়োছিছ',
    'disease.high': 'উচ্চ',
    'disease.moderate': 'মধ্যম',

    // Geographic Factors
    'geo.highRainfall': 'অধিক বৰষুণ আৰু বানপানী',
    'geo.mountainous': 'পাৰ্বত্য অঞ্চল',
    'geo.remoteCommunities': 'দূৰৱৰ্তী গ্ৰাম্য সমাজ',
    'geo.limitedInfrastructure': 'সীমিত আন্তঃগাঁথনি প্ৰৱেশ',

    // Common Issues
    'issues.contaminatedWater': 'দূষিত পানীৰ উৎস',
    'issues.poorSanitation': 'দুৰ্বল পৰিচ্ছন্নতা সুবিধা',
    'issues.seasonalOutbreaks': 'ঋতুগত ৰোগ প্ৰাদুৰ্ভাৱ',
    'issues.limitedHealthcare': 'সীমিত স্বাস্থ্যসেৱা প্ৰৱেশ',

    // Vulnerable Groups
    'vulnerable.childrenUnder5': '৫ বছৰৰ তলৰ শিশু',
    'vulnerable.pregnantWomen': 'গৰ্ভৱতী মহিলা',
    'vulnerable.elderly': 'বয়স্ক জনসংখ্যা',
    'vulnerable.immunocompromised': 'ৰোগ প্ৰতিৰোধ ক্ষমতা দুৰ্বল ব্যক্তি',

    // Key Insights Cards
    'insights.highestRiskDescription': 'সকলো পানীবাহিত ৰোগত সৰ্বোচ্চ প্ৰসাৰ দেখুৱায়:',
    'insights.diarrhea': 'ডায়েৰিয়া: ১০% (সৰ্বোচ্চ)',
    'insights.fever': 'জ্বৰ: ২৩% (সৰ্বোচ্চ)',
    'insights.ari': 'এআৰআই: ৪.৮% (সৰ্বোচ্চ)',
    'insights.contributingFactors': 'অৰিহণাকাৰী কাৰক',
    'insights.contributingDescription': 'গৱেষণাই দেখুৱায় যে অধিক প্ৰসাৰ ইয়াৰ সৈতে জড়িত:',
    'insights.poorSanitation': 'দুৰ্বল পৰিচ্ছন্নতা সুবিধা',
    'insights.lackCleanWater': 'বিশুদ্ধ পানীৰ প্ৰৱেশৰ অভাৱ',
    'insights.lowerSocioeconomic': 'নিম্ন সামাজিক-অৰ্থনৈতিক অৱস্থা',
    'insights.ruralLiving': 'গ্ৰাম্য জীৱন পৰিস্থিতি',
    'insights.preventionDescription': 'উন্নত ফলাফল থকা ৰাজ্যসমূহে দেখুৱায়:',
    'insights.improvedWaterTreatment': 'উন্নত পানী চিকিৎসা',
    'insights.betterSanitationCoverage': 'উন্নত পৰিচ্ছন্নতা কভাৰেজ',
    'insights.healthEducationPrograms': 'স্বাস্থ্য শিক্ষা কাৰ্যক্ৰম',
    'insights.vaccinationInitiatives': 'টীকাকৰণ পদক্ষেপ',

    // Get Started Page
    'getStarted.title': 'আমি আপোনাক সহায় কৰিবলৈ ইয়াত আছোঁ',
    'getStarted.subtitle': 'আপোনাৰ স্বাস্থ্য আৰু মংগল আমাৰ বাবে গুৰুত্বপূৰ্ণ। অনুগ্ৰহ কৰি কিছু মৌলিক তথ্য শ্বেয়াৰ কৰক যাতে আমি আপোনাক সবচেয়ে প্ৰাসংগিক নিৰ্দেশনা আৰু সহায়তা প্ৰদান কৰিব পাৰোঁ।',
    'getStarted.disclaimer': 'এই সঁজুলিয়ে সাধাৰণ স্বাস্থ্য তথ্য প্ৰদান কৰে আৰু পেছাদাৰী চিকিৎসা পৰামৰ্শৰ বিকল্প নহয়।',
    'getStarted.form.name': 'আপোনাৰ নাম',
    'getStarted.form.namePlaceholder': 'আপোনাৰ সম্পূৰ্ণ নাম লিখক',
    'getStarted.form.age': 'বয়স',
    'getStarted.form.agePlaceholder': 'আপোনাৰ বয়স লিখক',
    'getStarted.form.location': 'স্থান',
    'getStarted.form.locationPlaceholder': 'চহৰ, ৰাজ্য',
    'getStarted.form.symptoms': 'আপোনাৰ লক্ষণসমূহ বৰ্ণনা কৰক',
    'getStarted.form.symptomsPlaceholder': 'অনুগ্ৰহ কৰি আপুনি কি অনুভব কৰিছে তাৰ বিতং বৰ্ণনা দিয়ক...',
    'getStarted.form.voiceInput': 'কণ্ঠস্বৰ ইনপুট আৰম্ভ কৰক',
    'getStarted.form.stopRecording': '🔴 ৰেকৰ্ডিং বন্ধ কৰক',
    'getStarted.form.clearText': 'পাঠ মচক',
    'getStarted.form.submit': 'ব্যক্তিগত নিৰ্দেশনা লাভ কৰক',
    'getStarted.form.analyzing': 'লক্ষণ বিশ্লেষণ কৰি আছে...',
    'getStarted.form.submitDescription': 'আমি আপোনাৰ তথ্য বিশ্লেষণ কৰি সহায়ক সম্পদ আৰু পৰামৰ্শ প্ৰদান কৰিম।',

    // Common Terms
    'common.diarrhea': 'ডায়েৰিয়া',
    'common.fever': 'জ্বৰ',
    'common.ari': 'এআৰআই',
    'common.symptoms': 'লক্ষণ',
    'common.prevention': 'প্ৰতিৰোধ',
    'common.treatment': 'চিকিৎসা',
    'common.severity': 'তীব্ৰতা',
    'common.high': 'উচ্চ',
    'common.medium': 'মধ্যম',
    'common.low': 'নিম্ন',
    'common.loading': 'লোড হৈ আছে...',
    'common.error': 'ত্ৰুটি',
    'common.success': 'সফল',
  },

  bn: {
    // Navigation
    'nav.home': 'হোম',
    'nav.getStarted': 'শুরু করুন',
    'nav.testimonials': 'প্রশংসাপত্র',
    'nav.statistics': 'পরিসংখ্যান',
    'nav.doctorLogin': 'ডাক্তার লগইন',
    'nav.logout': 'লগআউট',
    'nav.backToHome': '← হোমে ফিরে যান',

    // Home Page
    'home.title': 'পানিবাহিত রোগের সচেতনতা',
    'home.subtitle': 'উত্তর-পূর্ব ভারত',
    'home.description': 'পানিবাহিত রোগ প্রতিরোধের জন্য জ্ঞান এবং সরঞ্জাম দিয়ে সম্প্রদায়কে ক্ষমতায়ন করা। তাৎক্ষণিক লক্ষণ বিশ্লেষণ পান, প্রতিরোধ সম্পর্কে জানুন এবং স্বাস্থ্যসেবা সম্পদ অ্যাক্সেস করুন।',
    'home.getStarted': 'শুরু করুন',
    'home.learnMore': 'আরও জানুন',
    'home.symptomAnalysis': 'লক্ষণ বিশ্লেষণ',
    'home.support247': '২৪/৭ সহায়তা',
    'home.hepatitisA': 'হেপাটাইটিস এ',
    'home.hepatitisADesc': 'দূষিত পানি ও খাবারের মাধ্যমে সংক্রমিত একটি ভাইরাল লিভার সংক্রমণ।',

    // Statistics Page
    'stats.title': 'পানিবাহিত রোগের পরিসংখ্যান',
    'stats.subtitle': 'উত্তর-পূর্ব ভারত - ব্যাপক ডেটা বিশ্লেষণ',
    'stats.description': 'NFHS-5 (2019-21) ডেটা এবং চলমান স্বাস্থ্য নজরদারির ভিত্তিতে, এই ব্যাপক বিশ্লেষণ উত্তর-পূর্ব ভারতের আটটি রাজ্যে পানিবাহিত রোগের প্যাটার্নের অন্তর্দৃষ্টি প্রদান করে।',
    'stats.totalPopulation': 'মোট প্রভাবিত জনসংখ্যা',
    'stats.highestDiarrhea': 'সর্বোচ্চ ডায়রিয়ার হার',
    'stats.averageFever': 'গড় জ্বরের ক্ষেত্রে',
    'stats.statesMonitored': 'নিরীক্ষিত রাজ্যসমূহ',
    'stats.peopleAtRisk': 'উত্তর-পূর্ব ভারতে ঝুঁকিতে থাকা মানুষ',
    'stats.criticalLevel': 'সংকটজনক স্তর',
    'stats.acrossAllStates': 'সকল ৮টি রাজ্যে',
    'stats.completeNortheast': 'সম্পূর্ণ উত্তর-পূর্ব কভারেজ',
    'stats.coverage': '১০০% কভারেজ',

    // Understanding Section
    'understanding.title': 'পানিবাহিত রোগ বোঝা',
    'understanding.description': 'পানিবাহিত রোগ রোগজনক অণুজীবের কারণে হয় যা পানিতে সংক্রমিত হয়। এই রোগগুলি গোসল, ধোয়া, পানি পান বা দূষিত পানির সংস্পর্শে আসা খাবার খাওয়ার সময় ছড়াতে পারে।',
    'understanding.commonDiseases': 'সাধারণ পানিবাহিত রোগের মধ্যে রয়েছে কলেরা, টাইফয়েড, হেপাটাইটিস এ, ডায়রিয়া এবং আমাশয়। যথাযথ পানি শোধন, স্যানিটেশন এবং স্বাস্থ্যবিধি অনুশীলনের মাধ্যমে এই রোগগুলি প্রতিরোধ করা মূল বিষয়।',

    // Global Statistics
    'global.annualDeaths': 'বিশ্বব্যাপী বার্ষিক মৃত্যু',
    'global.childrenAffected': '৫ বছরের কম বয়সী শিশু প্রভাবিত',
    'global.peopleWithoutWater': 'নিরাপদ পানি ছাড়া মানুষ',
    'global.diseaseBurden': 'রোগের বোঝা (DALYs)',

    // Major Diseases
    'diseases.title': 'প্রধান পানিবাহিত রোগ',
    'diseases.subtitle': 'সবচেয়ে সাধারণ পানিবাহিত রোগ, তাদের লক্ষণ, সংক্রমণের পদ্ধতি এবং প্রতিরোধের কৌশল সম্পর্কে জানুন।',

    // Individual Disease Names and Descriptions
    'diseases.cholera': 'কলেরা',
    'diseases.choleraDesc': 'একটি ব্যাকটেরিয়াল সংক্রমণ যা গুরুতর ডায়রিয়া এবং পানিশূন্যতার কারণ হয়, সাধারণত অনিরাপদ পানির মাধ্যমে ছড়ায়।',
    'diseases.typhoid': 'টাইফয়েড',
    'diseases.typhoidDesc': 'দূষিত খাবার এবং পানির মাধ্যমে ছড়ানো একটি ব্যাকটেরিয়াল রোগ, যা জ্বর, দুর্বলতা এবং পেট ব্যথার কারণ হয়।',
    'diseases.dysentery': 'আমাশয়',
    'diseases.dysenteryDesc': 'একটি অন্ত্রের সংক্রমণ যা রক্তযুক্ত ডায়রিয়ার কারণ হয়, সাধারণত অনিরাপদ পানীয় জলের কারণে হয়।',
    'diseases.giardiasis': 'গিয়ার্ডিয়াসিস',
    'diseases.giardiasisDesc': 'একটি পরজীবী রোগ যা পেটে ব্যথা এবং ডায়রিয়ার কারণ হয়, অনিরাপদ পানির মাধ্যমে ছড়ায়।',

    // Action Tabs
    'tabs.prevention': 'প্রতিরোধ',
    'tabs.awareness': 'সচেতনতা',
    'tabs.treatment': 'চিকিৎসা',

    // Take Action Section
    'action.title': 'আজই ব্যবস্থা নিন',
    'action.description': 'লক্ষণ মূল্যায়ন, প্রতিরোধ সম্পর্কে জানতে বা স্বাস্থ্যসেবা সম্পদ অ্যাক্সেস করতে আমাদের সরঞ্জাম ব্যবহার করুন।',
    'action.symptomAnalysis': 'লক্ষণ বিশ্লেষণ',
    'action.learnMore': 'আরও জানুন',

    // Key Insights Cards
    'insights.monsoonImpact': 'বর্ষার প্রভাব',
    'insights.monsoonInsight': 'বর্ষাকালে (জুন-সেপ্টেম্বর) রোগের হার ৪০-৬০% বৃদ্ধি পায়',
    'insights.monsoonRecommendation': 'বর্ষা শুরুর আগে প্রতিরোধমূলক ব্যবস্থা শক্তিশালী করুন',
    'insights.geographicHotspots': 'ভৌগোলিক হটস্পট',
    'insights.geographicInsight': 'মেঘালয় ধারাবাহিকভাবে অন্যান্য রাজ্যের তুলনায় ২-৩ গুণ বেশি হার দেখায়',
    'insights.geographicRecommendation': 'উচ্চ ঝুঁকিপূর্ণ এলাকায় লক্ষ্যভিত্তিক হস্তক্ষেপ প্রয়োজন',
    'insights.ageVulnerability': 'বয়সের দুর্বলতা',
    'insights.ageInsight': '৫ বছরের কম বয়সী শিশুরা গুরুতর ক্ষেত্রের ৭০% গঠন করে',
    'insights.ageRecommendation': 'শিশু চিকিৎসা এবং মাতৃ শিক্ষায় মনোনিবেশ করুন',
    'insights.waterQuality': 'পানির গুণমান',
    'insights.waterInsight': 'উন্নত পানি অবকাঠামো সহ রাজ্যগুলি ৫০% কম হার দেখায়',
    'insights.waterRecommendation': 'পরিচ্ছন্ন পানি অ্যাক্সেস প্রোগ্রাম ত্বরান্বিত করুন',
    'insights.healthcareAccess': 'স্বাস্থ্যসেবা অ্যাক্সেস',
    'insights.healthcareInsight': 'প্রাথমিক চিকিৎসা মৃত্যুর হার ৮০-৯০% কমায়',
    'insights.healthcareRecommendation': 'গ্রামীণ স্বাস্থ্য সুবিধা কভারেজ উন্নত করুন',
    'insights.preventionSuccess': 'প্রতিরোধের সাফল্য',
    'insights.preventionInsight': 'টিকাদান কর্মসূচি লক্ষ্যভিত্তিক রোগে ৬০% হ্রাস দেখায়',
    'insights.preventionRecommendation': 'প্রত্যন্ত অঞ্চলে টিকাদান কভারেজ সম্প্রসারণ করুন',

    // Chart Sections
    'charts.seasonalTrends': 'ঋতুগত প্রবণতা',
    'charts.seasonalDescription': 'বিভিন্ন পানিবাহিত রোগের জন্য শীর্ষ ঋতু দেখানো মাসিক পরিবর্তনের ধরন।',
    'charts.diseaseComparison': 'রোগ তুলনা বিশ্লেষণ',
    'charts.diseaseComparisonDescription': 'অঞ্চল জুড়ে বিভিন্ন পানিবাহিত রোগের তুলনামূলক বিশ্লেষণ।',
    'charts.stateAnalysis': 'রাজ্যভিত্তিক বিশ্লেষণ',
    'charts.stateAnalysisDescription': 'সমস্ত উত্তর-পূর্ব ভারতীয় রাজ্য জুড়ে পানিবাহিত রোগের প্রাদুর্ভাবের বিস্তারিত বিবরণ।',
    'charts.monthlyPrevalence': 'মাসিক রোগের প্রাদুর্ভাব (%)',
    'charts.monsoonNote': 'বর্ষাকাল (জুন-সেপ্টেম্বর) সর্বোচ্চ হার দেখায়',
    'charts.regionalAnalysis': 'আঞ্চলিক বিশ্লেষণ',
    'charts.averageRate': 'গড় হার',
    'charts.highestIn': 'সর্বোচ্চ',
    'charts.peakRate': 'শীর্ষ হার',

    // Table Headers
    'table.state': 'রাজ্য',
    'table.diarrhea': 'ডায়রিয়া',
    'table.fever': 'জ্বর',
    'table.ari': 'এআরআই',
    'table.stateWisePrevalence': 'রাজ্যভিত্তিক পানিবাহিত রোগের প্রাদুর্ভাব (%)',
    'table.highestRisk': 'সর্বোচ্চ ঝুঁকি',
    'table.preventionWorks': 'প্রতিরোধ কাজ করে',

    // Waterborne Diseases Page
    'waterborne.title': 'পানিবাহিত রোগ বোঝা',
    'waterborne.subtitle': 'উত্তর-পূর্ব ভারতের জন্য বিস্তৃত গাইড',
    'waterborne.description': 'পানিবাহিত রোগ হল দূষিত পানির মাধ্যমে সংক্রমিত রোগজীবাণু দ্বারা সৃষ্ট অসুস্থতা। এই রোগগুলি বিশেষত উন্নয়নশীল অঞ্চলে গুরুত্বপূর্ণ স্বাস্থ্য চ্যালেঞ্জ তৈরি করে যেখানে পরিচ্ছন্ন পানি এবং যথাযথ স্যানিটেশনের অ্যাক্সেস সীমিত হতে পারে।',
    'waterborne.severity': 'গুরুত্ব',
    'waterborne.commonSymptoms': 'সাধারণ লক্ষণ',
    'waterborne.transmission': 'সংক্রমণ',
    'waterborne.mortalityRate': 'মৃত্যুর হার',
    'waterborne.preventionMethods': 'প্রতিরোধের পদ্ধতি',
    'waterborne.impactSignificance': 'প্রভাব ও গুরুত্ব',

    // Northeast India Section
    'northeast.title': 'উত্তর-পূর্ব ভারত: অনন্য চ্যালেঞ্জ',
    'northeast.description': 'ভারতের উত্তর-পূর্বাঞ্চলীয় রাজ্যগুলি ভৌগোলিক, জলবায়ু এবং অবকাঠামোগত কারণে পানিবাহিত রোগ সম্পর্কিত নির্দিষ্ট চ্যালেঞ্জের মুখোমুখি হয়।',
    'northeast.geographicFactors': 'ভৌগোলিক কারণ',
    'northeast.commonIssues': 'সাধারণ সমস্যা',
    'northeast.vulnerableGroups': 'ঝুঁকিপূর্ণ গোষ্ঠী',

    // Prevention Section
    'prevention.title': 'প্রতিরোধ ও কর্মপরিকল্পনা',
    'prevention.description': 'পানিবাহিত রোগ থেকে নিজেকে এবং আপনার সম্প্রদায়কে রক্ষা করতে এই প্রয়োজনীয় পদক্ষেপগুলি নিন।',
    'prevention.waterTreatment': 'পানি চিকিৎসা',
    'prevention.sanitation': 'স্যানিটেশন',
    'prevention.personalHygiene': 'ব্যক্তিগত স্বাস্থ্যবিধি',
    'prevention.communityAction': 'সম্প্রদায়িক কর্ম',
    'prevention.medicalCare': 'চিকিৎসা সেবা',
    'prevention.emergencyResponse': 'জরুরি প্রতিক্রিয়া',

    // Call to Action
    'cta.needHelp': 'তাৎক্ষণিক সাহায্য প্রয়োজন?',
    'cta.helpDescription': 'আপনি যদি লক্ষণগুলি অনুভব করছেন বা পানিবাহিত রোগের বিষয়ে নির্দেশনা প্রয়োজন, আমাদের লক্ষণ বিশ্লেষণ সরঞ্জাম ব্যক্তিগত সুপারিশ প্রদান করতে সাহায্য করতে পারে।',
    'cta.analyzeSymptoms': 'লক্ষণ বিশ্লেষণ করুন',
    'cta.backToHome': 'হোমে ফিরে যান',

    // Disease Names and Severity
    'disease.cholera': 'কলেরা',
    'disease.typhoidFever': 'টাইফয়েড জ্বর',
    'disease.hepatitisA': 'হেপাটাইটিস এ',
    'disease.dysentery': 'আমাশয়',
    'disease.giardiasis': 'জিয়ার্ডিয়াসিস',
    'disease.cryptosporidiosis': 'ক্রিপ্টোস্পোরিডিওসিস',
    'disease.high': 'উচ্চ',
    'disease.moderate': 'মধ্যম',

    // Geographic Factors
    'geo.highRainfall': 'অধিক বৃষ্টিপাত এবং বন্যা',
    'geo.mountainous': 'পার্বত্য অঞ্চল',
    'geo.remoteCommunities': 'দূরবর্তী গ্রামীণ সম্প্রদায়',
    'geo.limitedInfrastructure': 'সীমিত অবকাঠামো অ্যাক্সেস',

    // Common Issues
    'issues.contaminatedWater': 'দূষিত পানির উৎস',
    'issues.poorSanitation': 'দুর্বল স্যানিটেশন সুবিধা',
    'issues.seasonalOutbreaks': 'ঋতুগত রোগ প্রাদুর্ভাব',
    'issues.limitedHealthcare': 'সীমিত স্বাস্থ্যসেবা অ্যাক্সেস',

    // Vulnerable Groups
    'vulnerable.childrenUnder5': '৫ বছরের কম বয়সী শিশু',
    'vulnerable.pregnantWomen': 'গর্ভবতী মহিলা',
    'vulnerable.elderly': 'বয়স্ক জনসংখ্যা',
    'vulnerable.immunocompromised': 'রোগ প্রতিরোধ ক্ষমতা দুর্বল ব্যক্তি',

    // Key Insights Cards
    'insights.highestRiskDescription': 'সমস্ত পানিবাহিত রোগে সর্বোচ্চ প্রাদুর্ভাব দেখায়:',
    'insights.diarrhea': 'ডায়রিয়া: ১০% (সর্বোচ্চ)',
    'insights.fever': 'জ্বর: ২৩% (সর্বোচ্চ)',
    'insights.ari': 'এআরআই: ৪.৮% (সর্বোচ্চ)',
    'insights.contributingFactors': 'অবদানকারী কারণ',
    'insights.contributingDescription': 'গবেষণা দেখায় যে উচ্চ প্রাদুর্ভাব এর সাথে যুক্ত:',
    'insights.poorSanitation': 'দুর্বল স্যানিটেশন সুবিধা',
    'insights.lackCleanWater': 'পরিচ্ছন্ন পানির অ্যাক্সেসের অভাব',
    'insights.lowerSocioeconomic': 'নিম্ন সামাজিক-অর্থনৈতিক অবস্থা',
    'insights.ruralLiving': 'গ্রামীণ জীবনযাত্রার অবস্থা',
    'insights.preventionDescription': 'উন্নত ফলাফল সহ রাজ্যগুলি দেখায়:',
    'insights.improvedWaterTreatment': 'উন্নত পানি চিকিৎসা',
    'insights.betterSanitationCoverage': 'উন্নত স্যানিটেশন কভারেজ',
    'insights.healthEducationPrograms': 'স্বাস্থ্য শিক্ষা কর্মসূচি',
    'insights.vaccinationInitiatives': 'টিকাদান উদ্যোগ',

    // Get Started Page
    'getStarted.title': 'আমরা আপনাকে সাহায্য করতে এখানে আছি',
    'getStarted.subtitle': 'আপনার স্বাস্থ্য এবং সুস্থতা আমাদের কাছে গুরুত্বপূর্ণ। অনুগ্রহ করে কিছু মৌলিক তথ্য শেয়ার করুন যাতে আমরা আপনাকে সবচেয়ে প্রাসঙ্গিক নির্দেশনা এবং সহায়তা প্রদান করতে পারি।',
    'getStarted.disclaimer': 'এই টুলটি সাধারণ স্বাস্থ্য তথ্য প্রদান করে এবং পেশাদার চিকিৎসা পরামর্শের বিকল্প নয়।',
    'getStarted.form.name': 'আপনার নাম',
    'getStarted.form.namePlaceholder': 'আপনার পূর্ণ নাম লিখুন',
    'getStarted.form.age': 'বয়স',
    'getStarted.form.agePlaceholder': 'আপনার বয়স লিখুন',
    'getStarted.form.location': 'অবস্থান',
    'getStarted.form.locationPlaceholder': 'শহর, রাজ্য',
    'getStarted.form.symptoms': 'আপনার লক্ষণগুলি বর্ণনা করুন',
    'getStarted.form.symptomsPlaceholder': 'অনুগ্রহ করে আপনি কী অনুভব করছেন তার বিস্তারিত বর্ণনা দিন...',
    'getStarted.form.voiceInput': 'ভয়েস ইনপুট শুরু করুন',
    'getStarted.form.stopRecording': '🔴 রেকর্ডিং বন্ধ করুন',
    'getStarted.form.clearText': 'টেক্সট মুছুন',
    'getStarted.form.submit': 'ব্যক্তিগত নির্দেশনা পান',
    'getStarted.form.analyzing': 'লক্ষণ বিশ্লেষণ করা হচ্ছে...',
    'getStarted.form.submitDescription': 'আমরা আপনার তথ্য বিশ্লেষণ করে সহায়ক সম্পদ এবং সুপারিশ প্রদান করব।',

    // Common Terms
    'common.diarrhea': 'ডায়রিয়া',
    'common.fever': 'জ্বর',
    'common.ari': 'এআরআই',
    'common.symptoms': 'লক্ষণ',
    'common.prevention': 'প্রতিরোধ',
    'common.treatment': 'চিকিৎসা',
    'common.severity': 'তীব্রতা',
    'common.high': 'উচ্চ',
    'common.medium': 'মধ্যম',
    'common.low': 'নিম্ন',
    'common.loading': 'লোড হচ্ছে...',
    'common.error': 'ত্রুটি',
    'common.success': 'সফল',
  },

  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.getStarted': 'शुरू करें',
    'nav.testimonials': 'प्रशंसापत्र',
    'nav.statistics': 'आंकड़े',
    'nav.doctorLogin': 'डॉक्टर लॉगिन',
    'nav.logout': 'लॉगआउट',
    'nav.backToHome': '← होम पर वापस जाएं',

    // Home Page
    'home.title': 'जल जनित रोग जागरूकता',
    'home.subtitle': 'उत्तर-पूर्व भारत',
    'home.description': 'जल जनित रोगों को रोकने के लिए ज्ञान और उपकरणों के साथ समुदायों को सशक्त बनाना। तत्काल लक्षण विश्लेषण प्राप्त करें, रोकथाम के बारे में जानें और स्वास्थ्य सेवा संसाधनों तक पहुंचें।',
    'home.getStarted': 'शुरू करें',
    'home.learnMore': 'और जानें',
    'home.symptomAnalysis': 'लक्षण विश्लेषण',
    'home.support247': '२४/७ सहायता',
    'home.hepatitisA': 'हेपेटाइटिस ए',
    'home.hepatitisADesc': 'दूषित पानी और भोजन के माध्यम से फैलने वाला एक वायरल लिवर संक्रमण।',

    // Statistics Page
    'stats.title': 'जल जनित रोग सांख्यिकी',
    'stats.subtitle': 'पूर्वोत्तर भारत - व्यापक डेटा विश्लेषण',
    'stats.description': 'NFHS-5 (2019-21) डेटा और चल रहे स्वास्थ्य निगरानी के आधार पर, यह व्यापक विश्लेषण पूर्वोत्तर भारत के आठ राज्यों में जल जनित रोग पैटर्न की जानकारी प्रदान करता है।',
    'stats.totalPopulation': 'कुल प्रभावित जनसंख्या',
    'stats.highestDiarrhea': 'सबसे अधिक दस्त दर',
    'stats.averageFever': 'औसत बुखार के मामले',
    'stats.statesMonitored': 'निगरानी किए गए राज्य',
    'stats.peopleAtRisk': 'पूर्वोत्तर भारत में जोखिम में लोग',
    'stats.criticalLevel': 'गंभीर स्तर',
    'stats.acrossAllStates': 'सभी 8 राज्यों में',
    'stats.completeNortheast': 'पूर्ण पूर्वोत्तर कवरेज',
    'stats.coverage': '100% कवरेज',

    // Understanding Section
    'understanding.title': 'जल जनित रोगों को समझना',
    'understanding.description': 'जल जनित रोग रोगजनक सूक्ष्मजीवों के कारण होते हैं जो पानी में फैलते हैं। ये रोग नहाने, धोने, पानी पीने या दूषित पानी के संपर्क में आए भोजन खाने से फैल सकते हैं।',
    'understanding.commonDiseases': 'सामान्य जल जनित रोगों में हैजा, टाइफाइड, हेपेटाइटिस ए, दस्त और पेचिश शामिल हैं। उचित जल उपचार, स्वच्छता और स्वच्छता प्रथाओं के माध्यम से इन बीमारियों से बचाव मुख्य है।',

    // Doctor Login
    'doctor.login.title': 'डॉक्टर लॉगिन',
    'doctor.login.subtitle': 'अपने मेडिकल डैशबोर्ड तक पहुंचें',
    'doctor.login.name': 'डॉक्टर का नाम',
    'doctor.login.namePlaceholder': 'डॉ. जॉन डो',
    'doctor.login.email': 'ईमेल पता',
    'doctor.login.emailPlaceholder': 'doctor@nirogya.in',
    'doctor.login.password': 'पासवर्ड',
    'doctor.login.passwordPlaceholder': '••••••••',
    'doctor.login.loginButton': 'लॉगिन',

    // Doctor Dashboard
    'doctor.dashboard.title': 'डॉक्टर डैशबोर्ड',
    'doctor.dashboard.greeting': 'नमस्ते',

    // Prediction Component
    'prediction.title': 'रोग पूर्वानुमान',
    'prediction.outbreakInfo.title': 'प्रकोप की जानकारी',
    'prediction.outbreakInfo.cases': 'मामलों की संख्या',
    'prediction.outbreakInfo.state': 'उत्तर पूर्वी राज्य',
    'prediction.outbreakInfo.month': 'प्रकोप का महीना',
    'prediction.waterQuality.title': 'जल गुणवत्ता पैरामीटर',
    'prediction.waterQuality.ph': 'pH स्तर (0.0-14.0)',
    'prediction.waterQuality.dissolvedOxygen': 'घुलित ऑक्सीजन (mg/L)',
    'prediction.waterQuality.bod': 'BOD (mg/L)',
    'prediction.waterQuality.nitrate': 'नाइट्रेट-N (mg/L)',
    'prediction.waterQuality.fecalColiform': 'फीकल कोलिफॉर्म (CFU/100ml)',
    'prediction.waterQuality.totalColiform': 'कुल कोलिफॉर्म (CFU/100ml)',
    'prediction.waterQuality.temperature': 'तापमान (°C)',
    'prediction.analyzeButton': '🧪 पूर्ण रोग-जल विश्लेषण चलाएं',
    'prediction.analyzing': 'विश्लेषण कर रहे हैं...',

    // States
    'states.arunachal': 'अरुणाचल प्रदेश',
    'states.assam': 'असम',
    'states.manipur': 'मणिपुर',
    'states.meghalaya': 'मेघालय',
    'states.mizoram': 'मिजोरम',
    'states.nagaland': 'नागालैंड',
    'states.sikkim': 'सिक्किम',
    'states.tripura': 'त्रिपुरा',

    // Months
    'months.january': 'जनवरी',
    'months.february': 'फरवरी',
    'months.march': 'मार्च',
    'months.april': 'अप्रैल',
    'months.may': 'मई',
    'months.june': 'जून',
    'months.july': 'जुलाई',
    'months.august': 'अगस्त',
    'months.september': 'सितंबर',
    'months.october': 'अक्टूबर',
    'months.november': 'नवंबर',
    'months.december': 'दिसंबर',

    // RecordBook Component
    'recordBook.title': 'रोगी रिकॉर्ड',
    'recordBook.searchPlaceholder': 'रोगी के नाम, बीमारी या स्थान से खोजें...',
    'recordBook.addRecord': 'नया रिकॉर्ड जोड़ें',
    'recordBook.patientName': 'रोगी का नाम',
    'recordBook.age': 'आयु',
    'recordBook.disease': 'बीमारी',
    'recordBook.location': 'स्थान',
    'recordBook.date': 'तारीख',
    'recordBook.status': 'स्थिति',
    'recordBook.actions': 'कार्य',
    'recordBook.noRecords': 'आपके खोज मानदंडों से मेल खाने वाला कोई रिकॉर्ड नहीं मिला।',
    'recordBook.edit': 'संपादित करें',
    'recordBook.delete': 'हटाएं',
    'recordBook.showing': 'दिखा रहे हैं',
    'recordBook.of': 'में से',
    'recordBook.records': 'रिकॉर्ड',
    'recordBook.cases': 'मामले',
    'recordBook.deaths': 'मृत्यु',
    'recordBook.state': 'राज्य',
    'recordBook.district': 'जिला',

    // Prediction Analysis Results
    'prediction.error.title': 'विश्लेषण त्रुटि',
    'prediction.results.title': 'रोग-जल गुणवत्ता विश्लेषण परिणाम',
    'prediction.results.diseaseTitle': 'रोग पूर्वानुमान विश्लेषण',
    'prediction.results.mostLikely': 'सबसे संभावित रोग',
    'prediction.results.basedOn': 'प्रकोप डेटा और जल गुणवत्ता विश्लेषण के आधार पर',
    'prediction.results.confidence': 'विश्वास',
    'prediction.results.riskLevel': 'जोखिम स्तर',
    'prediction.results.waterAssessment': 'जल गुणवत्ता मूल्यांकन',
    'prediction.results.wqi': 'जल गुणवत्ता सूचकांक (WQI)',
    'prediction.results.category': 'श्रेणी',
    'prediction.results.riskFactors': 'जोखिम कारक',
    'prediction.results.violations': 'पैरामीटर उल्लंघन',
    'prediction.results.recommendations': 'सिफारिशें',
    'prediction.results.futureOutlook': 'भविष्य के प्रकोप पूर्वानुमान',
    'prediction.results.cases': 'मामले',
    'prediction.results.disease': 'रोग',
    'prediction.results.seasonalFactor': 'मौसमी कारक',
    'prediction.results.summary': 'विश्लेषण सारांश',
    'prediction.results.summaryText': 'यह व्यापक रिपोर्ट रोग प्रकोप पूर्वानुमान, जल गुणवत्ता मूल्यांकन, सहसंबंध विश्लेषण और भविष्य की प्रवृत्तियों को जोड़कर कार्यात्मक स्वास्थ्य अंतर्दृष्टि प्रदान करती है। विश्लेषण 91.6% सटीकता के साथ ML मॉडल और WHO/BIS जल गुणवत्ता मानकों का उपयोग करता है।',
    'prediction.results.futureTitle': '3-महीने के भविष्य के प्रकोप पूर्वानुमान',
    'prediction.results.combinedRisk': 'संयुक्त जोखिम',
    'prediction.results.correlationRisk': 'सहसंबंध जोखिम',
    'prediction.results.waterRisk': 'जल जोखिम',
    'prediction.results.diseaseRisk': 'रोग जोखिम',

    // Global Statistics
    'global.annualDeaths': 'वैश्विक वार्षिक मृत्यु',
    'global.childrenAffected': '5 वर्ष से कम आयु के बच्चे प्रभावित',
    'global.peopleWithoutWater': 'सुरक्षित पानी के बिना लोग',
    'global.diseaseBurden': 'रोग भार (DALYs)',

    // Major Diseases
    'diseases.title': 'प्रमुख जल जनित रोग',
    'diseases.subtitle': 'सबसे सामान्य जल जनित रोगों, उनके लक्षणों, संचरण विधियों और रोकथाम रणनीतियों के बारे में जानें।',

    // Individual Disease Names and Descriptions
    'diseases.cholera': 'हैजा',
    'diseases.choleraDesc': 'एक बैक्टीरियल संक्रमण जो गंभीर दस्त और निर्जलीकरण का कारण बनता है, आमतौर पर असुरक्षित पानी से फैलता है।',
    'diseases.typhoid': 'टाइफाइड',
    'diseases.typhoidDesc': 'दूषित भोजन और पानी से फैलने वाली एक बैक्टीरियल बीमारी, जो बुखार, कमजोरी और पेट दर्द का कारण बनती है।',
    'diseases.dysentery': 'पेचिश',
    'diseases.dysenteryDesc': 'एक आंतों का संक्रमण जो खूनी दस्त का कारण बनता है, आमतौर पर असुरक्षित पेयजल के कारण होता है।',
    'diseases.giardiasis': 'गियार्डियासिस',
    'diseases.giardiasisDesc': 'एक परजीवी रोग जो पेट में ऐंठन और दस्त का कारण बनता है, असुरक्षित पानी के माध्यम से फैलता है।',

    // Action Tabs
    'tabs.prevention': 'रोकथाम',
    'tabs.awareness': 'जागरूकता',
    'tabs.treatment': 'इलाज',

    // Take Action Section
    'action.title': 'आज ही कार्रवाई करें',
    'action.description': 'लक्षणों का आकलन करने, रोकथाम के बारे में जानने या स्वास्थ्य सेवा संसाधनों तक पहुंचने के लिए हमारे उपकरणों का उपयोग करें।',
    'action.symptomAnalysis': 'लक्षण विश्लेषण',
    'action.learnMore': 'और जानें',

    // Key Insights Cards
    'insights.monsoonImpact': 'मानसून प्रभाव',
    'insights.monsoonInsight': 'मानसून के मौसम (जून-सितंबर) में बीमारी की दर 40-60% बढ़ जाती है',
    'insights.monsoonRecommendation': 'मानसून शुरू होने से पहले निवारक उपायों को मजबूत करें',
    'insights.geographicHotspots': 'भौगोलिक हॉटस्पॉट',
    'insights.geographicInsight': 'मेघालय लगातार अन्य राज्यों की तुलना में 2-3 गुना अधिक दर दिखाता है',
    'insights.geographicRecommendation': 'उच्च जोखिम वाले क्षेत्रों में लक्षित हस्तक्षेप की आवश्यकता',
    'insights.ageVulnerability': 'आयु संवेदनशीलता',
    'insights.ageInsight': '5 साल से कम उम्र के बच्चे गंभीर मामलों का 70% हिस्सा हैं',
    'insights.ageRecommendation': 'बाल चिकित्सा देखभाल और मातृ शिक्षा पर ध्यान दें',
    'insights.waterQuality': 'पानी की गुणवत्ता',
    'insights.waterInsight': 'बेहतर जल अवसंरचना वाले राज्य 50% कम दर दिखाते हैं',
    'insights.waterRecommendation': 'स्वच्छ पानी पहुंच कार्यक्रमों को तेज करें',
    'insights.healthcareAccess': 'स्वास्थ्य सेवा पहुंच',
    'insights.healthcareInsight': 'प्रारंभिक उपचार मृत्यु दर को 80-90% कम करता है',
    'insights.healthcareRecommendation': 'ग्रामीण स्वास्थ्य सुविधा कवरेज में सुधार करें',
    'insights.preventionSuccess': 'रोकथाम सफलता',
    'insights.preventionInsight': 'टीकाकरण कार्यक्रम लक्षित बीमारियों में 60% कमी दिखाते हैं',
    'insights.preventionRecommendation': 'दूरदराज के क्षेत्रों में टीकाकरण कवरेज का विस्तार करें',

    // Chart Sections
    'charts.seasonalTrends': 'मौसमी रुझान',
    'charts.seasonalDescription': 'विभिन्न जल जनित रोगों के लिए चरम मौसम दिखाने वाले मासिक भिन्नता पैटर्न।',
    'charts.diseaseComparison': 'रोग तुलना विश्लेषण',
    'charts.diseaseComparisonDescription': 'क्षेत्र में विभिन्न जल जनित रोगों का तुलनात्मक विश्लेषण।',
    'charts.stateAnalysis': 'राज्यवार विश्लेषण',
    'charts.stateAnalysisDescription': 'सभी पूर्वोत्तर भारतीय राज्यों में जल जनित रोग प्रसार का विस्तृत विवरण।',
    'charts.monthlyPrevalence': 'मासिक रोग प्रसार (%)',
    'charts.monsoonNote': 'मानसून का मौसम (जून-सितंबर) सबसे अधिक दर दिखाता है',
    'charts.regionalAnalysis': 'क्षेत्रीय विश्लेषण',
    'charts.averageRate': 'औसत दर',
    'charts.highestIn': 'सबसे अधिक में',
    'charts.peakRate': 'चरम दर',

    // Table Headers
    'table.state': 'राज्य',
    'table.diarrhea': 'दस्त',
    'table.fever': 'बुखार',
    'table.ari': 'एआरआई',
    'table.stateWisePrevalence': 'राज्यवार जल जनित रोग प्रसार (%)',
    'table.highestRisk': 'सबसे अधिक जोखिम',
    'table.preventionWorks': 'रोकथाम काम करती है',

    // Waterborne Diseases Page
    'waterborne.title': 'जल जनित रोगों को समझना',
    'waterborne.subtitle': 'पूर्वोत्तर भारत के लिए व्यापक गाइड',
    'waterborne.description': 'जल जनित रोग दूषित पानी के माध्यम से फैलने वाले रोगजनकों के कारण होने वाली बीमारियां हैं। ये रोग विशेष रूप से विकासशील क्षेत्रों में महत्वपूर्ण स्वास्थ्य चुनौतियां पैदा करते हैं जहां स्वच्छ पानी और उचित स्वच्छता तक पहुंच सीमित हो सकती है।',
    'waterborne.severity': 'गंभीरता',
    'waterborne.commonSymptoms': 'सामान्य लक्षण',
    'waterborne.transmission': 'संचरण',
    'waterborne.mortalityRate': 'मृत्यु दर',
    'waterborne.preventionMethods': 'रोकथाम के तरीके',
    'waterborne.impactSignificance': 'प्रभाव और महत्व',

    // Northeast India Section
    'northeast.title': 'पूर्वोत्तर भारत: अनूठी चुनौतियां',
    'northeast.description': 'भारत के पूर्वोत्तर राज्य भौगोलिक, जलवायु और बुनियादी ढांचे के कारकों के कारण जल जनित रोगों से संबंधित विशिष्ट चुनौतियों का सामना करते हैं।',
    'northeast.geographicFactors': 'भौगोलिक कारक',
    'northeast.commonIssues': 'सामान्य समस्याएं',
    'northeast.vulnerableGroups': 'संवेदनशील समूह',

    // Prevention Section
    'prevention.title': 'रोकथाम और कार्य योजना',
    'prevention.description': 'जल जनित रोगों से अपनी और अपने समुदाय की सुरक्षा के लिए ये आवश्यक कदम उठाएं।',
    'prevention.waterTreatment': 'जल उपचार',
    'prevention.sanitation': 'स्वच्छता',
    'prevention.personalHygiene': 'व्यक्तिगत स्वच्छता',
    'prevention.communityAction': 'सामुदायिक कार्रवाई',
    'prevention.medicalCare': 'चिकित्सा देखभाल',
    'prevention.emergencyResponse': 'आपातकालीन प्रतिक्रिया',

    // Call to Action
    'cta.needHelp': 'तत्काल सहायता चाहिए?',
    'cta.helpDescription': 'यदि आप लक्षणों का अनुभव कर रहे हैं या जल जनित रोगों पर मार्गदर्शन चाहते हैं, तो हमारा लक्षण विश्लेषण उपकरण व्यक्तिगत सिफारिशें प्रदान करने में मदद कर सकता है।',
    'cta.analyzeSymptoms': 'लक्षणों का विश्लेषण करें',
    'cta.backToHome': 'होम पर वापस जाएं',

    // Disease Names and Severity
    'disease.cholera': 'हैजा',
    'disease.typhoidFever': 'टाइफाइड बुखार',
    'disease.hepatitisA': 'हेपेटाइटिस ए',
    'disease.dysentery': 'पेचिश',
    'disease.giardiasis': 'जिआर्डियासिस',
    'disease.cryptosporidiosis': 'क्रिप्टोस्पोरिडियोसिस',
    'disease.high': 'उच्च',
    'disease.moderate': 'मध्यम',

    // Geographic Factors
    'geo.highRainfall': 'अधिक वर्षा और बाढ़',
    'geo.mountainous': 'पहाड़ी इलाका',
    'geo.remoteCommunities': 'दूरदराज के ग्रामीण समुदाय',
    'geo.limitedInfrastructure': 'सीमित बुनियादी ढांचा पहुंच',

    // Common Issues
    'issues.contaminatedWater': 'दूषित पानी के स्रोत',
    'issues.poorSanitation': 'खराब स्वच्छता सुविधाएं',
    'issues.seasonalOutbreaks': 'मौसमी रोग प्रकोप',
    'issues.limitedHealthcare': 'सीमित स्वास्थ्य सेवा पहुंच',

    // Vulnerable Groups
    'vulnerable.childrenUnder5': '5 साल से कम उम्र के बच्चे',
    'vulnerable.pregnantWomen': 'गर्भवती महिलाएं',
    'vulnerable.elderly': 'बुजुर्ग आबादी',
    'vulnerable.immunocompromised': 'प्रतिरक्षा कमजोर व्यक्ति',

    // Key Insights Cards
    'insights.highestRiskDescription': 'सभी जल जनित रोगों में सबसे अधिक प्रसार दिखाता है:',
    'insights.diarrhea': 'दस्त: 10% (सबसे अधिक)',
    'insights.fever': 'बुखार: 23% (सबसे अधिक)',
    'insights.ari': 'एआरआई: 4.8% (सबसे अधिक)',
    'insights.contributingFactors': 'योगदान कारक',
    'insights.contributingDescription': 'अनुसंधान से पता चलता है कि अधिक प्रसार इससे जुड़ा है:',
    'insights.poorSanitation': 'खराब स्वच्छता सुविधाएं',
    'insights.lackCleanWater': 'स्वच्छ पानी की पहुंच की कमी',
    'insights.lowerSocioeconomic': 'निम्न सामाजिक-आर्थिक स्थिति',
    'insights.ruralLiving': 'ग्रामीण जीवन स्थितियां',
    'insights.preventionDescription': 'बेहतर परिणाम वाले राज्य दिखाते हैं:',
    'insights.improvedWaterTreatment': 'बेहतर जल उपचार',
    'insights.betterSanitationCoverage': 'बेहतर स्वच्छता कवरेज',
    'insights.healthEducationPrograms': 'स्वास्थ्य शिक्षा कार्यक्रम',
    'insights.vaccinationInitiatives': 'टीकाकरण पहल',

    // Get Started Page
    'getStarted.title': 'हम आपकी मदद के लिए यहाँ हैं',
    'getStarted.subtitle': 'आपका स्वास्थ्य और कल्याण हमारे लिए महत्वपूर्ण है। कृपया कुछ बुनियादी जानकारी साझा करें ताकि हम आपको सबसे प्रासंगिक मार्गदर्शन और सहायता प्रदान कर सकें।',
    'getStarted.disclaimer': 'यह उपकरण सामान्य स्वास्थ्य जानकारी प्रदान करता है और पेशेवर चिकित्सा सलाह का विकल्प नहीं है।',
    'getStarted.form.name': 'आपका नाम',
    'getStarted.form.namePlaceholder': 'अपना पूरा नाम दर्ज करें',
    'getStarted.form.age': 'उम्र',
    'getStarted.form.agePlaceholder': 'अपनी उम्र दर्ज करें',
    'getStarted.form.location': 'स्थान',
    'getStarted.form.locationPlaceholder': 'शहर, राज्य',
    'getStarted.form.symptoms': 'अपने लक्षणों का वर्णन करें',
    'getStarted.form.symptomsPlaceholder': 'कृपया विस्तार से बताएं कि आप क्या महसूस कर रहे हैं...',
    'getStarted.form.voiceInput': 'वॉयस इनपुट शुरू करें',
    'getStarted.form.stopRecording': '🔴 रिकॉर्डिंग बंद करें',
    'getStarted.form.clearText': 'टेक्स्ट साफ़ करें',
    'getStarted.form.submit': 'व्यक्तिगत मार्गदर्शन प्राप्त करें',
    'getStarted.form.analyzing': 'लक्षणों का विश्लेषण कर रहे हैं...',
    'getStarted.form.submitDescription': 'हम आपकी जानकारी का विश्लेषण करेंगे और सहायक संसाधन और सिफारिशें प्रदान करेंगे।',

    // Common Terms
    'common.diarrhea': 'दस्त',
    'common.fever': 'बुखार',
    'common.ari': 'एआरआई',
    'common.symptoms': 'लक्षण',
    'common.prevention': 'रोकथाम',
    'common.treatment': 'इलाज',
    'common.severity': 'गंभीरता',
    'common.high': 'उच्च',
    'common.medium': 'मध्यम',
    'common.low': 'कम',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफल',
  },

  mni: {
    // Navigation (Manipuri/Meitei)
    'nav.home': 'য়ুম',
    'nav.getStarted': 'হৌরক্কো',
    'nav.testimonials': 'তাক্নিংবা ৱারোল',
    'nav.statistics': 'মসিং',
    'nav.doctorLogin': 'দোক্তর লোগিন',
    'nav.logout': 'লোগআউত',
    'nav.backToHome': '← য়ুমদা হল্লক্কো',

    // Home Page
    'home.title': 'ইশিং-গী রোগ খংনবা',
    'home.subtitle': 'উত্তর-পূর্ব ভারত',
    'home.description': 'ইশিং-গী রোগ থিংবদা লৌমি অমসুং থবক শিজিন্নদুনা কমিউনিতিশিংবু মতিক চাবা। খুদক্তা নাতোন পরখবা, থিংবগী মতাংদা লৌবা অমসুং স্বাস্থ্য সেবাগী রিসোর্স ফংবা।',
    'home.getStarted': 'হৌরক্কো',
    'home.learnMore': 'অহেনবা তাক্কো',
    'home.symptomAnalysis': 'নাতোন পরখবা',
    'home.support247': '২৪/৭ মতেং',
    'home.hepatitisA': 'হেপাতাইতিস এ',
    'home.hepatitisADesc': 'অমাংবা ইশিং অমসুং চিঞ্জাক-গী মফমদা থোকপা ভাইরেল লিভর-গী রোগ।',

    // Get Started Page
    'getStarted.title': 'ঐখোয়না নখোয়বু মতেং পাংবদা মফম অসিদা লৈ',
    'getStarted.subtitle': 'নখোয়গী স্বাস্থ্য অমসুং ফবা লৈবা অসি ঐখোয়গীদমক অচৌবা অমনি। চানবিদুনা অকোয়বা ইনফোর্মেশন খরা শেয়ার তৌবিয়ু অদুগা ঐখোয়না নখোয়দা খ্বাইদগী মরি লৈনবা গাইদেন্স অমসুং মতেং পীবা ঙমগনি।',
    'getStarted.disclaimer': 'তুল অসিনা কমন স্বাস্থ্য ইনফোর্মেশন পীরি অমসুং প্রোফেশনেল মেদিকেল এদভাইসকী মহুত্তা নত্তে।',

    // Common Terms
    'common.diarrhea': 'খোং থোকপা',
    'common.fever': 'লাইনা',
    'common.ari': 'এআরআই',
    'common.symptoms': 'নাতোনশিং',
    'common.prevention': 'থিংবা',
    'common.treatment': 'অনাবা',
    'common.severity': 'অওবা',
    'common.high': 'মথক্তা',
    'common.medium': 'মধ্যম',
    'common.low': 'মখাদা',
    'common.loading': 'লোদ তৌরি...',
    'common.error': 'অরানবা',
    'common.success': 'লৈরে',
  },

  garo: {
    // Navigation (Garo)
    'nav.home': 'Dakgipa',
    'nav.getStarted': 'Tua',
    'nav.testimonials': 'Saksa Aro',
    'nav.statistics': 'Ganani',
    'nav.doctorLogin': 'Daktar Login',
    'nav.logout': 'Logout',
    'nav.backToHome': '← Dakgipao Raka',

    // Home Page
    'home.title': 'Chi-a Roga Janggipa',
    'home.subtitle': 'Uttar-purba Bharot',
    'home.description': 'Chi-a roga thingba aro jakkalgipa man-ani aro thokgipa chi-a dakbeani kamjong-ko matjokaha. Dakni natok janggipa, thingba-ni gisepo aro swasthya seba-ni thokgipa man-ani.',
    'home.getStarted': 'Tua',
    'home.learnMore': 'Gisik Janggipa',
    'home.symptomAnalysis': 'Natok Janggipa',
    'home.support247': '24/7 Mateng',
    'home.hepatitisA': 'Hepatitis A',
    'home.hepatitisADesc': 'Amangba chi aro chinja-ni madhyom-o thokgipa viral liver-ni roga.',

    // Get Started Page
    'getStarted.title': 'Ang-ko Matengaha Ia-o Dong-a',
    'getStarted.subtitle': 'Nangni swasthya aro phaba dong-a ia ang-ni kamjong-o matjok-a. Dakbeani janggipa man-ani share toa aduga ang-ko khobor matjok-aha guidance aro mateng pijok-a.',
    'getStarted.disclaimer': 'Ia tool-o common swasthya janggipa pijok-a aro professional medical advice-ni bodol nanga.',

    // Common Terms
    'common.diarrhea': 'Khong Thokpa',
    'common.fever': 'Rim-a',
    'common.ari': 'ARI',
    'common.symptoms': 'Natok-ko',
    'common.prevention': 'Thingba',
    'common.treatment': 'Anaba',
    'common.severity': 'Dakbeani',
    'common.high': 'Gitcham',
    'common.medium': 'Majjha',
    'common.low': 'Nokma',
    'common.loading': 'Load tong-a...',
    'common.error': 'Galti',
    'common.success': 'Kamjok',
  }
})

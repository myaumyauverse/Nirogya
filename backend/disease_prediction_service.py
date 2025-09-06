#!/usr/bin/env python3
"""
Simplified Disease Prediction Service for Chatbot Integration
============================================================

A lightweight disease prediction service that provides disease type prediction
and health recommendations based on symptom analysis.

Features:
- Disease type prediction based on symptoms
- Risk assessment and severity levels
- Health recommendations
- Regional context for Northeast India
"""

import os
import sys
import json
import random
from typing import Dict, List, Optional
from datetime import datetime

class DiseasePredictor:
    """
    A simplified disease predictor for chatbot integration
    """
    
    def __init__(self):
        """Initialize the predictor with disease knowledge base"""
        self.disease_knowledge = self._load_disease_knowledge()
        self.symptom_weights = self._load_symptom_weights()
        self.regional_data = self._load_regional_data()
        print("✅ Disease predictor initialized successfully!")
    
    def _load_disease_knowledge(self) -> Dict:
        """Load disease knowledge base"""
        return {
            'Acute Diarrheal Disease': {
                'symptoms': ['diarrhea', 'stomach pain', 'dehydration', 'nausea', 'vomiting', 'fever',
                           'loose motion', 'pet dard', 'pet mein dard', 'bukhar', 'ulti'],
                'severity': 'Moderate',
                'transmission': 'Contaminated water/food',
                'treatment': 'ORS, antibiotics if severe',
                'mortality_rate': 2.5,
                'common_in_monsoon': True
            },
            'Cholera': {
                'symptoms': ['severe diarrhea', 'vomiting', 'dehydration', 'muscle cramps', 'thirst'],
                'severity': 'High',
                'transmission': 'Contaminated water',
                'treatment': 'Immediate rehydration, antibiotics',
                'mortality_rate': 15.0,
                'common_in_monsoon': True
            },
            'Typhoid': {
                'symptoms': ['high fever', 'headache', 'abdominal pain', 'weakness', 'loss of appetite'],
                'severity': 'High',
                'transmission': 'Contaminated water/food',
                'treatment': 'Antibiotics, supportive care',
                'mortality_rate': 8.0,
                'common_in_monsoon': False
            },
            'Dysentery': {
                'symptoms': ['bloody diarrhea', 'fever', 'abdominal cramps', 'tenesmus'],
                'severity': 'Moderate to High',
                'transmission': 'Contaminated water/food',
                'treatment': 'Antibiotics, fluids',
                'mortality_rate': 5.0,
                'common_in_monsoon': True
            },
            'Gastroenteritis': {
                'symptoms': ['diarrhea', 'nausea', 'vomiting', 'stomach cramps', 'fever',
                           'loose motion', 'pet kharab', 'ulti', 'jee michlaana', 'bukhar'],
                'severity': 'Mild to Moderate',
                'transmission': 'Contaminated food/water',
                'treatment': 'Rest, fluids, ORS',
                'mortality_rate': 1.0,
                'common_in_monsoon': True
            },
            'Hepatitis A': {
                'symptoms': ['jaundice', 'fatigue', 'nausea', 'abdominal pain', 'loss of appetite'],
                'severity': 'Moderate',
                'transmission': 'Contaminated water/food',
                'treatment': 'Rest, supportive care',
                'mortality_rate': 0.5,
                'common_in_monsoon': False
            }
        }
    
    def _load_symptom_weights(self) -> Dict:
        """Load symptom importance weights"""
        return {
            'severe diarrhea': 0.9,
            'bloody diarrhea': 0.95,
            'diarrhea': 0.8,
            'high fever': 0.85,
            'fever': 0.7,
            'vomiting': 0.75,
            'dehydration': 0.9,
            'jaundice': 0.95,
            'abdominal pain': 0.6,
            'stomach pain': 0.6,
            'headache': 0.5,
            'nausea': 0.6,
            'weakness': 0.4,
            'fatigue': 0.4,
            'muscle cramps': 0.7,
            'loss of appetite': 0.4,
            # Regional terms with weights
            'pet dard': 0.8,
            'pet mein dard': 0.8,
            'loose motion': 0.8,
            'paani jaisa': 0.9,
            'bukhar': 0.7,
            'jor bukhar': 0.85,
            'ulti': 0.75,
            'kamjori': 0.4,
            'sir dard': 0.5,
            'jee michlaana': 0.6
        }

    def _load_regional_data(self) -> Dict:
        """Load regional language mappings from regional.json"""
        try:
            # Try to find regional.json in the AI chatbot directory
            regional_file_paths = [
                os.path.join(os.path.dirname(__file__), '..', 'AI chatbot', 'regional.json'),
                os.path.join(os.path.dirname(__file__), 'regional.json'),
                'regional.json'
            ]

            for path in regional_file_paths:
                if os.path.exists(path):
                    with open(path, 'r', encoding='utf-8') as f:
                        return json.load(f)

            print("⚠️ Regional.json not found, using basic regional mappings")
            return self._get_basic_regional_mappings()

        except Exception as e:
            print(f"⚠️ Error loading regional data: {e}")
            return self._get_basic_regional_mappings()

    def _get_basic_regional_mappings(self) -> Dict:
        """Fallback regional mappings if file not found"""
        return {
            "synonyms": {
                "pet mein dard": "stomach pain",
                "pet dard": "stomach pain",
                "pet kharab": "stomach pain",
                "loose motion": "diarrhea",
                "paani jaisa potty": "diarrhea",
                "bukhar": "fever",
                "jor": "fever",
                "ulti": "vomiting",
                "sir mein dard": "headache",
                "kamjori": "weakness",
                "takat nahi": "weakness",
                "jee michlaana": "nausea",
                "pyaas": "thirst",
                "thakaan": "fatigue"
            }
        }

    def _translate_regional_terms(self, symptoms_text: str) -> str:
        """Translate regional/Hindi terms to English for better processing"""
        try:
            translated_text = symptoms_text.lower()

            # Get synonyms from regional data
            synonyms = self.regional_data.get('synonyms', {})

            # Replace regional terms with English equivalents
            for regional_term, english_term in synonyms.items():
                if regional_term.lower() in translated_text:
                    translated_text = translated_text.replace(regional_term.lower(), english_term.lower())

            # Additional common Hindi/Hinglish patterns (order matters - longer phrases first)
            hindi_patterns = {
                'mujhe pet mein dard hai': 'i have stomach pain',
                'mujhe pet dard hai': 'i have stomach pain',
                'pet mein dard hai': 'stomach pain',
                'pet mein dard': 'stomach pain',
                'pet dard hai': 'stomach pain',
                'dard hai': 'pain',
                'pet dard': 'stomach pain',
                'mujhe': 'i have',
                'mere': 'my',
                'pet mein': 'stomach',
                'sir mein': 'head',
                'dard': 'pain',
                'hai': '',  # Remove 'hai' as it's just 'is' and not needed
                'ho raha hai': 'happening',
                'aa raha hai': 'coming',
                'feel kar raha hun': 'feeling',
                'paani jesa': 'watery',
                'paani jaisa': 'watery',
                'bahut': 'very',
                'thoda': 'little',
                'zyada': 'more',
                'bhi': 'also',
                'aur': 'and',
                'jor': 'high',
                'tez': 'severe'
            }

            for hindi, english in hindi_patterns.items():
                translated_text = translated_text.replace(hindi, english)

            return translated_text

        except Exception as e:
            print(f"Warning: Regional translation failed: {e}")
            return symptoms_text

    def predict_disease_type(self, symptoms_text: str) -> Dict:
        """
        Predict disease type based on symptoms text
        
        Args:
            symptoms_text (str): User's symptom description
            
        Returns:
            dict: Disease prediction with probability and characteristics
        """
        try:
            # First translate regional terms to English
            translated_symptoms = self._translate_regional_terms(symptoms_text)

            # Normalize symptoms text
            symptoms_lower = translated_symptoms.lower()
            
            # Calculate disease scores
            disease_scores = {}
            
            for disease, info in self.disease_knowledge.items():
                score = 0.0
                matched_symptoms = []
                
                for symptom in info['symptoms']:
                    if symptom.lower() in symptoms_lower:
                        weight = self.symptom_weights.get(symptom.lower(), 0.5)
                        score += weight
                        matched_symptoms.append(symptom)
                
                # Bonus for multiple symptom matches
                if len(matched_symptoms) > 1:
                    score *= (1 + 0.1 * len(matched_symptoms))
                
                disease_scores[disease] = {
                    'score': score,
                    'matched_symptoms': matched_symptoms,
                    'info': info
                }
            
            # Normalize scores to probabilities
            total_score = sum([d['score'] for d in disease_scores.values()])
            
            if total_score == 0:
                # Check if we have any recognizable symptoms even if no disease match
                translated_symptoms = self._translate_regional_terms(symptoms_text).lower()
                common_symptoms = ['stomach pain', 'diarrhea', 'fever', 'vomiting', 'nausea',
                                 'pet dard', 'pet mein dard', 'loose motion', 'bukhar', 'ulti']

                recognized_symptoms = [s for s in common_symptoms if s in translated_symptoms]

                if recognized_symptoms:
                    return {
                        'predicted_disease': 'General Gastrointestinal Symptoms',
                        'probability': 15.0,  # Low but not zero
                        'confidence': 'Low',
                        'all_probabilities': {'General Gastrointestinal Symptoms': 15.0},
                        'mortality_rate': 0.5,
                        'matched_symptoms': recognized_symptoms,
                        'disease_info': {
                            'severity': 'Mild',
                            'transmission': 'Various causes',
                            'treatment': 'Symptomatic care, monitor symptoms'
                        }
                    }
                else:
                    return {
                        'predicted_disease': 'Unknown',
                        'probability': 0.0,
                        'confidence': 'Low',
                        'all_probabilities': {},
                        'mortality_rate': 0.0,
                        'matched_symptoms': []
                    }
            
            disease_probabilities = {}
            for disease, data in disease_scores.items():
                probability = (data['score'] / total_score) * 100
                disease_probabilities[disease] = probability
            
            # Get top prediction
            top_disease = max(disease_probabilities.keys(), key=lambda k: disease_probabilities[k])
            top_probability = disease_probabilities[top_disease]
            
            # Determine confidence
            if top_probability > 40:
                confidence = "High"
            elif top_probability > 25:
                confidence = "Medium"
            else:
                confidence = "Low"
            
            # Get disease info
            disease_info = disease_scores[top_disease]['info']
            matched_symptoms = disease_scores[top_disease]['matched_symptoms']
            
            return {
                'predicted_disease': top_disease,
                'probability': round(top_probability, 1),
                'confidence': confidence,
                'all_probabilities': {k: round(v, 1) for k, v in disease_probabilities.items()},
                'disease_info': {
                    'severity': disease_info['severity'],
                    'transmission': disease_info['transmission'],
                    'treatment': disease_info['treatment']
                },
                'mortality_rate': disease_info['mortality_rate'],
                'matched_symptoms': matched_symptoms
            }
            
        except Exception as e:
            return {'error': f"Disease prediction failed: {str(e)}"}
    
    def get_severity_assessment(self, disease_prediction: Dict, symptoms_text: str) -> str:
        """Get overall severity assessment"""
        if 'error' in disease_prediction:
            return "Unknown Risk"

        probability = disease_prediction.get('probability', 0)
        disease = disease_prediction.get('predicted_disease', '')

        # Translate symptoms for better assessment
        translated_symptoms = self._translate_regional_terms(symptoms_text).lower()

        # High-risk diseases
        high_risk_diseases = ['Cholera', 'Typhoid', 'Dysentery']

        # Check for emergency symptoms (including regional terms)
        emergency_symptoms = ['severe diarrhea', 'bloody diarrhea', 'severe dehydration', 'high fever',
                            'paani jaisa', 'jor bukhar', 'khoon']
        has_emergency = any(symptom in translated_symptoms for symptom in emergency_symptoms)

        # Check for common symptoms (including regional terms)
        common_symptoms = ['stomach pain', 'diarrhea', 'fever', 'vomiting', 'nausea',
                          'pet dard', 'pet mein dard', 'loose motion', 'bukhar', 'ulti']
        has_common_symptoms = any(symptom in translated_symptoms for symptom in common_symptoms)

        # Enhanced assessment logic
        if disease in high_risk_diseases and probability > 30:
            return "High Risk - Seek Immediate Medical Attention"
        elif has_emergency or probability > 50:
            return "Moderate Risk - Consult Healthcare Provider Soon"
        elif probability > 25 or (has_common_symptoms and probability > 10):
            return "Low to Moderate Risk - Monitor Symptoms Closely"
        elif has_common_symptoms or probability > 0:
            return "Low Risk - General Precautions Advised"
        else:
            return "Mild Symptoms - Basic Care Recommended"
    
    def get_health_recommendations(self, disease_prediction: Dict, symptoms_text: str) -> List[str]:
        """Get health recommendations based on prediction"""
        recommendations = []

        if 'error' in disease_prediction:
            return [
                "Stay hydrated with clean, boiled water",
                "Rest and monitor symptoms",
                "Consult healthcare professional if symptoms persist"
            ]

        # Translate symptoms for better recommendation matching
        translated_symptoms = self._translate_regional_terms(symptoms_text).lower()
        
        disease = disease_prediction.get('predicted_disease', '')

        # Immediate care based on symptoms (including regional terms)
        if any(term in translated_symptoms for term in ['diarrhea', 'loose motion', 'paani jaisa']):
            recommendations.append("🚰 Drink ORS (Oral Rehydration Solution) to prevent dehydration")
            recommendations.append("🍚 Eat bland foods like rice, bananas, and toast")

        if any(term in translated_symptoms for term in ['fever', 'bukhar', 'jor']):
            recommendations.append("🌡️ Monitor temperature and take fever reducers if needed")
            recommendations.append("🛏️ Get plenty of rest")

        if any(term in translated_symptoms for term in ['vomiting', 'ulti']):
            recommendations.append("💧 Take small, frequent sips of clear fluids")
            recommendations.append("🚫 Avoid solid foods until vomiting stops")

        if any(term in translated_symptoms for term in ['stomach pain', 'pet dard', 'pet mein dard']):
            recommendations.append("🍵 Try ginger tea or warm water for stomach comfort")
            recommendations.append("🥗 Avoid spicy, oily, or heavy foods")
        
        # Disease-specific recommendations
        if disease == 'Cholera':
            recommendations.append("🚨 Seek immediate medical attention")
            recommendations.append("💉 IV fluids may be necessary")
        elif disease == 'Typhoid':
            recommendations.append("💊 Antibiotic treatment is essential")
            recommendations.append("🏥 Hospitalization may be required")
        
        # General recommendations
        recommendations.extend([
            "💧 Boil drinking water for at least 10 minutes",
            "🧼 Wash hands frequently with soap and clean water",
            "🏥 Contact nearest PHC (Primary Health Centre) if symptoms worsen"
        ])
        
        return recommendations[:8]  # Limit to 8 recommendations
    
    def create_sample_input(self) -> Dict:
        """Create sample input for testing"""
        return {
            'symptoms': 'stomach pain, diarrhea, fever, nausea',
            'duration': '2 days',
            'severity': 'moderate'
        }

# For backward compatibility
def create_disease_predictor():
    """Factory function to create disease predictor"""
    return DiseasePredictor()

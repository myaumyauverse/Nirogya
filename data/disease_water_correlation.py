#!/usr/bin/env python3
"""
Integrated Disease-Water Quality Correlation Analysis
===================================================
A comprehensive tool that correlates disease outbreak predictions with water quality assessments
to provide actionable health and environmental insights.

Features:
- Disease outbreak prediction using ML models
- Water quality assessment using standardized WQI calculation
- Correlation analysis between water quality and disease risk
- Integrated recommendations for health authorities
- Risk mapping and alert system
- Prevention strategies based on combined analysis

Usage:
    python disease_water_correlation.py
    python disease_water_correlation.py --mode batch --input data.csv
    python disease_water_correlation.py --mode quick --deaths 5 --ph 8.5 --do 3.0

Author: SIH Project Team
Date: September 5, 2025
"""

import sys
import os
import argparse
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, List, Tuple, Optional
import warnings
warnings.filterwarnings('ignore')

# Add current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import our existing services
from disease_prediction_service import DiseasePredictor


class IntegratedHealthAnalyzer:
    """
    Integrated analyzer that correlates disease predictions with water quality assessments
    """
    
    def __init__(self):
        """Initialize the integrated analyzer"""
        self.disease_predictor = None
        self.load_disease_model()
        
        # Water quality parameter thresholds (WHO/BIS standards)
        self.water_standards = {
            'ph': {'min': 6.5, 'max': 8.5, 'optimal': 7.0},
            'dissolved_oxygen': {'min': 5.0, 'optimal': 8.0},
            'bod': {'max': 3.0, 'critical': 10.0},
            'nitrate_n': {'max': 10.0, 'critical': 20.0},
            'fecal_coliform': {'max': 50.0, 'critical': 200.0},
            'total_coliform': {'max': 500.0, 'critical': 1000.0},
            'temperature': {'min': 15.0, 'max': 30.0}
        }
        
        # Disease-Water Quality correlation patterns
        self.disease_water_correlations = {
            'Cholera': {
                'high_risk_factors': ['high_fecal_coliform', 'high_total_coliform', 'low_ph'],
                'critical_parameters': ['fecal_coliform', 'total_coliform'],
                'seasonal_pattern': 'monsoon_peak'
            },
            'Typhoid': {
                'high_risk_factors': ['high_fecal_coliform', 'high_nitrate', 'poor_sanitation'],
                'critical_parameters': ['fecal_coliform', 'nitrate_n'],
                'seasonal_pattern': 'pre_post_monsoon'
            },
            'Acute Diarrheal Disease': {
                'high_risk_factors': ['bacterial_contamination', 'poor_water_quality'],
                'critical_parameters': ['fecal_coliform', 'total_coliform', 'bod'],
                'seasonal_pattern': 'year_round'
            },
            'Hepatitis A': {
                'high_risk_factors': ['fecal_contamination', 'poor_sanitation'],
                'critical_parameters': ['fecal_coliform', 'total_coliform'],
                'seasonal_pattern': 'monsoon_peak'
            },
            'Dysentery': {
                'high_risk_factors': ['bacterial_contamination', 'high_organic_load'],
                'critical_parameters': ['fecal_coliform', 'bod'],
                'seasonal_pattern': 'warm_months'
            },
            'Food Poisoning': {
                'high_risk_factors': ['poor_hygiene', 'contaminated_water'],
                'critical_parameters': ['fecal_coliform', 'temperature'],
                'seasonal_pattern': 'summer_peak'
            }
        }
    
    def load_disease_model(self):
        """Load the disease prediction model"""
        try:
            self.disease_predictor = DiseasePredictor()
            print("✅ Disease prediction model loaded successfully!")
        except Exception as e:
            print(f"⚠️ Warning: Could not load disease model - {str(e)}")
            print("   Disease predictions will use rule-based approach")
    
    def calculate_wqi(self, water_params: Dict[str, float]) -> float:
        """Calculate Water Quality Index using standardized formula"""
        weights = {
            'ph': 0.15,
            'dissolved_oxygen': 0.20,
            'bod': 0.15,
            'nitrate_n': 0.15,
            'fecal_coliform': 0.20,
            'total_coliform': 0.15
        }
        
        wqi = 0
        
        # pH scoring (optimal range: 6.5-8.5)
        ph_val = water_params.get('ph', 7.0)
        if 6.5 <= ph_val <= 8.5:
            ph_score = 0
        else:
            ph_score = min(abs(ph_val - 7.0) * 15, 100)
        wqi += weights['ph'] * ph_score
        
        # Dissolved Oxygen scoring (higher is better, >5 mg/L is good)
        do_val = water_params.get('dissolved_oxygen', 5.0)
        if do_val >= 5:
            do_score = 0
        else:
            do_score = (5 - do_val) * 20
        wqi += weights['dissolved_oxygen'] * min(do_score, 100)
        
        # BOD scoring (lower is better, <3 mg/L is good)
        bod_val = water_params.get('bod', 3.0)
        if bod_val <= 3:
            bod_score = 0
        else:
            bod_score = (bod_val - 3) * 10
        wqi += weights['bod'] * min(bod_score, 100)
        
        # Nitrate scoring (lower is better, <10 mg/L is good)
        nitrate_val = water_params.get('nitrate_n', 5.0)
        if nitrate_val <= 10:
            nitrate_score = nitrate_val * 2
        else:
            nitrate_score = 20 + (nitrate_val - 10) * 8
        wqi += weights['nitrate_n'] * min(nitrate_score, 100)
        
        # Fecal Coliform scoring (lower is better, <50 CFU/100mL is good)
        fc_val = water_params.get('fecal_coliform', 20.0)
        if fc_val <= 50:
            fc_score = fc_val * 0.5
        else:
            fc_score = 25 + (fc_val - 50) * 0.1
        wqi += weights['fecal_coliform'] * min(fc_score, 100)
        
        # Total Coliform scoring (lower is better, <500 CFU/100mL is good)
        tc_val = water_params.get('total_coliform', 100.0)
        if tc_val <= 500:
            tc_score = tc_val * 0.05
        else:
            tc_score = 25 + (tc_val - 500) * 0.01
        wqi += weights['total_coliform'] * min(tc_score, 100)
        
        return wqi
    
    def assess_water_quality_risk(self, water_params: Dict[str, float]) -> Dict[str, any]:
        """Assess water quality and categorize risk factors"""
        wqi = self.calculate_wqi(water_params)
        
        # Categorize overall water quality
        if wqi <= 25:
            quality_category = "Excellent"
            quality_risk = "Low"
        elif wqi <= 50:
            quality_category = "Good"
            quality_risk = "Low"
        elif wqi <= 75:
            quality_category = "Moderate"
            quality_risk = "Medium"
        elif wqi <= 100:
            quality_category = "Poor"
            quality_risk = "High"
        else:
            quality_category = "Very Poor"
            quality_risk = "Very High"
        
        # Identify specific risk factors
        risk_factors = []
        critical_violations = []
        
        # Check each parameter against standards
        for param, value in water_params.items():
            if param in self.water_standards:
                standard = self.water_standards[param]
                
                if param == 'ph':
                    if value < standard['min'] or value > standard['max']:
                        risk_factors.append(f"pH out of range ({value:.1f})")
                        if value < 6.0 or value > 9.0:
                            critical_violations.append('extreme_ph')
                
                elif param == 'dissolved_oxygen':
                    if value < standard['min']:
                        risk_factors.append(f"Low dissolved oxygen ({value:.1f} mg/L)")
                        if value < 2.0:
                            critical_violations.append('oxygen_depletion')
                
                elif param in ['bod', 'nitrate_n', 'fecal_coliform', 'total_coliform']:
                    max_val = standard['max']
                    critical_val = standard.get('critical', max_val * 2)
                    
                    if value > max_val:
                        risk_factors.append(f"High {param.replace('_', ' ')} ({value:.1f})")
                        if value > critical_val:
                            critical_violations.append(f'critical_{param}')
                
                elif param == 'temperature':
                    if value < standard['min'] or value > standard['max']:
                        risk_factors.append(f"Temperature stress ({value:.1f}°C)")
        
        return {
            'wqi': wqi,
            'quality_category': quality_category,
            'quality_risk': quality_risk,
            'risk_factors': risk_factors,
            'critical_violations': critical_violations
        }
    
    def predict_future_outbreak_trend(self, outbreak_data: Dict[str, any], 
                                     water_params: Dict[str, float], 
                                     months_ahead: int = 3) -> Dict[str, any]:
        """
        Predict future outbreak trends based on current conditions and seasonal patterns
        
        Args:
            outbreak_data: Current outbreak information
            water_params: Current water quality parameters
            months_ahead: Number of months to predict ahead (default: 3)
            
        Returns:
            Dict with future predictions for each month
        """
        current_month = outbreak_data.get('Start_of_Outbreak_Month', 7)
        current_cases = outbreak_data.get('No_of_Cases', 0)
        current_state = outbreak_data.get('Northeast_State', 1)
        
        future_predictions = {}
        
        # Seasonal risk factors (Northeast India patterns)
        seasonal_multipliers = {
            1: 0.6,   # January - Winter, lower risk
            2: 0.6,   # February - Winter, lower risk  
            3: 0.7,   # March - Pre-summer
            4: 0.8,   # April - Summer onset
            5: 0.9,   # May - Pre-monsoon
            6: 1.4,   # June - Early monsoon, high risk
            7: 1.6,   # July - Peak monsoon, highest risk
            8: 1.5,   # August - Monsoon continues
            9: 1.3,   # September - Late monsoon
            10: 1.0,  # October - Post-monsoon
            11: 0.8,  # November - Winter approach
            12: 0.7   # December - Winter
        }
        
        # Water quality impact on future predictions
        current_wqi = self.calculate_wqi(water_params)
        
        if current_wqi > 50:  # Poor water quality
            water_risk_multiplier = 1.5
        elif current_wqi > 30:  # Moderate water quality
            water_risk_multiplier = 1.2
        else:  # Good water quality
            water_risk_multiplier = 0.8
        
        for month_offset in range(1, months_ahead + 1):
            future_month = ((current_month + month_offset - 1) % 12) + 1
            
            # Base prediction using current trend
            base_trend = current_cases * 0.85 ** month_offset  # Natural decay
            
            # Apply seasonal multiplier
            seasonal_cases = base_trend * seasonal_multipliers[future_month]
            
            # Apply water quality impact
            predicted_cases = seasonal_cases * water_risk_multiplier
            
            # Predict disease type for future month
            future_outbreak_data = {
                'No_of_Cases': int(predicted_cases),
                'Northeast_State': current_state,
                'Start_of_Outbreak_Month': future_month
            }
            
            disease_prediction = self._rule_based_disease_prediction(future_outbreak_data)
            
            # Calculate risk level
            if predicted_cases > 200:
                risk_level = "Critical"
            elif predicted_cases > 100:
                risk_level = "High"
            elif predicted_cases > 50:
                risk_level = "Medium"
            else:
                risk_level = "Low"
            
            future_predictions[f"Month_{month_offset}"] = {
                'month': future_month,
                'predicted_cases': int(predicted_cases),
                'seasonal_factor': seasonal_multipliers[future_month],
                'water_impact': water_risk_multiplier,
                'most_likely_disease': disease_prediction['most_likely_disease'],
                'risk_level': risk_level,
                'recommendations': self._get_future_recommendations(risk_level, future_month)
            }
        
        return future_predictions
    
    def _get_future_recommendations(self, risk_level: str, month: int) -> List[str]:
        """Generate recommendations for future months based on risk and season"""
        recommendations = []
        
        # Seasonal recommendations
        if month in [6, 7, 8, 9]:  # Monsoon months
            recommendations.extend([
                "🌧️ Prepare for monsoon-related disease surge",
                "🚰 Ensure water treatment capacity for increased demand",
                "🏥 Stock additional medical supplies for waterborne diseases"
            ])
        elif month in [4, 5]:  # Pre-monsoon
            recommendations.extend([
                "🔧 Conduct preventive maintenance on water systems",
                "📋 Train health workers for upcoming monsoon season",
                "🚨 Establish early warning systems"
            ])
        else:  # Other months
            recommendations.extend([
                "📊 Conduct routine surveillance",
                "🔍 Monitor water quality trends"
            ])
        
        # Risk-based recommendations
        if risk_level == "Critical":
            recommendations.extend([
                "🚨 Prepare emergency response protocols",
                "🏥 Ensure hospital capacity expansion",
                "📢 Launch preemptive public health campaigns"
            ])
        elif risk_level == "High":
            recommendations.extend([
                "⚠️ Increase surveillance frequency",
                "💊 Ensure adequate medicine stockpiles"
            ])
        
        return recommendations[:5]  # Limit to top 5 recommendations
    
    def predict_disease_from_outbreak(self, outbreak_data: Dict[str, any]) -> Dict[str, any]:
        """Predict disease using the ML model or rule-based approach"""
        actual_cases = outbreak_data.get('No_of_Cases', 0)
        
        if self.disease_predictor:
            # Convert cases to deaths for ML model (typical mortality rate 2-5%)
            # This allows us to use the trained model that expects deaths
            estimated_deaths = max(1, int(actual_cases * 0.03))  # 3% mortality rate
            
            # Create ML model input with deaths parameter
            ml_input = outbreak_data.copy()
            ml_input['No_of_Deaths'] = estimated_deaths
            
            try:
                # Use ML model prediction
                result = self.disease_predictor.predict_single(ml_input)
                disease_prediction = self.disease_predictor.predict_disease_type(ml_input)
                
                # Scale predicted cases from ML model to match our input scale
                ml_predicted_cases = result.get('predicted_cases', 0)
                scaled_predicted_cases = max(actual_cases, ml_predicted_cases * 20)  # Scale up from deaths model
                
                return {
                    'predicted_cases': scaled_predicted_cases,
                    'confidence': result.get('confidence', 'Medium'),
                    'most_likely_disease': disease_prediction.get('most_likely', 'Unknown'),
                    'disease_probability': disease_prediction.get('probability', 60),
                    'method': 'ML_Model_Scaled'
                }
            except Exception as e:
                print(f"⚠️ ML prediction failed: {e}")
        
        # Fallback to rule-based prediction
        return self._rule_based_disease_prediction(outbreak_data)
        """Predict disease using the ML model or rule-based approach"""
        actual_cases = outbreak_data.get('No_of_Cases', 0)
        
        if self.disease_predictor:
            # Convert cases to deaths for ML model (typical mortality rate 2-5%)
            # This allows us to use the trained model that expects deaths
            estimated_deaths = max(1, int(actual_cases * 0.03))  # 3% mortality rate
            
            # Create ML model input with deaths parameter
            ml_input = outbreak_data.copy()
            ml_input['No_of_Deaths'] = estimated_deaths
            
            try:
                # Use ML model prediction
                result = self.disease_predictor.predict_single(ml_input)
                disease_prediction = self.disease_predictor.predict_disease_type(ml_input)
                
                # Scale predicted cases from ML model to match our input scale
                ml_predicted_cases = result.get('predicted_cases', 0)
                scaled_predicted_cases = max(actual_cases, ml_predicted_cases * 20)  # Scale up from deaths model
                
                return {
                    'predicted_cases': scaled_predicted_cases,
                    'confidence': result.get('confidence', 'Medium'),
                    'most_likely_disease': disease_prediction.get('most_likely', 'Unknown'),
                    'disease_probability': disease_prediction.get('probability', 60),
                    'method': 'ML_Model_Scaled'
                }
            except Exception as e:
                print(f"⚠️ ML prediction failed: {e}")
        
        # Fallback to rule-based prediction
        return self._rule_based_disease_prediction(outbreak_data)
    
    def _rule_based_disease_prediction(self, outbreak_data: Dict[str, any]) -> Dict[str, any]:
        """Rule-based disease prediction as fallback"""
        cases = outbreak_data.get('No_of_Cases', 0)
        month = outbreak_data.get('Start_of_Outbreak_Month', 7)
        state = outbreak_data.get('Northeast_State', 1)
        
        # Enhanced rule-based logic based on case severity and patterns
        if month in [6, 7, 8, 9]:  # Monsoon months - higher risk
            if cases > 200:
                disease = "Cholera"
                probability = 85
                confidence = "High"
            elif cases > 100:
                disease = "Acute Diarrheal Disease" 
                probability = 75
                confidence = "Medium"
            elif cases > 50:
                disease = "Typhoid"
                probability = 65
                confidence = "Medium"
            else:
                disease = "Gastroenteritis"
                probability = 55
                confidence = "Low"
        elif month in [4, 5, 10, 11]:  # Pre/Post monsoon
            if cases > 150:
                disease = "Typhoid"
                probability = 80
                confidence = "High"
            elif cases > 75:
                disease = "Hepatitis A"
                probability = 70
                confidence = "Medium"
            else:
                disease = "Food Poisoning"
                probability = 60
                confidence = "Medium"
        else:  # Winter months
            if cases > 100:
                disease = "Viral Gastroenteritis"
                probability = 75
                confidence = "Medium"
            else:
                disease = "Food Poisoning"
                probability = 65
                confidence = "Medium"
        
        # Adjust predictions based on case severity
        estimated_cases = cases  # Use actual reported cases
        
        return {
            'predicted_cases': estimated_cases,
            'confidence': confidence,
            'most_likely_disease': disease,
            'disease_probability': probability,
            'method': 'Rule_Based'
        }
    
    def correlate_disease_water_quality(self, disease_prediction: Dict[str, any], 
                                      water_assessment: Dict[str, any],
                                      water_params: Dict[str, float]) -> Dict[str, any]:
        """Correlate disease prediction with water quality assessment"""
        
        disease = disease_prediction['most_likely_disease']
        wqi = water_assessment['wqi']
        quality_risk = water_assessment['quality_risk']
        critical_violations = water_assessment['critical_violations']
        
        # Get disease-specific water quality correlations
        disease_profile = self.disease_water_correlations.get(disease, {})
        critical_params = disease_profile.get('critical_parameters', [])
        
        # Calculate correlation strength
        correlation_score = 0
        correlation_factors = []
        
        # Check if water quality supports disease risk
        if quality_risk in ['High', 'Very High']:
            correlation_score += 30
            correlation_factors.append(f"Poor water quality (WQI: {wqi:.1f})")
        
        # Check critical parameters for this disease
        for param in critical_params:
            if param in water_params:
                value = water_params[param]
                standard = self.water_standards.get(param, {})
                
                if param == 'fecal_coliform' and value > 50:
                    correlation_score += 25
                    correlation_factors.append("High fecal contamination")
                elif param == 'total_coliform' and value > 500:
                    correlation_score += 20
                    correlation_factors.append("High bacterial contamination")
                elif param == 'nitrate_n' and value > 10:
                    correlation_score += 15
                    correlation_factors.append("Elevated nitrate levels")
                elif param == 'bod' and value > 5:
                    correlation_score += 15
                    correlation_factors.append("High organic pollution")
        
        # Check for critical violations
        for violation in critical_violations:
            if 'fecal' in violation:
                correlation_score += 20
                correlation_factors.append("Critical bacterial contamination")
            elif 'oxygen' in violation:
                correlation_score += 15
                correlation_factors.append("Oxygen depletion stress")
            elif 'ph' in violation:
                correlation_score += 10
                correlation_factors.append("Extreme pH conditions")
        
        # Determine correlation strength
        if correlation_score >= 60:
            correlation_strength = "Very Strong"
            risk_level = "Critical"
        elif correlation_score >= 40:
            correlation_strength = "Strong"
            risk_level = "High"
        elif correlation_score >= 20:
            correlation_strength = "Moderate"
            risk_level = "Medium"
        else:
            correlation_strength = "Weak"
            risk_level = "Low"
        
        return {
            'correlation_score': min(correlation_score, 100),
            'correlation_strength': correlation_strength,
            'combined_risk_level': risk_level,
            'correlation_factors': correlation_factors,
            'disease_water_match': disease in [d for d in self.disease_water_correlations.keys()],
            'critical_intervention_needed': correlation_score >= 60
        }
    
    def generate_integrated_recommendations(self, disease_prediction: Dict[str, any],
                                          water_assessment: Dict[str, any],
                                          correlation_analysis: Dict[str, any],
                                          water_params: Dict[str, float]) -> List[str]:
        """Generate comprehensive recommendations based on integrated analysis"""
        recommendations = []
        
        disease = disease_prediction['most_likely_disease']
        predicted_cases = disease_prediction['predicted_cases']
        correlation_strength = correlation_analysis['correlation_strength']
        risk_level = correlation_analysis['combined_risk_level']
        
        # Critical interventions
        if correlation_analysis['critical_intervention_needed']:
            recommendations.append("🚨 URGENT: Implement immediate water treatment and health interventions")
            recommendations.append("📞 Alert district health authorities and water board immediately")
            recommendations.append("🔒 Consider temporary water source restrictions until treatment")
        
        # Disease-specific recommendations
        if disease == "Cholera":
            recommendations.append("💧 Immediate chlorination of water sources")
            recommendations.append("🏥 Prepare ORS and IV fluid supplies")
            recommendations.append("🔬 Test all water sources for Vibrio cholerae")
        elif disease == "Typhoid":
            recommendations.append("💉 Consider mass vaccination in high-risk areas")
            recommendations.append("🧪 Test water for Salmonella typhi contamination")
            recommendations.append("🏥 Prepare antibiotic treatment protocols")
        elif disease in ["Acute Diarrheal Disease", "Dysentery"]:
            recommendations.append("🚿 Improve sanitation and hygiene facilities")
            recommendations.append("💊 Ensure zinc and ORS availability")
            recommendations.append("📚 Community education on handwashing")
        
        # Water quality specific recommendations
        wqi = water_assessment['wqi']
        if wqi > 75:
            recommendations.append("⚗️ Implement comprehensive water treatment system")
            recommendations.append("🔍 Conduct detailed water source investigation")
        elif wqi > 50:
            recommendations.append("🛠️ Upgrade existing water treatment facilities")
            recommendations.append("📊 Increase water quality monitoring frequency")
        
        # Parameter-specific fixes
        for factor in water_assessment['risk_factors']:
            if 'pH' in factor:
                recommendations.append("🔧 Install pH correction system (lime/acid dosing)")
            elif 'oxygen' in factor:
                recommendations.append("💨 Install aeration system to increase dissolved oxygen")
            elif 'coliform' in factor:
                recommendations.append("🦠 Implement UV disinfection or chlorination")
            elif 'nitrate' in factor:
                recommendations.append("🌱 Control agricultural runoff and fertilizer use")
            elif 'BOD' in factor:
                recommendations.append("🏭 Treat organic waste before discharge")
        
        # Prevention strategies
        recommendations.append("📈 Establish integrated disease-water quality surveillance")
        recommendations.append("👥 Train community health workers on water-disease connections")
        recommendations.append("📱 Set up early warning system for water quality alerts")
        
        # Monitoring recommendations
        if correlation_strength in ["Strong", "Very Strong"]:
            recommendations.append("⏰ Daily water quality monitoring during outbreak")
            recommendations.append("📊 Weekly disease surveillance reports")
        else:
            recommendations.append("📅 Weekly water quality monitoring")
            recommendations.append("📈 Monthly disease trend analysis")
        
        return recommendations
    
    def analyze_integrated_scenario(self, outbreak_data: Dict[str, any], 
                                  water_params: Dict[str, float], 
                                  include_future: bool = True) -> Dict[str, any]:
        """Perform complete integrated analysis including future predictions"""
        
        print("🔄 Performing integrated disease-water quality analysis...")
        
        # Step 1: Disease prediction
        disease_prediction = self.predict_disease_from_outbreak(outbreak_data)
        
        # Step 2: Water quality assessment
        water_assessment = self.assess_water_quality_risk(water_params)
        
        # Step 3: Correlation analysis
        correlation_analysis = self.correlate_disease_water_quality(
            disease_prediction, water_assessment, water_params
        )
        
        # Step 4: Future outbreak prediction
        future_predictions = None
        if include_future:
            future_predictions = self.predict_future_outbreak_trend(
                outbreak_data, water_params, months_ahead=3
            )
        
        # Step 5: Generate recommendations (including future-based)
        recommendations = self.generate_integrated_recommendations(
            disease_prediction, water_assessment, correlation_analysis, water_params
        )
        
        # Step 5: Risk scoring with improved algorithm
        cases = disease_prediction['predicted_cases']
        
        # Logarithmic scaling for disease risk (handles large case numbers better)
        if cases <= 10:
            disease_risk_score = cases * 2  # 0-20 for small outbreaks
        elif cases <= 50:
            disease_risk_score = 20 + (cases - 10) * 1.5  # 20-80 for moderate outbreaks
        elif cases <= 200:
            disease_risk_score = 80 + (cases - 50) * 0.13  # 80-100 for large outbreaks
        else:
            disease_risk_score = 100  # Maximum for very large outbreaks
        
        # Disease severity factor based on type
        disease_type = disease_prediction['most_likely_disease']
        severity_multiplier = 1.0
        if disease_type in ['Cholera', 'Typhoid']:
            severity_multiplier = 1.3
        elif disease_type in ['Hepatitis A', 'Dysentery']:
            severity_multiplier = 1.2
        elif disease_type in ['Acute Diarrheal Disease']:
            severity_multiplier = 1.1
        
        disease_risk_score = min(disease_risk_score * severity_multiplier, 100)
        
        water_risk_score = water_assessment['wqi']
        correlation_score = correlation_analysis['correlation_score']
        
        # Combined risk assessment
        combined_risk_score = (disease_risk_score * 0.4 + water_risk_score * 0.3 + 
                             correlation_score * 0.3)
        
        if combined_risk_score >= 80:
            alert_level = "🔴 CRITICAL ALERT"
        elif combined_risk_score >= 60:
            alert_level = "🟠 HIGH ALERT"
        elif combined_risk_score >= 40:
            alert_level = "🟡 MEDIUM ALERT"
        else:
            alert_level = "🟢 LOW ALERT"
        
        return {
            'disease_prediction': disease_prediction,
            'water_assessment': water_assessment,
            'correlation_analysis': correlation_analysis,
            'future_predictions': future_predictions,
            'recommendations': recommendations,
            'risk_scores': {
                'disease_risk': disease_risk_score,
                'water_risk': water_risk_score,
                'correlation_risk': correlation_score,
                'combined_risk': combined_risk_score
            },
            'alert_level': alert_level,
            'analysis_timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    
    def display_integrated_results(self, analysis: Dict[str, any], 
                                 outbreak_data: Dict[str, any], 
                                 water_params: Dict[str, float]):
        """Display comprehensive analysis results"""
        
        print("\n" + "="*80)
        print("🏥💧 INTEGRATED DISEASE-WATER QUALITY ANALYSIS REPORT")
        print("="*80)
        
        # Alert level
        print(f"\n{analysis['alert_level']}")
        print(f"📅 Analysis Date: {analysis['analysis_timestamp']}")
        
        # Input summary
        print(f"\n📊 INPUT DATA SUMMARY:")
        print("-" * 30)
        print(f"  Disease Outbreak: {outbreak_data.get('No_of_Cases', 0)} cases, "
              f"State {outbreak_data.get('Northeast_State', 1)}, "
              f"Month {outbreak_data.get('Start_of_Outbreak_Month', 7)}")
        
        print(f"  Water Quality: WQI {analysis['water_assessment']['wqi']:.1f} "
              f"({analysis['water_assessment']['quality_category']})")
        
        # Disease prediction results
        disease_pred = analysis['disease_prediction']
        print(f"\n🦠 DISEASE PREDICTION:")
        print("-" * 25)
        print(f"  Most Likely Disease: {disease_pred['most_likely_disease']}")
        print(f"  Predicted Cases: {disease_pred['predicted_cases']:.1f}")
        print(f"  Confidence: {disease_pred['confidence']}")
        print(f"  Prediction Method: {disease_pred['method']}")
        
        # Water quality assessment
        water_assess = analysis['water_assessment']
        print(f"\n💧 WATER QUALITY ASSESSMENT:")
        print("-" * 35)
        print(f"  WQI Score: {water_assess['wqi']:.2f}")
        print(f"  Quality Category: {water_assess['quality_category']}")
        print(f"  Risk Level: {water_assess['quality_risk']}")
        
        if water_assess['risk_factors']:
            print(f"  Risk Factors:")
            for factor in water_assess['risk_factors']:
                print(f"    • {factor}")
        
        # Correlation analysis
        correlation = analysis['correlation_analysis']
        print(f"\n🔗 DISEASE-WATER CORRELATION:")
        print("-" * 35)
        print(f"  Correlation Strength: {correlation['correlation_strength']}")
        print(f"  Correlation Score: {correlation['correlation_score']:.1f}/100")
        print(f"  Combined Risk Level: {correlation['combined_risk_level']}")
        
        if correlation['correlation_factors']:
            print(f"  Contributing Factors:")
            for factor in correlation['correlation_factors']:
                print(f"    • {factor}")
        
        # Risk scoring
        risk_scores = analysis['risk_scores']
        print(f"\n📈 RISK ASSESSMENT BREAKDOWN:")
        print("-" * 35)
        print(f"  Disease Risk Score: {risk_scores['disease_risk']:.1f}/100")
        print(f"  Water Quality Risk: {risk_scores['water_risk']:.1f}/100")
        print(f"  Correlation Risk: {risk_scores['correlation_risk']:.1f}/100")
        print(f"  📊 COMBINED RISK: {risk_scores['combined_risk']:.1f}/100")
        
        # Recommendations
        print(f"\n💡 INTEGRATED RECOMMENDATIONS:")
        print("-" * 40)
        for i, rec in enumerate(analysis['recommendations'], 1):
            print(f"  {i:2d}. {rec}")
        
        # Future predictions (if available)
        if analysis.get('future_predictions'):
            print(f"\n🔮 FUTURE OUTBREAK PREDICTIONS:")
            print("-" * 40)
            future_preds = analysis['future_predictions']
            
            for month_key, prediction in future_preds.items():
                month_num = prediction['month']
                month_names = {1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
                              7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'}
                
                risk_emoji = {"Low": "🟢", "Medium": "🟡", "High": "🟠", "Critical": "🔴"}
                
                print(f"  📅 {month_names[month_num]}: {prediction['predicted_cases']} cases "
                      f"({prediction['most_likely_disease']}) "
                      f"{risk_emoji.get(prediction['risk_level'], '⚪')} {prediction['risk_level']}")
                
                # Show top future recommendations
                if prediction['recommendations']:
                    print(f"      Key prep: {prediction['recommendations'][0]}")
        
        # Priority actions
        if correlation['critical_intervention_needed']:
            print(f"\n🚨 IMMEDIATE PRIORITY ACTIONS:")
            print("-" * 35)
            print("  1. 📞 Contact emergency health services")
            print("  2. 🚫 Restrict use of contaminated water sources")
            print("  3. 🏥 Prepare medical facilities for outbreak response")
            print("  4. 📢 Issue public health advisory")
            print("  5. 🔬 Conduct emergency water and health surveillance")
        
        print("\n" + "="*80)
        print("📋 Report generated by Integrated Health Analysis System")
        print("="*80)


def get_user_input_interactive():
    """Get user input for interactive mode"""
    print("🏥💧 INTEGRATED DISEASE-WATER QUALITY ANALYSIS")
    print("=" * 50)
    
    # Outbreak data
    print("\n📊 OUTBREAK INFORMATION:")
    while True:
        try:
            cases = int(input("  Number of cases: "))
            if cases >= 0:
                break
            print("  Please enter a non-negative number")
        except ValueError:
            print("  Please enter a valid number")
    
    state = int(input("  Northeast State (1-5) [1]: ") or "1")
    month = int(input("  Outbreak month (1-12) [7]: ") or "7")
    
    outbreak_data = {
        'No_of_Cases': cases,
        'Northeast_State': state,
        'Start_of_Outbreak_Month': month
    }
    
    # Water quality data
    print("\n💧 WATER QUALITY PARAMETERS:")
    print("  (Press Enter for default values)")
    
    ph = float(input("  pH Level [7.0]: ") or "7.0")
    do = float(input("  Dissolved Oxygen (mg/L) [5.0]: ") or "5.0")
    bod = float(input("  BOD (mg/L) [3.0]: ") or "3.0")
    nitrate = float(input("  Nitrate-N (mg/L) [5.0]: ") or "5.0")
    fc = float(input("  Fecal Coliform (CFU/100mL) [20]: ") or "20")
    tc = float(input("  Total Coliform (CFU/100mL) [100]: ") or "100")
    temp = float(input("  Temperature (°C) [25]: ") or "25")
    
    water_params = {
        'ph': ph,
        'dissolved_oxygen': do,
        'bod': bod,
        'nitrate_n': nitrate,
        'fecal_coliform': fc,
        'total_coliform': tc,
        'temperature': temp
    }
    
    return outbreak_data, water_params


def create_parser():
    """Create command line argument parser"""
    parser = argparse.ArgumentParser(
        description="Integrated Disease-Water Quality Correlation Analysis",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Interactive mode
  python disease_water_correlation.py
  
  # Quick analysis
  python disease_water_correlation.py --mode quick --deaths 5 --ph 8.5 --do 3.0 --fc 150
  
  # Batch processing
  python disease_water_correlation.py --mode batch --input data.csv
        """
    )
    
    parser.add_argument('--mode', choices=['interactive', 'quick', 'batch'], 
                       default='interactive',
                       help='Analysis mode (default: interactive)')
    
    # Quick mode parameters
    parser.add_argument('--cases', type=int, help='Number of cases')
    parser.add_argument('--state', type=int, default=1, help='Northeast state (1-5)')
    parser.add_argument('--month', type=int, default=7, help='Outbreak month (1-12)')
    
    # Water quality parameters
    parser.add_argument('--ph', type=float, default=7.0, help='pH level')
    parser.add_argument('--do', type=float, default=5.0, help='Dissolved oxygen (mg/L)')
    parser.add_argument('--bod', type=float, default=3.0, help='BOD (mg/L)')
    parser.add_argument('--nitrate', type=float, default=5.0, help='Nitrate-N (mg/L)')
    parser.add_argument('--fc', type=float, default=20.0, help='Fecal coliform (CFU/100mL)')
    parser.add_argument('--tc', type=float, default=100.0, help='Total coliform (CFU/100mL)')
    parser.add_argument('--temp', type=float, default=25.0, help='Temperature (°C)')
    
    # Batch mode
    parser.add_argument('--input', help='Input CSV file for batch processing')
    parser.add_argument('--output', help='Output file for results')
    
    return parser


def main():
    """Main function"""
    parser = create_parser()
    args = parser.parse_args()
    
    # Initialize analyzer
    analyzer = IntegratedHealthAnalyzer()
    
    if args.mode == 'interactive':
        # Interactive mode
        outbreak_data, water_params = get_user_input_interactive()
        
        # Perform analysis
        analysis = analyzer.analyze_integrated_scenario(outbreak_data, water_params)
        
        # Display results
        analyzer.display_integrated_results(analysis, outbreak_data, water_params)
        
    elif args.mode == 'quick':
        # Quick analysis mode
        if args.cases is None:
            print("❌ Error: --cases is required for quick mode")
            return
        
        outbreak_data = {
            'No_of_Cases': args.cases,
            'Northeast_State': args.state,
            'Start_of_Outbreak_Month': args.month
        }
        
        water_params = {
            'ph': args.ph,
            'dissolved_oxygen': args.do,
            'bod': args.bod,
            'nitrate_n': args.nitrate,
            'fecal_coliform': args.fc,
            'total_coliform': args.tc,
            'temperature': args.temp
        }
        
        # Perform analysis
        analysis = analyzer.analyze_integrated_scenario(outbreak_data, water_params)
        
        # Display results
        analyzer.display_integrated_results(analysis, outbreak_data, water_params)
        
    elif args.mode == 'batch':
        # Batch processing mode
        if not args.input:
            print("❌ Error: --input CSV file is required for batch mode")
            return
        
        print(f"🔄 Processing batch file: {args.input}")
        # TODO: Implement batch processing
        print("⚠️ Batch processing not yet implemented")
    
    print("\n✅ Analysis completed successfully!")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Analysis interrupted. Goodbye!")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

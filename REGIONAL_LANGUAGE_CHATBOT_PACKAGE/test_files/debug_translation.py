#!/usr/bin/env python3
"""
Debug Regional Language Translation
==================================

Debug the translation process to see what's happening with "Mujhe pet Dard Hai"
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from disease_prediction_service import DiseasePredictor

def debug_translation():
    """Debug the translation process step by step"""
    
    print("🔍 DEBUGGING REGIONAL LANGUAGE TRANSLATION")
    print("=" * 50)
    
    # Initialize predictor
    predictor = DiseasePredictor()
    
    # Test input
    test_input = "Mujhe pet Dard Hai"
    print(f"Original input: '{test_input}'")
    
    # Step 1: Translation
    translated = predictor._translate_regional_terms(test_input)
    print(f"Translated: '{translated}'")
    
    # Step 2: Disease prediction
    prediction = predictor.predict_disease_type(test_input)
    print(f"\nDisease prediction result:")
    for key, value in prediction.items():
        print(f"  {key}: {value}")
    
    # Step 3: Severity assessment
    severity = predictor.get_severity_assessment(prediction, test_input)
    print(f"\nSeverity assessment: {severity}")
    
    # Step 4: Recommendations
    recommendations = predictor.get_health_recommendations(prediction, test_input)
    print(f"\nRecommendations ({len(recommendations)}):")
    for i, rec in enumerate(recommendations, 1):
        print(f"  {i}. {rec}")
    
    # Test with regional data
    print(f"\n🔍 CHECKING REGIONAL DATA:")
    regional_data = predictor.regional_data
    synonyms = regional_data.get('synonyms', {})
    print(f"Available synonyms: {len(synonyms)}")
    
    # Check specific mappings
    relevant_terms = ['pet dard', 'pet mein dard', 'mujhe', 'dard', 'hai']
    print(f"\nRelevant term mappings:")
    for term in relevant_terms:
        if term in synonyms:
            print(f"  '{term}' → '{synonyms[term]}'")
        else:
            print(f"  '{term}' → NOT FOUND")

if __name__ == "__main__":
    debug_translation()

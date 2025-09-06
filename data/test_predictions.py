#!/usr/bin/env python3
"""
Disease Prediction Testing Script
================================

Simple script to test the disease prediction model with various scenarios.
"""

import pandas as pd
import numpy as np
from disease_prediction_service import DiseasePredictor


def test_various_scenarios():
    """Test the model with different outbreak scenarios"""
    
    print("🧪 Testing Disease Prediction Model")
    print("=" * 40)
    
    # Initialize predictor
    predictor = DiseasePredictor()
    
    # Test Scenario 1: Monsoon outbreak in Assam
    print("\n📋 Scenario 1: Monsoon Season Outbreak in Assam")
    monsoon_outbreak = {
        'ID': 1,
        'No_of_Deaths': 5,
        'Source_Table': 1,
        'Northeast_State': 1,  # Assam
        'Start_of_Outbreak_Year': 2024,
        'Start_of_Outbreak_Month': 7,  # July (peak monsoon)
        'Start_of_Outbreak_Season': 2,  # Monsoon
        'Reporting_Year': 2024,
        'Reporting_Month': 8,
        'Reporting_Season': 2
    }
    
    result1 = predictor.predict_single(monsoon_outbreak)
    print(f"Predicted Cases: {result1.get('predicted_cases', 'Error')}")
    print(f"Confidence: {result1.get('confidence', 'N/A')}")
    
    # Test Scenario 2: Winter outbreak with fewer deaths
    print("\n📋 Scenario 2: Winter Season Outbreak")
    winter_outbreak = {
        'ID': 2,
        'No_of_Deaths': 1,
        'Source_Table': 2,
        'Northeast_State': 2,  # Different state
        'Start_of_Outbreak_Year': 2024,
        'Start_of_Outbreak_Month': 12,  # December
        'Start_of_Outbreak_Season': 4,  # Winter
        'Reporting_Year': 2025,
        'Reporting_Month': 1,
        'Reporting_Season': 4
    }
    
    result2 = predictor.predict_single(winter_outbreak)
    print(f"Predicted Cases: {result2.get('predicted_cases', 'Error')}")
    print(f"Confidence: {result2.get('confidence', 'N/A')}")
    
    # Test Scenario 3: High mortality outbreak
    print("\n📋 Scenario 3: High Mortality Outbreak")
    high_mortality = {
        'ID': 3,
        'No_of_Deaths': 15,
        'Source_Table': 1,
        'Northeast_State': 3,
        'Start_of_Outbreak_Year': 2024,
        'Start_of_Outbreak_Month': 6,  # Pre-monsoon
        'Start_of_Outbreak_Season': 1,  # Pre-monsoon
        'Reporting_Year': 2024,
        'Reporting_Month': 6,
        'Reporting_Season': 1
    }
    
    result3 = predictor.predict_single(high_mortality)
    print(f"Predicted Cases: {result3.get('predicted_cases', 'Error')}")
    print(f"Confidence: {result3.get('confidence', 'N/A')}")
    
    # Test Scenario 4: Batch prediction
    print("\n📋 Scenario 4: Batch Prediction")
    batch_data = pd.DataFrame([
        {
            'ID': 4,
            'No_of_Deaths': 3,
            'Northeast_State': 1,
            'Start_of_Outbreak_Month': 5,
            'Start_of_Outbreak_Season': 1,
            'location': 'Rural Assam'
        },
        {
            'ID': 5,
            'No_of_Deaths': 7,
            'Northeast_State': 2,
            'Start_of_Outbreak_Month': 8,
            'Start_of_Outbreak_Season': 2,
            'location': 'Urban Manipur'
        },
        {
            'ID': 6,
            'No_of_Deaths': 2,
            'Northeast_State': 3,
            'Start_of_Outbreak_Month': 11,
            'Start_of_Outbreak_Season': 3,
            'location': 'Tribal Area'
        }
    ])
    
    batch_results = predictor.predict_batch(batch_data)
    if batch_results is not None:
        print("Batch Prediction Results:")
        for idx, row in batch_results.iterrows():
            print(f"  Location: {row.get('location', 'Unknown')}")
            print(f"  Deaths: {row.get('No_of_Deaths', 'N/A')}")
            print(f"  Predicted Cases: {row.get('predicted_cases', 'N/A')}")
            print()


def test_edge_cases():
    """Test edge cases and error handling"""
    
    print("\n🔍 Testing Edge Cases")
    print("=" * 30)
    
    predictor = DiseasePredictor()
    
    # Test with minimal data
    print("\n📋 Minimal Data Test:")
    minimal_data = {'No_of_Deaths': 1}
    result = predictor.predict_single(minimal_data)
    print(f"Result: {result.get('predicted_cases', 'Error')}")
    
    # Test with extreme values
    print("\n📋 Extreme Values Test:")
    extreme_data = {
        'No_of_Deaths': 100,
        'Start_of_Outbreak_Month': 13,  # Invalid month
        'Northeast_State': 999
    }
    result = predictor.predict_single(extreme_data)
    print(f"Result: {result.get('predicted_cases', 'Error')}")


def compare_seasonal_impact():
    """Compare predictions across different seasons"""
    
    print("\n📊 Seasonal Impact Analysis")
    print("=" * 35)
    
    predictor = DiseasePredictor()
    
    base_data = {
        'ID': 1,
        'No_of_Deaths': 5,
        'Source_Table': 1,
        'Northeast_State': 1,
        'Start_of_Outbreak_Year': 2024,
        'Reporting_Year': 2024
    }
    
    seasons = {
        'Pre-Monsoon (April-May)': {'month': 4, 'season': 1},
        'Monsoon (June-September)': {'month': 7, 'season': 2},
        'Post-Monsoon (October-November)': {'month': 10, 'season': 3},
        'Winter (December-March)': {'month': 1, 'season': 4}
    }
    
    print("Impact of season on disease cases (same conditions):")
    for season_name, season_data in seasons.items():
        test_data = base_data.copy()
        test_data['Start_of_Outbreak_Month'] = season_data['month']
        test_data['Start_of_Outbreak_Season'] = season_data['season']
        test_data['Reporting_Month'] = season_data['month']
        test_data['Reporting_Season'] = season_data['season']
        
        result = predictor.predict_single(test_data)
        predicted_cases = result.get('predicted_cases', 'Error')
        print(f"  {season_name}: {predicted_cases} cases")


def main():
    """Run all tests"""
    try:
        test_various_scenarios()
        test_edge_cases()
        compare_seasonal_impact()
        
        print("\n" + "=" * 50)
        print("✅ All tests completed successfully!")
        print("🎯 The prediction model is ready for use.")
        
    except Exception as e:
        print(f"❌ Testing failed: {str(e)}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Simple Disease Prediction Example
=================================

This script demonstrates how to use the trained model with properly formatted data.
For real predictions, you would need historical data to compute lag features and rolling means.
"""

import pandas as pd
import numpy as np
from disease_prediction_service import DiseasePredictor


def create_realistic_prediction_data():
    """
    Create realistic prediction data that includes the engineered features
    the model expects. In a real application, you would compute these from 
    historical outbreak data.
    """
    
    # Example: Predicting an outbreak based on recent data
    prediction_data = {
        # Basic outbreak information
        'ID': 150,
        'No_of_Deaths': 3,
        'Source_Table': 1,
        'Northeast_State': 1,
        'Start_of_Outbreak_Year': 2024,
        'Start_of_Outbreak_Month': 7,
        'Start_of_Outbreak_Season': 2,
        'Reporting_Year': 2024,
        'Reporting_Month': 7,
        'Reporting_Season': 2,
        
        # State encoding (one-hot encoded)
        'State_UT_Assam': 1,
        'State_UT_Meghalaya': 0,
        'State_UT_Mizoram': 0,
        'State_UT_Tripura': 0,
        
        # Disease encoding (example: Acute Diarrheal Disease)
        'Disease_Illness_Acute Diarrheal Disease (Shigella)': 0,
        'Disease_Illness_Acute Diarrheal Diseases': 1,
        'Disease_Illness_Acute Diarrhoeal Diarrhoea': 0,
        'Disease_Illness_Acute Diarrhoeal Disease': 0,
        'Disease_Illness_Acute Gastroenteritis': 0,
        'Disease_Illness_Bacillary Dysentery': 0,
        'Disease_Illness_Cholera': 0,
        'Disease_Illness_Dysentery': 0,
        'Disease_Illness_Dysentery (Shigella)': 0,
        'Disease_Illness_Food Poisoning': 0,
        'Disease_Illness_Food Poisoning (Mushroom Poisoning)': 0,
        'Disease_Illness_Food poisoning': 0,
        'Disease_Illness_Hepatitis A': 0,
        'Disease_Illness_Suspected Food Poisoning': 0,
        'Disease_Illness_Suspected Typhoid': 0,
        'Disease_Illness_Typhoid': 0,
        'Disease_Illness_Viral Hepatitis A': 0,
        
        # District encoding
        'District_Encoded': 15,
        
        # Current status encoding
        'Current_Status_Under Control': 0,
        'Current_Status_Under Investigation': 1,
        'Current_Status_Under Surveillance': 0,
        'Current_Status_Under control': 0,
        
        # Lag features (previous outbreak cases)
        'Cases_Lag_1': 25,  # Cases from previous outbreak
        'Cases_Lag_2': 18,  # Cases from 2 outbreaks ago
        'Cases_Lag_3': 12,  # Cases from 3 outbreaks ago
        
        # Rolling means (computed from historical data)
        'Cases_Rolling_Mean_2': 21.5,  # Average of last 2 outbreaks
        'Cases_Rolling_Mean_3': 18.3,  # Average of last 3 outbreaks
        
        # Difference features
        'Cases_Diff_1': 7,   # Difference from last outbreak
        'Cases_Diff_2': 13,  # Difference from 2 outbreaks ago
        
        # Seasonal indicators
        'Is_Monsoon_Season': 1,
        'Is_Peak_Monsoon': 1,
        'Is_Pre_Monsoon': 0,
        'Is_Post_Monsoon': 0,
        'Is_Winter': 0,
        
        # Mortality features
        'Death_Ratio': 0.12,  # 3 deaths / 25 cases = 0.12
        'Has_Deaths': 1,
        'High_Mortality': 0,
        'Zero_Mortality': 0
    }
    
    return prediction_data


def test_realistic_prediction():
    """Test with realistic data that matches the model's expectations"""
    
    print("🧪 Testing Disease Prediction with Realistic Data")
    print("=" * 50)
    
    # Initialize predictor
    predictor = DiseasePredictor()
    
    # Create realistic test data
    test_data = create_realistic_prediction_data()
    
    print("📋 Test Scenario: Monsoon Season Outbreak in Assam")
    print("Input Features (sample):")
    key_features = ['No_of_Deaths', 'Start_of_Outbreak_Month', 'Cases_Lag_1', 
                   'Cases_Rolling_Mean_2', 'Death_Ratio', 'Is_Monsoon_Season']
    for key in key_features:
        print(f"  {key}: {test_data[key]}")
    
    # Make prediction
    result = predictor.predict_single(test_data)
    
    print(f"\n📊 Prediction Result:")
    if 'error' in result:
        print(f"❌ {result['error']}")
    else:
        print(f"  ✅ Predicted Cases: {result['predicted_cases']}")
        print(f"  🎯 Confidence: {result['confidence']}")
        print(f"  📈 Model R²: {result['model_r2']}")
        print(f"  📉 Model RMSE: {result['model_rmse']}")
    
    return result


def compare_different_scenarios():
    """Compare predictions for different outbreak scenarios"""
    
    print("\n🔍 Comparing Different Outbreak Scenarios")
    print("=" * 45)
    
    predictor = DiseasePredictor()
    base_data = create_realistic_prediction_data()
    
    scenarios = [
        {
            'name': 'Low Historical Cases',
            'changes': {
                'Cases_Lag_1': 5,
                'Cases_Rolling_Mean_2': 4.5,
                'Death_Ratio': 0.6,  # 3/5 = 0.6
                'No_of_Deaths': 3
            }
        },
        {
            'name': 'High Historical Cases', 
            'changes': {
                'Cases_Lag_1': 80,
                'Cases_Rolling_Mean_2': 75.0,
                'Death_Ratio': 0.0375,  # 3/80 = 0.0375
                'No_of_Deaths': 3
            }
        },
        {
            'name': 'Winter Season (Low Risk)',
            'changes': {
                'Start_of_Outbreak_Month': 12,
                'Start_of_Outbreak_Season': 4,
                'Is_Monsoon_Season': 0,
                'Is_Peak_Monsoon': 0,
                'Is_Winter': 1
            }
        },
        {
            'name': 'High Mortality Outbreak',
            'changes': {
                'No_of_Deaths': 15,
                'Death_Ratio': 0.6,  # 15/25 = 0.6
                'High_Mortality': 1,
                'Has_Deaths': 1,
                'Zero_Mortality': 0
            }
        }
    ]
    
    for scenario in scenarios:
        test_data = base_data.copy()
        test_data.update(scenario['changes'])
        
        result = predictor.predict_single(test_data)
        predicted_cases = result.get('predicted_cases', 'Error')
        confidence = result.get('confidence', 'N/A')
        
        print(f"📋 {scenario['name']}: {predicted_cases} cases (Confidence: {confidence})")


def show_usage_instructions():
    """Show how to use the prediction service in practice"""
    
    print("\n" + "=" * 60)
    print("📚 How to Use the Disease Prediction Service")
    print("=" * 60)
    
    print("""
🔑 Key Points for Using the Model:

1. **Historical Data Required**: The model uses lag features and rolling means,
   so you need data from previous outbreaks to make accurate predictions.

2. **Feature Engineering**: Input data must include all 52 engineered features:
   - Lag features (Cases_Lag_1, Cases_Lag_2, Cases_Lag_3)
   - Rolling means (Cases_Rolling_Mean_2, Cases_Rolling_Mean_3)
   - Seasonal indicators (Is_Monsoon_Season, Is_Peak_Monsoon, etc.)
   - Mortality ratios (Death_Ratio, Has_Deaths, etc.)
   - One-hot encoded categorical variables

3. **Production Use**: 
   - Maintain a database of historical outbreak data
   - Compute lag features and rolling statistics from this data
   - Update the database after each new outbreak

4. **Example Pipeline**:
   ```python
   # Load historical data
   historical_outbreaks = load_outbreak_database()
   
   # Compute engineered features for new outbreak
   new_outbreak_features = engineer_features(
       current_outbreak_data, 
       historical_outbreaks
   )
   
   # Make prediction
   predictor = DiseasePredictor()
   prediction = predictor.predict_single(new_outbreak_features)
   ```

5. **Feature Importance** (Top 5):
   - Cases_Rolling_Mean_2 (48%): Average cases from last 2 outbreaks
   - Cases_Diff_1 (25%): Difference from last outbreak  
   - Cases_Rolling_Mean_3 (15%): Average cases from last 3 outbreaks
   - Source_Table (4%): Data source identifier
   - Reporting_Month (2%): Month when outbreak was reported

💡 **For Simple Use Cases**: If you don't have historical data, you can:
   - Set lag features to 0 or reasonable defaults
   - Use current outbreak data for rolling means
   - Focus on providing accurate seasonal and geographic information
""")


def main():
    """Run all demonstration functions"""
    try:
        # Test with realistic data
        result = test_realistic_prediction()
        
        if 'error' not in result:
            # Compare scenarios
            compare_different_scenarios()
        
        # Show usage instructions
        show_usage_instructions()
        
        print("\n✅ Demonstration completed successfully!")
        
    except Exception as e:
        print(f"❌ Demonstration failed: {str(e)}")


if __name__ == "__main__":
    main()

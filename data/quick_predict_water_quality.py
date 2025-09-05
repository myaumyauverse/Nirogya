#!/usr/bin/env python3
"""
Quick Water Quality Prediction Script
====================================
Simple script to quickly test water quality predictions using trained ML models.

Created: September 5, 2025
Purpose: Quick testing of water quality models with user input
Models: RandomForest Regressor/Classifier, Logistic Regression
"""

import joblib
import pickle
import pandas as pd
import numpy as np
import os
import sys
from datetime import datetime

def load_models(model_timestamp="20250905_215908"):
    """Load all saved models and preprocessors"""
    base_path = "saved_models"
    models = {}
    
    try:
        print("🔄 Loading water quality models...")
        
        # Load models
        models['rf_regressor'] = joblib.load(f"{base_path}/randomforest_regressor_{model_timestamp}.pkl")
        models['rf_classifier'] = joblib.load(f"{base_path}/randomforest_classifier_{model_timestamp}.pkl")
        models['lr_classifier'] = joblib.load(f"{base_path}/logistic_regression_{model_timestamp}.pkl")
        
        # Load preprocessors
        models['scaler'] = joblib.load(f"{base_path}/standard_scaler_{model_timestamp}.pkl")
        models['state_encoder'] = joblib.load(f"{base_path}/state_label_encoder_{model_timestamp}.pkl")
        models['category_encoder'] = joblib.load(f"{base_path}/category_label_encoder_{model_timestamp}.pkl")
        
        # Load metadata
        with open(f"{base_path}/model_metadata_{model_timestamp}.pkl", 'rb') as f:
            models['metadata'] = pickle.load(f)
        
        print("✅ Models loaded successfully!")
        return models
        
    except Exception as e:
        print(f"❌ Error loading models: {str(e)}")
        print("Please ensure model files are present in 'saved_models' directory")
        return None

def calculate_wqi(water_params):
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
    
    # pH scoring
    ph_val = water_params['ph']
    if 6.5 <= ph_val <= 8.5:
        ph_score = 0
    else:
        ph_score = min(abs(ph_val - 7.0) * 15, 100)
    wqi += weights['ph'] * ph_score
    
    # Dissolved Oxygen scoring
    do_val = water_params['dissolved_oxygen']
    if do_val >= 5:
        do_score = 0
    else:
        do_score = (5 - do_val) * 20
    wqi += weights['dissolved_oxygen'] * min(do_score, 100)
    
    # BOD scoring
    bod_val = water_params['bod']
    if bod_val <= 3:
        bod_score = 0
    else:
        bod_score = (bod_val - 3) * 10
    wqi += weights['bod'] * min(bod_score, 100)
    
    # Nitrate scoring
    nitrate_val = water_params['nitrate_n']
    if nitrate_val <= 10:
        nitrate_score = nitrate_val * 2
    else:
        nitrate_score = 20 + (nitrate_val - 10) * 8
    wqi += weights['nitrate_n'] * min(nitrate_score, 100)
    
    # Fecal Coliform scoring
    fc_val = water_params['fecal_coliform']
    if fc_val <= 50:
        fc_score = fc_val * 0.5
    else:
        fc_score = 25 + (fc_val - 50) * 0.1
    wqi += weights['fecal_coliform'] * min(fc_score, 100)
    
    # Total Coliform scoring
    tc_val = water_params['total_coliform']
    if tc_val <= 500:
        tc_score = tc_val * 0.05
    else:
        tc_score = 25 + (tc_val - 500) * 0.01
    wqi += weights['total_coliform'] * min(tc_score, 100)
    
    return wqi

def get_sample_inputs():
    """Provide some sample water quality scenarios"""
    samples = {
        "1": {
            "name": "Excellent Quality Water",
            "data": {
                'temperature': 22.0,
                'ph': 7.2,
                'dissolved_oxygen': 8.5,
                'bod': 1.5,
                'nitrate_n': 3.0,
                'fecal_coliform': 10.0,
                'total_coliform': 50.0,
                'fecal_streptococci': 5.0
            }
        },
        "2": {
            "name": "Good Quality Water",
            "data": {
                'temperature': 25.0,
                'ph': 7.0,
                'dissolved_oxygen': 6.0,
                'bod': 2.5,
                'nitrate_n': 7.0,
                'fecal_coliform': 30.0,
                'total_coliform': 200.0,
                'fecal_streptococci': 15.0
            }
        },
        "3": {
            "name": "Moderate Quality Water",
            "data": {
                'temperature': 28.0,
                'ph': 8.2,
                'dissolved_oxygen': 4.0,
                'bod': 4.0,
                'nitrate_n': 12.0,
                'fecal_coliform': 80.0,
                'total_coliform': 600.0,
                'fecal_streptococci': 40.0
            }
        },
        "4": {
            "name": "Poor Quality Water",
            "data": {
                'temperature': 32.0,
                'ph': 9.0,
                'dissolved_oxygen': 2.0,
                'bod': 8.0,
                'nitrate_n': 20.0,
                'fecal_coliform': 200.0,
                'total_coliform': 1500.0,
                'fecal_streptococci': 100.0
            }
        },
        "5": {
            "name": "Custom Input",
            "data": None
        }
    }
    return samples

def get_custom_input():
    """Get custom water quality parameters from user"""
    print("\n📝 Enter water quality parameters:")
    
    parameters = {
        'temperature': "Temperature (°C) [10-40]: ",
        'ph': "pH Level [6.0-9.0]: ",
        'dissolved_oxygen': "Dissolved Oxygen (mg/L) [0-15]: ",
        'bod': "BOD (mg/L) [0-10]: ",
        'nitrate_n': "Nitrate-N (mg/L) [0-20]: ",
        'fecal_coliform': "Fecal Coliform (CFU/100mL) [0-1000]: ",
        'total_coliform': "Total Coliform (CFU/100mL) [0-5000]: ",
        'fecal_streptococci': "Fecal Streptococci (CFU/100mL) [0-500]: "
    }
    
    water_data = {}
    for param, prompt in parameters.items():
        while True:
            try:
                value = float(input(prompt))
                water_data[param] = value
                break
            except ValueError:
                print("Please enter a valid number!")
    
    return water_data

def predict_water_quality(models, water_data):
    """Make predictions using loaded models"""
    
    # Check what features the scaler expects
    expected_features = models['scaler'].n_features_in_
    print(f"Debug: Scaler expects {expected_features} features")
    
    # Based on the error, the scaler expects only 4 features
    # Let's use the most important water quality parameters
    features = np.array([
        water_data['ph'],
        water_data['dissolved_oxygen'],
        water_data['bod'],
        water_data['nitrate_n']
    ]).reshape(1, -1)
    
    print(f"Debug: Providing {features.shape[1]} features: {features[0]}")
    
    # Scale features
    features_scaled = models['scaler'].transform(features)
    
    # Calculate WQI for display purposes
    wqi_value = calculate_wqi(water_data)
    
    # Make predictions
    predictions = {}
    
    # WQI Regression
    wqi_pred = models['rf_regressor'].predict(features_scaled)[0]
    predictions['wqi_calculated'] = wqi_value
    predictions['wqi_predicted'] = wqi_pred
    
    # RandomForest Classification
    rf_class_pred = models['rf_classifier'].predict(features_scaled)[0]
    rf_class_proba = models['rf_classifier'].predict_proba(features_scaled)[0]
    rf_category = models['category_encoder'].inverse_transform([rf_class_pred])[0]
    predictions['rf_category'] = rf_category
    predictions['rf_confidence'] = max(rf_class_proba)
    
    # Logistic Regression Classification
    lr_class_pred = models['lr_classifier'].predict(features_scaled)[0]
    lr_class_proba = models['lr_classifier'].predict_proba(features_scaled)[0]
    lr_category = models['category_encoder'].inverse_transform([lr_class_pred])[0]
    predictions['lr_category'] = lr_category
    predictions['lr_confidence'] = max(lr_class_proba)
    
    return predictions

def display_results(water_data, predictions):
    """Display prediction results"""
    print("\n" + "="*50)
    print("🔬 WATER QUALITY ANALYSIS RESULTS")
    print("="*50)
    
    # Input summary
    print("\n📊 Input Parameters:")
    for param, value in water_data.items():
        print(f"  {param.replace('_', ' ').title()}: {value}")
    
    # WQI Analysis
    wqi_calc = predictions['wqi_calculated']
    wqi_pred = predictions['wqi_predicted']
    
    print(f"\n🎯 Water Quality Index (WQI):")
    print(f"  Calculated WQI: {wqi_calc:.2f}")
    print(f"  ML Predicted WQI: {wqi_pred:.2f}")
    print(f"  Difference: {abs(wqi_calc - wqi_pred):.2f}")
    
    # WQI Category
    if wqi_calc <= 25:
        wqi_status = "🟢 Excellent"
    elif wqi_calc <= 50:
        wqi_status = "🟡 Good"
    elif wqi_calc <= 75:
        wqi_status = "🟠 Moderate"
    elif wqi_calc <= 100:
        wqi_status = "🔴 Poor"
    else:
        wqi_status = "⚫ Very Poor"
    
    print(f"  WQI Status: {wqi_status}")
    
    # ML Predictions
    print(f"\n🤖 ML Classification Results:")
    print(f"  RandomForest: {predictions['rf_category']} ({predictions['rf_confidence']:.1%} confidence)")
    print(f"  Logistic Regression: {predictions['lr_category']} ({predictions['lr_confidence']:.1%} confidence)")
    
    # Agreement
    agreement = "✅ Yes" if predictions['rf_category'] == predictions['lr_category'] else "⚠️ No"
    print(f"  Model Agreement: {agreement}")

def main():
    """Main function"""
    print("🌊 QUICK WATER QUALITY PREDICTION")
    print("=================================")
    
    # Load models
    models = load_models()
    if models is None:
        return
    
    # Show sample options
    samples = get_sample_inputs()
    
    print("\n🧪 Choose a water sample to analyze:")
    for key, sample in samples.items():
        print(f"  {key}. {sample['name']}")
    
    # Get user choice
    while True:
        choice = input("\nEnter choice (1-5): ").strip()
        if choice in samples:
            break
        print("Invalid choice! Please enter 1-5.")
    
    # Get water data
    if choice == "5":
        water_data = get_custom_input()
    else:
        water_data = samples[choice]['data']
        print(f"\n✅ Using sample: {samples[choice]['name']}")
    
    # Make predictions
    print("\n🔄 Making predictions...")
    predictions = predict_water_quality(models, water_data)
    
    # Display results
    display_results(water_data, predictions)
    
    print(f"\n✨ Analysis completed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye!")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")

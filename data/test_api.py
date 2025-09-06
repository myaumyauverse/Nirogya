#!/usr/bin/env python3
"""
API Test Script for Disease-Water Quality Correlation Analysis
==============================================================
Test script to demonstrate all API endpoints and functionality.

Usage: python test_api.py
"""

import requests
import json
import time
from datetime import datetime

# API base URL
BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing Health Check Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ Health Check Passed!")
            print(f"   Status: {data['status']}")
            print(f"   ML Models Loaded: {data['ml_models_loaded']}")
            return True
        else:
            print(f"❌ Health Check Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health Check Error: {e}")
        return False

def test_complete_analysis():
    """Test the complete integrated analysis endpoint"""
    print("\n📊 Testing Complete Analysis Endpoint...")
    
    payload = {
        "outbreak_data": {
            "No_of_Cases": 200,
            "Northeast_State": 2,
            "Start_of_Outbreak_Month": 7
        },
        "water_params": {
            "ph": 8.8,
            "dissolved_oxygen": 2.5,
            "bod": 8.0,
            "nitrate_n": 15.0,
            "fecal_coliform": 250.0,
            "total_coliform": 1200.0,
            "temperature": 32.0
        },
        "include_future": True
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/analyze", 
            json=payload, 
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Complete Analysis Successful!")
            
            analysis = data['analysis']
            print(f"   Alert Level: {analysis['alert_level']}")
            print(f"   Combined Risk: {analysis['risk_scores']['combined_risk']:.1f}/100")
            print(f"   Predicted Cases: {analysis['disease_prediction']['predicted_cases']}")
            print(f"   Water Quality: {analysis['water_assessment']['quality_category']}")
            
            # Show future predictions
            if 'future_predictions' in analysis and analysis['future_predictions']:
                print("   🔮 Future Predictions:")
                for month_key, pred in analysis['future_predictions'].items():
                    print(f"      Month {pred['month']}: {pred['predicted_cases']} cases ({pred['risk_level']})")
            
            return True
        else:
            print(f"❌ Complete Analysis Failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Complete Analysis Error: {e}")
        return False

def test_water_quality_only():
    """Test the water quality assessment endpoint"""
    print("\n💧 Testing Water Quality Assessment...")
    
    payload = {
        "water_params": {
            "ph": 6.2,
            "dissolved_oxygen": 4.0,
            "bod": 3.5,
            "nitrate_n": 8.0,
            "fecal_coliform": 45.0,
            "total_coliform": 180.0,
            "temperature": 26.0
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/water-quality", 
            json=payload, 
            timeout=15
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Water Quality Assessment Successful!")
            
            assessment = data['water_assessment']
            print(f"   WQI Score: {assessment['wqi']:.1f}")
            print(f"   Quality Category: {assessment['quality_category']}")
            print(f"   Risk Level: {assessment['risk_level']}")
            
            return True
        else:
            print(f"❌ Water Quality Assessment Failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Water Quality Assessment Error: {e}")
        return False

def test_disease_prediction():
    """Test the disease prediction endpoint"""
    print("\n🦠 Testing Disease Prediction...")
    
    payload = {
        "outbreak_data": {
            "No_of_Cases": 150,
            "Northeast_State": 3,
            "Start_of_Outbreak_Month": 8
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/disease-prediction", 
            json=payload, 
            timeout=15
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Disease Prediction Successful!")
            
            prediction = data['disease_prediction']
            print(f"   Most Likely Disease: {prediction['most_likely_disease']}")
            print(f"   Predicted Cases: {prediction['predicted_cases']}")
            print(f"   Confidence: {prediction['confidence']}")
            print(f"   Method: {prediction['method']}")
            
            return True
        else:
            print(f"❌ Disease Prediction Failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Disease Prediction Error: {e}")
        return False

def test_future_trends():
    """Test the future trends prediction endpoint"""
    print("\n🔮 Testing Future Trends Prediction...")
    
    payload = {
        "outbreak_data": {
            "No_of_Cases": 100,
            "Northeast_State": 1,
            "Start_of_Outbreak_Month": 6
        },
        "water_params": {
            "ph": 9.2,
            "dissolved_oxygen": 1.5,
            "bod": 12.0,
            "nitrate_n": 25.0,
            "fecal_coliform": 400.0,
            "total_coliform": 2000.0,
            "temperature": 35.0
        },
        "months_ahead": 3
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/future-trends", 
            json=payload, 
            timeout=20
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Future Trends Prediction Successful!")
            
            predictions = data['future_predictions']
            for month_key, pred in predictions.items():
                print(f"   Month {pred['month']}: {pred['predicted_cases']} cases")
                print(f"      Disease: {pred['most_likely_disease']}")
                print(f"      Risk Level: {pred['risk_level']}")
                print(f"      Key Prep: {pred['recommendations'][0] if pred['recommendations'] else 'None'}")
            
            return True
        else:
            print(f"❌ Future Trends Prediction Failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Future Trends Prediction Error: {e}")
        return False

def test_batch_analysis():
    """Test the batch analysis endpoint"""
    print("\n📦 Testing Batch Analysis...")
    
    payload = {
        "scenarios": [
            {
                "id": "low_risk_scenario",
                "outbreak_data": {
                    "No_of_Cases": 30,
                    "Northeast_State": 1,
                    "Start_of_Outbreak_Month": 12
                },
                "water_params": {
                    "ph": 7.2,
                    "dissolved_oxygen": 6.5,
                    "bod": 2.0,
                    "nitrate_n": 5.0,
                    "fecal_coliform": 8.0,
                    "total_coliform": 45.0,
                    "temperature": 22.0
                }
            },
            {
                "id": "high_risk_scenario",
                "outbreak_data": {
                    "No_of_Cases": 300,
                    "Northeast_State": 2,
                    "Start_of_Outbreak_Month": 7
                },
                "water_params": {
                    "ph": 9.5,
                    "dissolved_oxygen": 0.8,
                    "bod": 20.0,
                    "nitrate_n": 35.0,
                    "fecal_coliform": 800.0,
                    "total_coliform": 4000.0,
                    "temperature": 38.0
                }
            }
        ],
        "include_future": True
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/batch-analyze", 
            json=payload, 
            timeout=45
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Batch Analysis Successful!")
            
            print(f"   Total Scenarios: {data['total_scenarios']}")
            print(f"   Successful Analyses: {data['successful_analyses']}")
            
            for result in data['batch_results']:
                if result['success']:
                    analysis = result['analysis']
                    print(f"   📊 {result['scenario_id']}:")
                    print(f"      Alert: {analysis['alert_level']}")
                    print(f"      Risk: {analysis['risk_scores']['combined_risk']:.1f}/100")
                else:
                    print(f"   ❌ {result['scenario_id']}: {result['error']}")
            
            return True
        else:
            print(f"❌ Batch Analysis Failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Batch Analysis Error: {e}")
        return False

def main():
    """Run all API tests"""
    print("🚀 Starting API Test Suite for Disease-Water Quality Correlation Analysis")
    print("=" * 80)
    
    # Wait for server to be ready
    print("⏳ Waiting for server to be ready...")
    time.sleep(2)
    
    tests = [
        test_health_check,
        test_complete_analysis,
        test_water_quality_only,
        test_disease_prediction,
        test_future_trends,
        test_batch_analysis
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            if test():
                passed += 1
            else:
                failed += 1
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
            failed += 1
        
        time.sleep(1)  # Brief pause between tests
    
    print("\n" + "=" * 80)
    print("📋 TEST RESULTS SUMMARY")
    print("=" * 80)
    print(f"✅ Tests Passed: {passed}")
    print(f"❌ Tests Failed: {failed}")
    print(f"📊 Success Rate: {(passed/(passed+failed)*100):.1f}%")
    
    if failed == 0:
        print("🎉 All tests passed! API is fully functional.")
    else:
        print("⚠️ Some tests failed. Please check the server and try again.")
    
    print("\n📚 API Documentation: http://localhost:5000/api/docs")
    print("🔍 Health Check: http://localhost:5000/api/health")

if __name__ == "__main__":
    main()

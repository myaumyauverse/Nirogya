#!/usr/bin/env python3
"""
Integration Test for Regional Language Chatbot
==============================================

Test script to verify that all components are working together:
- Backend API server
- Regional language processing
- Disease prediction
- Frontend connectivity
"""

import requests
import json
import time

def test_api_health():
    """Test if the API server is running and healthy"""
    try:
        response = requests.get('http://localhost:8000/health', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ API Health Check Passed")
            print(f"   - Chatbot Available: {data.get('chatbot_available', False)}")
            print(f"   - Disease Predictor Available: {data.get('disease_predictor_available', False)}")
            return True
        else:
            print(f"❌ API Health Check Failed: Status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API Health Check Failed: {e}")
        return False

def test_regional_language_processing():
    """Test regional language processing with Hindi/Hinglish input"""
    test_cases = [
        {
            "name": "Test User",
            "symptoms": "Mujhe pet mein dard hai",
            "expected": "stomach pain"
        },
        {
            "name": "Test User 2", 
            "symptoms": "Pet mein dard, loose motion, bukhar hai",
            "expected": "multiple symptoms"
        },
        {
            "name": "Test User 3",
            "symptoms": "I have stomach pain and diarrhea",
            "expected": "english symptoms"
        }
    ]
    
    print("\n🧪 Testing Regional Language Processing...")
    
    for i, test_case in enumerate(test_cases, 1):
        try:
            print(f"\nTest {i}: {test_case['symptoms']}")
            
            response = requests.post(
                'http://localhost:8000/analyze-symptoms',
                json={
                    "name": test_case["name"],
                    "symptoms": test_case["symptoms"],
                    "audio_input": False
                },
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Test {i} Passed")
                print(f"   - Status: {data.get('status', 'unknown')}")
                print(f"   - Diseases Found: {len(data.get('diseases', []))}")
                print(f"   - Severity: {data.get('severity_assessment', 'unknown')}")
                print(f"   - Recommendations: {len(data.get('recommendations', []))}")
                
                # Print first disease if any
                if data.get('diseases'):
                    disease = data['diseases'][0]
                    print(f"   - Top Match: {disease.get('name', 'unknown')} ({disease.get('confidence', 0)*100:.1f}%)")
                
            else:
                print(f"❌ Test {i} Failed: Status {response.status_code}")
                print(f"   Response: {response.text}")
                
        except Exception as e:
            print(f"❌ Test {i} Failed: {e}")
    
    return True

def test_frontend_accessibility():
    """Test if the frontend is accessible"""
    try:
        response = requests.get('http://localhost:3000', timeout=5)
        if response.status_code == 200:
            print("✅ Frontend Accessibility Test Passed")
            print("   - Frontend server is running on http://localhost:3000")
            return True
        else:
            print(f"❌ Frontend Accessibility Test Failed: Status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Frontend Accessibility Test Failed: {e}")
        return False

def main():
    """Run all integration tests"""
    print("🚀 Starting Regional Language Chatbot Integration Tests")
    print("=" * 60)
    
    # Test 1: API Health
    api_healthy = test_api_health()
    
    if not api_healthy:
        print("\n❌ Cannot proceed with tests - API server is not healthy")
        return
    
    # Test 2: Regional Language Processing
    test_regional_language_processing()
    
    # Test 3: Frontend Accessibility
    test_frontend_accessibility()
    
    print("\n" + "=" * 60)
    print("🎉 Integration Tests Completed!")
    print("\nNext Steps:")
    print("1. Open http://localhost:3000/get-started in your browser")
    print("2. Test voice input with: 'Mujhe pet mein dard hai'")
    print("3. Verify the analysis results are displayed correctly")
    print("4. Check that emergency contacts are shown")

if __name__ == "__main__":
    main()

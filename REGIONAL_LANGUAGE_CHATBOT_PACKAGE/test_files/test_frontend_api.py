#!/usr/bin/env python3
"""
Frontend API Test
================

Test the exact API call that the frontend makes to ensure compatibility.
"""

import requests
import json

def test_frontend_api():
    """Test the API exactly as the frontend calls it"""
    
    print("🧪 FRONTEND API COMPATIBILITY TEST")
    print("=" * 40)
    
    # Test data that matches frontend format
    test_data = {
        "name": "Test User",
        "symptoms": "stomach pain, diarrhea, fever",
        "audio_input": False
    }
    
    print(f"📤 Sending request:")
    print(f"   URL: http://localhost:8000/analyze-symptoms")
    print(f"   Data: {json.dumps(test_data, indent=2)}")
    
    try:
        response = requests.post(
            'http://localhost:8000/analyze-symptoms',
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"\n📥 Response:")
        print(f"   Status Code: {response.status_code}")
        print(f"   Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"\n✅ SUCCESS - API Response:")
            print(f"   Status: {result.get('status', 'Unknown')}")
            print(f"   User: {result.get('user_name', 'Unknown')}")
            print(f"   Severity: {result.get('severity_assessment', 'Unknown')}")
            print(f"   Diseases: {len(result.get('diseases', []))}")
            print(f"   Recommendations: {len(result.get('recommendations', []))}")
            
            # Check required fields for frontend
            required_fields = ['status', 'user_name', 'severity_assessment', 'diseases', 'recommendations']
            missing_fields = [field for field in required_fields if field not in result]
            
            if missing_fields:
                print(f"   ⚠️ Missing fields: {missing_fields}")
            else:
                print(f"   ✅ All required fields present")
                
            return True
            
        else:
            print(f"❌ FAILED - Status: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def test_regional_frontend_api():
    """Test regional language input through API"""
    
    print(f"\n🌍 REGIONAL LANGUAGE API TEST")
    print("=" * 40)
    
    # Test regional language input
    regional_data = {
        "name": "Regional Test User",
        "symptoms": "Mujhe pet mein dard hai, loose motion bhi hai",
        "audio_input": False
    }
    
    try:
        response = requests.post(
            'http://localhost:8000/analyze-symptoms',
            json=regional_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Regional language processed successfully")
            print(f"   Input: {regional_data['symptoms']}")
            print(f"   Severity: {result.get('severity_assessment', 'Unknown')}")
            print(f"   Diseases found: {len(result.get('diseases', []))}")
            
            if result.get('diseases'):
                top_disease = result['diseases'][0]
                print(f"   Top match: {top_disease['name']} ({top_disease['confidence']:.2f})")
                
            return True
        else:
            print(f"❌ Regional test failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Regional test error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting Frontend API Tests...\n")
    
    # Test basic API functionality
    basic_test = test_frontend_api()
    
    # Test regional language support
    regional_test = test_regional_frontend_api()
    
    print(f"\n" + "=" * 40)
    print("📊 TEST SUMMARY")
    print(f"   Basic API: {'✅ PASS' if basic_test else '❌ FAIL'}")
    print(f"   Regional Language: {'✅ PASS' if regional_test else '❌ FAIL'}")
    
    if basic_test and regional_test:
        print(f"\n🎉 ALL TESTS PASSED!")
        print(f"   Frontend should work correctly now")
        print(f"   Visit: http://localhost:3000/get-started")
    else:
        print(f"\n⚠️ Some tests failed - check backend logs")

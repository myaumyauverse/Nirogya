#!/usr/bin/env python3
"""
Quick API Test
"""

import requests
import json

def test_api():
    """Test the symptom analysis API"""
    
    url = "http://localhost:8001/analyze-symptoms"
    data = {
        "name": "Test User",
        "symptoms": "stomach pain and diarrhea",
        "audio_input": False
    }
    
    try:
        print(f"Testing API at: {url}")
        print(f"Sending data: {json.dumps(data, indent=2)}")
        
        response = requests.post(url, json=data, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API Test Successful!")
            print(f"Status: {result.get('status')}")
            print(f"User: {result.get('user_name')}")
            print(f"Diseases found: {len(result.get('diseases', []))}")
            return True
        else:
            print(f"❌ API Test Failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ API Test Error: {e}")
        return False

if __name__ == "__main__":
    test_api()

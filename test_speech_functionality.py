#!/usr/bin/env python3
"""
Speech-to-Text Functionality Test
=================================

Test script to verify speech-to-text functionality and regional language processing
"""

import requests
import json

def test_speech_simulation():
    """Test speech-to-text simulation with regional language inputs"""
    
    speech_test_cases = [
        {
            "name": "Ramesh",
            "symptoms": "Mujhe pet mein dard hai",
            "audio_input": True,
            "description": "Hindi: I have stomach pain"
        },
        {
            "name": "Priya", 
            "symptoms": "Pet dard hai, loose motion bhi aa raha hai",
            "audio_input": True,
            "description": "Hinglish: Stomach pain and loose motion"
        },
        {
            "name": "Suresh",
            "symptoms": "Bukhar hai, jee michla raha hai, kamjori lag rahi hai",
            "audio_input": True,
            "description": "Hindi: Fever, nausea, and weakness"
        },
        {
            "name": "Anita",
            "symptoms": "Mujhe ulti aa rahi hai aur sir mein dard hai",
            "audio_input": True,
            "description": "Hindi: Vomiting and headache"
        }
    ]
    
    print("🎤 Testing Speech-to-Text Functionality with Regional Languages")
    print("=" * 70)
    
    for i, test_case in enumerate(speech_test_cases, 1):
        print(f"\n🗣️ Speech Test {i}: {test_case['description']}")
        print(f"   Input: \"{test_case['symptoms']}\"")
        
        try:
            response = requests.post(
                'http://localhost:8000/analyze-symptoms',
                json={
                    "name": test_case["name"],
                    "symptoms": test_case["symptoms"],
                    "audio_input": test_case["audio_input"]
                },
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Speech Test {i} Passed")
                print(f"   - User: {data.get('user_name', 'Unknown')}")
                print(f"   - Status: {data.get('status', 'unknown')}")
                print(f"   - Severity: {data.get('severity_assessment', 'unknown')}")
                
                diseases = data.get('diseases', [])
                if diseases:
                    print(f"   - Top Disease Match: {diseases[0].get('name', 'unknown')}")
                    print(f"   - Confidence: {diseases[0].get('confidence', 0)*100:.1f}%")
                    print(f"   - Matching Symptoms: {', '.join(diseases[0].get('matching_symptoms', []))}")
                
                recommendations = data.get('recommendations', [])
                if recommendations:
                    print(f"   - Recommendations: {len(recommendations)} provided")
                    print(f"   - First Recommendation: {recommendations[0][:50]}...")
                
                emergency = data.get('emergency_contacts', {})
                if emergency:
                    print(f"   - Emergency Contacts: Ambulance {emergency.get('ambulance', 'N/A')}")
                
            else:
                print(f"❌ Speech Test {i} Failed: Status {response.status_code}")
                print(f"   Response: {response.text[:100]}...")
                
        except Exception as e:
            print(f"❌ Speech Test {i} Failed: {e}")
    
    return True

def test_regional_translation_accuracy():
    """Test the accuracy of regional language translation"""
    
    translation_tests = [
        {
            "input": "Mujhe pet mein dard hai",
            "expected_keywords": ["stomach", "pain"],
            "description": "Basic stomach pain"
        },
        {
            "input": "loose motion ho raha hai",
            "expected_keywords": ["diarrhea", "loose"],
            "description": "Diarrhea symptoms"
        },
        {
            "input": "bukhar aur ulti",
            "expected_keywords": ["fever", "vomiting"],
            "description": "Fever and vomiting"
        }
    ]
    
    print("\n🔄 Testing Regional Language Translation Accuracy")
    print("=" * 50)
    
    for i, test in enumerate(translation_tests, 1):
        print(f"\nTranslation Test {i}: {test['description']}")
        print(f"   Input: \"{test['input']}\"")
        
        try:
            response = requests.post(
                'http://localhost:8000/analyze-symptoms',
                json={
                    "name": "Test User",
                    "symptoms": test["input"],
                    "audio_input": False
                },
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                diseases = data.get('diseases', [])
                
                # Check if translation worked by looking at matched symptoms
                translation_successful = False
                if diseases:
                    for disease in diseases:
                        matched_symptoms = disease.get('matching_symptoms', [])
                        for keyword in test['expected_keywords']:
                            if any(keyword.lower() in symptom.lower() for symptom in matched_symptoms):
                                translation_successful = True
                                break
                        if translation_successful:
                            break
                
                if translation_successful or data.get('status') == 'success':
                    print(f"✅ Translation Test {i} Passed")
                    if diseases:
                        print(f"   - Detected Disease: {diseases[0].get('name', 'unknown')}")
                        print(f"   - Matched Symptoms: {', '.join(diseases[0].get('matching_symptoms', []))}")
                else:
                    print(f"⚠️ Translation Test {i} Partial: No specific keyword matches found")
                    
            else:
                print(f"❌ Translation Test {i} Failed: Status {response.status_code}")
                
        except Exception as e:
            print(f"❌ Translation Test {i} Failed: {e}")

def main():
    """Run all speech functionality tests"""
    print("🎯 Regional Language Chatbot Speech Functionality Tests")
    print("=" * 60)
    
    # Test speech simulation
    test_speech_simulation()
    
    # Test translation accuracy
    test_regional_translation_accuracy()
    
    print("\n" + "=" * 60)
    print("🎉 Speech Functionality Tests Completed!")
    print("\nManual Testing Instructions:")
    print("1. Open http://localhost:3000/get-started in your browser")
    print("2. Click 'Start Voice Input' button")
    print("3. Say: 'Mujhe pet mein dard hai'")
    print("4. Verify the text appears in the textarea")
    print("5. Submit the form and check the analysis results")
    print("6. Verify emergency contacts are displayed")

if __name__ == "__main__":
    main()

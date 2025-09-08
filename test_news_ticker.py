#!/usr/bin/env python3
"""
News Ticker Test Script
======================
Test script to verify the news ticker API is working with mock data.

Usage: python test_news_ticker.py
"""

import sys
import os
import requests
import json
from pathlib import Path

def test_mock_data_service():
    """Test the mock data service directly"""
    print("🧪 Testing Mock Data Service...")
    
    try:
        sys.path.append('backend')
        from mock_news_data import get_mock_response
        
        response = get_mock_response()
        alerts = response.get('alerts', [])
        
        print(f"✅ Mock service working - Generated {len(alerts)} alerts")
        
        if alerts:
            print("\n📰 Sample alerts:")
            for i, alert in enumerate(alerts[:3], 1):
                severity_emoji = {
                    "critical": "🔴",
                    "high": "🟠", 
                    "medium": "🟡",
                    "low": "🟢"
                }.get(alert['severity'], "⚪")
                
                print(f"  {i}. {severity_emoji} {alert['text'][:60]}...")
                print(f"     📍 {alert['region']} | 📡 {alert['source']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Mock service test failed: {e}")
        return False

def test_environment_config():
    """Test environment configuration"""
    print("\n🔧 Testing Environment Configuration...")
    
    env_file = Path("backend/.env")
    if not env_file.exists():
        print("❌ .env file not found")
        return False
    
    print("✅ .env file exists")
    
    # Check for USE_MOCK_DATA setting
    try:
        with open(env_file, 'r') as f:
            content = f.read()
            if 'USE_MOCK_DATA=true' in content:
                print("✅ USE_MOCK_DATA=true found in .env")
                return True
            elif 'USE_MOCK_DATA=false' in content:
                print("⚠️  USE_MOCK_DATA=false - should be 'true' for mock data")
                return False
            else:
                print("⚠️  USE_MOCK_DATA not found in .env")
                return False
    except Exception as e:
        print(f"❌ Error reading .env file: {e}")
        return False

def test_api_endpoint():
    """Test the API endpoint"""
    print("\n🔌 Testing API Endpoint...")
    
    try:
        # Test health endpoint first
        print("Testing health endpoint...")
        health_response = requests.get("http://localhost:8001/api/news-ticker/health", timeout=5)
        
        if health_response.status_code == 200:
            health_data = health_response.json()
            print(f"✅ Health endpoint accessible - Status: {health_data.get('status', 'unknown')}")
            print(f"   Mode: {health_data.get('mode', 'unknown')}")
            
            if health_data.get('mode') == 'development':
                print("✅ Running in development mode with mock data")
            
        else:
            print(f"⚠️  Health endpoint returned status {health_response.status_code}")
        
        # Test main news ticker endpoint
        print("\nTesting news ticker endpoint...")
        response = requests.get("http://localhost:8001/api/news-ticker", timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            alerts = data.get('alerts', [])
            print(f"✅ News ticker endpoint working - {len(alerts)} alerts received")
            
            if alerts:
                print("\n📰 API Response alerts:")
                for i, alert in enumerate(alerts[:2], 1):
                    print(f"  {i}. [{alert['severity'].upper()}] {alert['text'][:50]}...")
                    print(f"     📍 {alert['region']} | 📡 {alert['source']}")
            
            return True
        else:
            print(f"❌ News ticker endpoint returned status {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server on localhost:8001")
        print("   Start it with: python backend/api_server.py")
        return False
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False

def test_frontend_proxy():
    """Test frontend proxy configuration"""
    print("\n🎨 Testing Frontend Proxy...")
    
    next_config = Path("frontend/next.config.js")
    if next_config.exists():
        print("✅ next.config.js exists")
        
        try:
            with open(next_config, 'r') as f:
                content = f.read()
                if 'localhost:8001' in content and '/api/' in content:
                    print("✅ API proxy configuration found")
                    return True
                else:
                    print("⚠️  API proxy configuration not found")
                    return False
        except Exception as e:
            print(f"❌ Error reading next.config.js: {e}")
            return False
    else:
        print("❌ next.config.js not found")
        return False

def show_startup_instructions():
    """Show instructions for starting the services"""
    print("\n🚀 Startup Instructions")
    print("=" * 30)
    
    print("\n1. 📦 Install Dependencies:")
    print("   pip install -r requirements.txt")
    print("   cd frontend && npm install")
    
    print("\n2. 🔧 Start Backend Server:")
    print("   python backend/api_server.py")
    print("   (Should start on http://localhost:8001)")
    
    print("\n3. 🎨 Start Frontend Server:")
    print("   cd frontend && npm run dev")
    print("   (Should start on http://localhost:3000)")
    
    print("\n4. 🌐 Test in Browser:")
    print("   Visit http://localhost:3000")
    print("   Look for the news ticker at the top of the page")
    
    print("\n5. 🔍 Debug:")
    print("   Check browser console for errors")
    print("   Check backend terminal for API logs")

def main():
    """Main test function"""
    print("🏥 Nirogya News Ticker Test")
    print("=" * 35)
    
    # Check if we're in the right directory
    if not Path("backend").exists() or not Path("frontend").exists():
        print("❌ Please run this script from the project root directory")
        print("   (The directory containing 'backend' and 'frontend' folders)")
        sys.exit(1)
    
    print("📁 Project structure verified")
    
    # Run tests
    env_ok = test_environment_config()
    mock_ok = test_mock_data_service()
    frontend_ok = test_frontend_proxy()
    api_ok = test_api_endpoint()
    
    # Show results
    print("\n" + "=" * 35)
    print("📊 Test Results")
    print("=" * 35)
    
    if env_ok:
        print("✅ Environment configuration")
    else:
        print("❌ Environment configuration")
    
    if mock_ok:
        print("✅ Mock data service")
    else:
        print("❌ Mock data service")
    
    if frontend_ok:
        print("✅ Frontend proxy configuration")
    else:
        print("❌ Frontend proxy configuration")
    
    if api_ok:
        print("✅ API endpoint")
    else:
        print("❌ API endpoint (server may not be running)")
    
    # Show next steps
    if env_ok and mock_ok and frontend_ok:
        if api_ok:
            print("\n🎉 All tests passed! News ticker should be working.")
            print("   Visit http://localhost:3000 to see it in action.")
        else:
            print("\n⚠️  Tests passed but API server not running.")
            show_startup_instructions()
    else:
        print("\n❌ Some tests failed. Please fix the issues above.")
        show_startup_instructions()

if __name__ == "__main__":
    main()

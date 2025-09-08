#!/usr/bin/env python3
"""
News Ticker Setup Script
========================
Setup script for the Nirogya Flash News Ticker integration.

This script helps configure:
- API keys for WaterNet ICMR and Meersens
- Environment variables
- Testing the news ticker functionality
- Verifying API connections

Usage: python setup_news_ticker.py
"""

import os
import sys
from pathlib import Path

def create_env_file():
    """Create .env file from template"""
    env_example = Path("backend/.env.example")
    env_file = Path("backend/.env")
    
    if not env_example.exists():
        print("❌ .env.example file not found")
        return False
    
    if env_file.exists():
        response = input("📁 .env file already exists. Overwrite? [y/N]: ").lower().strip()
        if response != 'y':
            print("✅ Keeping existing .env file")
            return True
    
    try:
        # Copy template to .env
        with open(env_example, 'r') as src, open(env_file, 'w') as dst:
            dst.write(src.read())
        
        print("✅ Created .env file from template")
        print("📝 Please edit backend/.env to add your API keys")
        return True
        
    except Exception as e:
        print(f"❌ Error creating .env file: {e}")
        return False

def test_mock_service():
    """Test the mock news service"""
    print("\n🧪 Testing Mock News Service...")
    
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
                
                print(f"  {i}. {severity_emoji} {alert['text'][:80]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Mock service test failed: {e}")
        return False

def test_api_endpoint():
    """Test the API endpoint"""
    print("\n🔌 Testing API Endpoint...")
    
    try:
        import requests
        
        # Test if backend server is running
        try:
            response = requests.get("http://localhost:8001/api/news-ticker/health", timeout=5)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ API endpoint accessible - Status: {data.get('status', 'unknown')}")
                return True
            else:
                print(f"⚠️  API endpoint returned status {response.status_code}")
                return False
                
        except requests.exceptions.ConnectionError:
            print("⚠️  Backend server not running on localhost:8001")
            print("   Start it with: python backend/api_server.py")
            return False
            
    except ImportError:
        print("⚠️  requests library not installed")
        print("   Install with: pip install requests")
        return False
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False

def check_frontend_integration():
    """Check if frontend component exists"""
    print("\n🎨 Checking Frontend Integration...")
    
    frontend_files = [
        "frontend/components/NewsTicker.tsx",
        "frontend/app/layout.tsx"
    ]
    
    all_exist = True
    for file_path in frontend_files:
        if Path(file_path).exists():
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} - NOT FOUND")
            all_exist = False
    
    if all_exist:
        print("✅ Frontend integration files present")
    else:
        print("⚠️  Some frontend files missing")
    
    return all_exist

def show_api_key_instructions():
    """Show instructions for getting API keys"""
    print("\n🔑 API Key Setup Instructions")
    print("=" * 40)
    
    print("\n1. 🏥 WaterNet ICMR API Key:")
    print("   • Contact: Indian Council of Medical Research (ICMR)")
    print("   • Website: https://www.icmr.gov.in/")
    print("   • Purpose: Real-time disease surveillance data")
    print("   • Note: This may require official approval")
    
    print("\n2. 🌊 Meersens API Key:")
    print("   • Website: https://www.meersens.com/")
    print("   • Sign up for developer account")
    print("   • Purpose: Water quality monitoring data")
    print("   • Free tier available for testing")
    
    print("\n3. 📝 Configuration:")
    print("   • Edit backend/.env file")
    print("   • Add your API keys")
    print("   • Set USE_MOCK_DATA=false when ready")

def show_usage_instructions():
    """Show how to use the news ticker"""
    print("\n🚀 Usage Instructions")
    print("=" * 30)
    
    print("\n1. 🔧 Development Mode (Mock Data):")
    print("   • Set USE_MOCK_DATA=true in backend/.env")
    print("   • Start backend: python backend/api_server.py")
    print("   • Start frontend: cd frontend && npm run dev")
    print("   • News ticker will show mock alerts")
    
    print("\n2. 🌐 Production Mode (Real APIs):")
    print("   • Add real API keys to backend/.env")
    print("   • Set USE_MOCK_DATA=false")
    print("   • Start backend server")
    print("   • News ticker will fetch real alerts")
    
    print("\n3. 🎛️  Customization:")
    print("   • Update interval: NEWS_TICKER_UPDATE_INTERVAL")
    print("   • Max alerts: NEWS_TICKER_MAX_ALERTS")
    print("   • Alert types: ALERT_TYPES")
    print("   • Minimum severity: MIN_ALERT_SEVERITY")

def main():
    """Main setup function"""
    print("🏥 Nirogya Flash News Ticker Setup")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not Path("backend").exists() or not Path("frontend").exists():
        print("❌ Please run this script from the project root directory")
        print("   (The directory containing 'backend' and 'frontend' folders)")
        sys.exit(1)
    
    print("📁 Project structure verified")
    
    # Create .env file
    env_created = create_env_file()
    
    # Test mock service
    mock_working = test_mock_service()
    
    # Check frontend integration
    frontend_ok = check_frontend_integration()
    
    # Test API endpoint (optional)
    api_working = test_api_endpoint()
    
    # Show results
    print("\n" + "=" * 40)
    print("📊 Setup Summary")
    print("=" * 40)
    
    if env_created:
        print("✅ Environment configuration ready")
    else:
        print("❌ Environment configuration failed")
    
    if mock_working:
        print("✅ Mock data service working")
    else:
        print("❌ Mock data service failed")
    
    if frontend_ok:
        print("✅ Frontend components ready")
    else:
        print("❌ Frontend components missing")
    
    if api_working:
        print("✅ API endpoint accessible")
    else:
        print("⚠️  API endpoint not accessible (server may not be running)")
    
    # Show next steps
    if env_created and mock_working and frontend_ok:
        print("\n🎉 Setup completed successfully!")
        print("\n📋 Next Steps:")
        print("1. Edit backend/.env to add API keys (optional)")
        print("2. Start backend: python backend/api_server.py")
        print("3. Start frontend: cd frontend && npm run dev")
        print("4. Visit your website to see the news ticker!")
        
        show_api_key_instructions()
        show_usage_instructions()
    else:
        print("\n⚠️  Setup completed with issues")
        print("   Please resolve the failed components above")

if __name__ == "__main__":
    main()

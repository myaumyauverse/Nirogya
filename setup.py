#!/usr/bin/env python3
"""
Nirogya Setup Script
===================
Quick setup script for the Nirogya Waterborne Disease Prediction System.

Usage:
    python setup.py
    
This script will:
1. Check Python version compatibility
2. Create virtual environment (optional)
3. Install all required dependencies
4. Verify installation
5. Provide next steps
"""

import sys
import subprocess
import os
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Error: Python 3.8 or higher is required")
        print(f"   Current version: {version.major}.{version.minor}.{version.micro}")
        print("   Please upgrade Python and try again")
        return False
    
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} - Compatible")
    return True

def create_virtual_environment():
    """Create virtual environment if requested"""
    response = input("\n🔧 Create virtual environment? (recommended) [y/N]: ").lower().strip()
    
    if response in ['y', 'yes']:
        print("📦 Creating virtual environment...")
        try:
            subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
            print("✅ Virtual environment created successfully!")
            
            # Provide activation instructions
            if os.name == 'nt':  # Windows
                activate_cmd = "venv\\Scripts\\activate"
            else:  # Unix/Linux/macOS
                activate_cmd = "source venv/bin/activate"
            
            print(f"\n💡 To activate virtual environment, run:")
            print(f"   {activate_cmd}")
            print("\n⚠️  Please activate the virtual environment and run this script again")
            return False
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to create virtual environment: {e}")
            return False
    
    return True

def install_dependencies():
    """Install required dependencies"""
    print("\n📥 Installing dependencies...")
    
    try:
        # Upgrade pip first
        print("🔄 Upgrading pip...")
        subprocess.run([sys.executable, "-m", "pip", "install", "--upgrade", "pip"], 
                      check=True, capture_output=True)
        
        # Install requirements
        print("📦 Installing project dependencies...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], 
                      check=True)
        
        print("✅ All dependencies installed successfully!")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        print("\n🔧 Troubleshooting tips:")
        print("1. Ensure you have internet connection")
        print("2. Try: pip install --upgrade pip")
        print("3. Try: pip cache purge")
        print("4. Install in virtual environment")
        return False

def verify_installation():
    """Verify that all key packages are installed correctly"""
    print("\n🔍 Verifying installation...")
    
    required_packages = [
        ('flask', 'Flask'),
        ('pandas', 'pandas'),
        ('numpy', 'numpy'),
        ('sklearn', 'scikit-learn'),
        ('requests', 'requests'),
    ]
    
    failed_imports = []
    
    for module, package_name in required_packages:
        try:
            __import__(module)
            print(f"✅ {package_name}")
        except ImportError:
            print(f"❌ {package_name}")
            failed_imports.append(package_name)
    
    if failed_imports:
        print(f"\n❌ Failed to import: {', '.join(failed_imports)}")
        print("   Please check the installation and try again")
        return False
    
    print("\n🎉 All packages verified successfully!")
    return True

def show_next_steps():
    """Show next steps after successful installation"""
    print("\n" + "="*60)
    print("🎉 SETUP COMPLETE!")
    print("="*60)
    
    print("\n🚀 You can now run the following services:")
    print("\n1. 📊 Main Correlation API Server:")
    print("   python data/correlation_api.py")
    print("   → Access at: http://localhost:5000")
    
    print("\n2. 🤖 FastAPI Server (Enhanced):")
    print("   python backend/api_server.py")
    print("   → Access at: http://localhost:8001")
    
    print("\n3. 🔬 Interactive Analysis Tool:")
    print("   python data/interactive_analysis.py")
    
    print("\n4. 💬 AI Chatbot Test:")
    print("   cd 'AI chatbot' && python chatbot.py")
    
    print("\n📚 Documentation:")
    print("   - API docs: http://localhost:5000/api/docs (when server running)")
    print("   - README files in data/ and backend/ directories")
    
    print("\n🎯 Frontend Setup:")
    print("   cd frontend")
    print("   npm install")
    print("   npm run dev")
    
    print("\n💡 Tip: Start with the correlation API server for full functionality!")

def main():
    """Main setup function"""
    print("🏥 Nirogya - Waterborne Disease Prediction System")
    print("=" * 55)
    print("🔧 Setup Script")
    print()
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Check if requirements.txt exists
    if not Path("requirements.txt").exists():
        print("❌ Error: requirements.txt not found")
        print("   Please run this script from the project root directory")
        sys.exit(1)
    
    # Create virtual environment if needed
    if not create_virtual_environment():
        sys.exit(0)  # User needs to activate venv first
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Verify installation
    if not verify_installation():
        sys.exit(1)
    
    # Show next steps
    show_next_steps()

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Installation Verification Script
===============================
Quick script to verify that all Nirogya dependencies are properly installed.

Usage: python verify_installation.py
"""

import sys
import importlib
from pathlib import Path

def test_import(module_name, package_name=None, required=True):
    """Test if a module can be imported"""
    if package_name is None:
        package_name = module_name
    
    try:
        module = importlib.import_module(module_name)
        version = getattr(module, '__version__', 'unknown')
        print(f"✅ {package_name:<20} {version}")
        return True
    except ImportError as e:
        status = "❌" if required else "⚠️ "
        print(f"{status} {package_name:<20} NOT FOUND")
        if required:
            print(f"   Error: {e}")
        return False

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    print(f"🐍 Python Version: {version.major}.{version.minor}.{version.micro}")
    
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ required")
        return False
    else:
        print("✅ Python version compatible")
        return True

def check_project_files():
    """Check if key project files exist"""
    print("\n📁 Project Files:")
    
    required_files = [
        "requirements.txt",
        "data/correlation_api.py",
        "data/disease_prediction_service.py",
        "data/disease_water_correlation.py",
        "backend/api_server.py",
        "AI chatbot/chatbot.py"
    ]
    
    all_exist = True
    for file_path in required_files:
        if Path(file_path).exists():
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} - NOT FOUND")
            all_exist = False
    
    return all_exist

def main():
    """Main verification function"""
    print("🏥 Nirogya Installation Verification")
    print("=" * 40)
    
    # Check Python version
    python_ok = check_python_version()
    
    # Check project files
    files_ok = check_project_files()
    
    print("\n📦 Python Packages:")
    
    # Test core dependencies
    core_packages = [
        ("flask", "Flask"),
        ("pandas", "pandas"),
        ("numpy", "numpy"),
        ("sklearn", "scikit-learn"),
        ("joblib", "joblib"),
        ("requests", "requests"),
    ]
    
    core_ok = True
    for module, package in core_packages:
        if not test_import(module, package, required=True):
            core_ok = False
    
    # Test optional dependencies
    print("\n🔧 Optional Packages:")
    optional_packages = [
        ("fastapi", "FastAPI"),
        ("uvicorn", "uvicorn"),
        ("pydantic", "pydantic"),
        ("flask_cors", "flask-cors"),
    ]
    
    for module, package in optional_packages:
        test_import(module, package, required=False)
    
    # Test specific functionality
    print("\n🧪 Functionality Tests:")
    
    try:
        # Test pandas DataFrame creation
        import pandas as pd
        df = pd.DataFrame({'test': [1, 2, 3]})
        print("✅ pandas DataFrame creation")
    except Exception as e:
        print(f"❌ pandas DataFrame creation: {e}")
        core_ok = False
    
    try:
        # Test numpy array operations
        import numpy as np
        arr = np.array([1, 2, 3])
        result = np.mean(arr)
        print("✅ numpy array operations")
    except Exception as e:
        print(f"❌ numpy array operations: {e}")
        core_ok = False
    
    try:
        # Test scikit-learn basic functionality
        from sklearn.feature_extraction.text import TfidfVectorizer
        vectorizer = TfidfVectorizer()
        print("✅ scikit-learn TfidfVectorizer")
    except Exception as e:
        print(f"❌ scikit-learn TfidfVectorizer: {e}")
        core_ok = False
    
    try:
        # Test Flask app creation
        from flask import Flask
        app = Flask(__name__)
        print("✅ Flask app creation")
    except Exception as e:
        print(f"❌ Flask app creation: {e}")
        core_ok = False
    
    # Final status
    print("\n" + "=" * 40)
    if python_ok and files_ok and core_ok:
        print("🎉 VERIFICATION SUCCESSFUL!")
        print("✅ All core dependencies are properly installed")
        print("✅ All required project files are present")
        print("\n🚀 You can now run the Nirogya services:")
        print("   python data/correlation_api.py")
        print("   python backend/api_server.py")
        print("   python data/interactive_analysis.py")
    else:
        print("❌ VERIFICATION FAILED!")
        if not python_ok:
            print("   - Python version issue")
        if not files_ok:
            print("   - Missing project files")
        if not core_ok:
            print("   - Missing or broken dependencies")
        print("\n🔧 Try running: pip install -r requirements.txt")
    
    print("\n💡 For detailed setup, run: python setup.py")

if __name__ == "__main__":
    main()

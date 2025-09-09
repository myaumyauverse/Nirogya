@echo off
REM Regional Language Chatbot Installation Script for Windows
REM =========================================================
REM 
REM This script automates the installation of the Regional Language Chatbot
REM into an existing SIH-LLM project on Windows.
REM
REM Usage: install.bat [target_project_path]
REM Example: install.bat C:\path\to\your\sih-llm-project

setlocal enabledelayedexpansion

echo 🌍 Regional Language Chatbot Installer (Windows)
echo ================================================
echo.

REM Get target directory
if "%~1"=="" (
    set /p target_dir="Enter the path to your SIH-LLM project: "
) else (
    set target_dir=%~1
)

REM Remove quotes if present
set target_dir=%target_dir:"=%

echo [INFO] Target directory: %target_dir%
echo [INFO] Package directory: %~dp0
echo.

REM Verify target directory structure
echo [INFO] Verifying target project structure...

if not exist "%target_dir%" (
    echo [ERROR] Target directory does not exist: %target_dir%
    pause
    exit /b 1
)

if not exist "%target_dir%\backend" (
    echo [ERROR] Backend directory not found in target project
    pause
    exit /b 1
)

if not exist "%target_dir%\frontend" (
    echo [ERROR] Frontend directory not found in target project
    pause
    exit /b 1
)

if not exist "%target_dir%\AI chatbot" (
    echo [ERROR] AI chatbot directory not found in target project
    echo [ERROR] Please ensure the original SIH-LLM structure is present
    pause
    exit /b 1
)

echo [SUCCESS] Project structure verified
echo.

REM Check prerequisites
echo [INFO] Checking prerequisites...

python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is required but not installed
    pause
    exit /b 1
)

pip --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] pip is required but not installed
    pause
    exit /b 1
)

node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is required but not installed
    pause
    exit /b 1
)

npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is required but not installed
    pause
    exit /b 1
)

echo [SUCCESS] Prerequisites check passed
echo.

REM Confirm installation
echo [WARNING] This will install the Regional Language Chatbot into:
echo [WARNING] %target_dir%
echo [WARNING] 
echo [WARNING] Existing files will be backed up with timestamp.
echo.
set /p confirm="Do you want to continue? (y/N): "

if /i not "%confirm%"=="y" (
    echo [INFO] Installation cancelled
    pause
    exit /b 0
)

echo.
echo [INFO] Starting installation...

REM Backend installation
echo [INFO] Installing backend components...

REM Backup existing files
if exist "%target_dir%\backend\api_server.py" (
    copy "%target_dir%\backend\api_server.py" "%target_dir%\backend\api_server.py.backup.%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%" >nul
    echo [INFO] Backed up api_server.py
)

if exist "%target_dir%\backend\disease_prediction_service.py" (
    copy "%target_dir%\backend\disease_prediction_service.py" "%target_dir%\backend\disease_prediction_service.py.backup.%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%" >nul
    echo [INFO] Backed up disease_prediction_service.py
)

REM Copy backend files
copy "%~dp0backend\api_server.py" "%target_dir%\backend\" >nul
copy "%~dp0backend\disease_prediction_service.py" "%target_dir%\backend\" >nul

echo [SUCCESS] Backend files copied

REM Install Python dependencies
echo [INFO] Installing Python dependencies...
cd /d "%target_dir%"
pip install -r "%~dp0backend\requirements.txt"
if errorlevel 1 (
    echo [ERROR] Failed to install Python dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Python dependencies installed

REM Frontend installation
echo [INFO] Installing frontend components...

REM Backup existing files
if exist "%target_dir%\frontend\app\get-started\page.tsx" (
    copy "%target_dir%\frontend\app\get-started\page.tsx" "%target_dir%\frontend\app\get-started\page.tsx.backup.%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%" >nul
    echo [INFO] Backed up page.tsx
)

REM Copy frontend files
copy "%~dp0frontend\app\get-started\page.tsx" "%target_dir%\frontend\app\get-started\" >nul

echo [SUCCESS] Frontend files copied

REM Install Node.js dependencies
echo [INFO] Installing Node.js dependencies...
cd /d "%target_dir%\frontend"
npm install lucide-react
if errorlevel 1 (
    echo [ERROR] Failed to install Node.js dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Node.js dependencies installed

REM Copy test files
echo [INFO] Copying test files...
if not exist "%target_dir%\tests" mkdir "%target_dir%\tests"
xcopy "%~dp0test_files\*" "%target_dir%\tests\" /Y >nul
echo [SUCCESS] Test files copied

REM Copy documentation
echo [INFO] Copying documentation...
if not exist "%target_dir%\docs\regional_chatbot" mkdir "%target_dir%\docs\regional_chatbot"
xcopy "%~dp0documentation\*" "%target_dir%\docs\regional_chatbot\" /Y >nul
echo [SUCCESS] Documentation copied

REM Verify installation
echo [INFO] Verifying installation...

if not exist "%target_dir%\backend\api_server.py" (
    echo [ERROR] Required file missing: backend\api_server.py
    pause
    exit /b 1
)

if not exist "%target_dir%\backend\disease_prediction_service.py" (
    echo [ERROR] Required file missing: backend\disease_prediction_service.py
    pause
    exit /b 1
)

if not exist "%target_dir%\frontend\app\get-started\page.tsx" (
    echo [ERROR] Required file missing: frontend\app\get-started\page.tsx
    pause
    exit /b 1
)

if not exist "%target_dir%\AI chatbot\regional.json" (
    echo [ERROR] Required file missing: AI chatbot\regional.json
    pause
    exit /b 1
)

if not exist "%target_dir%\AI chatbot\waterborne_diseases.db" (
    echo [ERROR] Required file missing: AI chatbot\waterborne_diseases.db
    pause
    exit /b 1
)

echo [SUCCESS] All required files present

REM Test backend
echo [INFO] Testing backend installation...
cd /d "%target_dir%\backend"

python -c "import sys; sys.path.append('.'); sys.path.append('../AI chatbot'); from api_server import app; from disease_prediction_service import DiseasePredictor; print('✅ Backend imports successful')" 2>nul
if errorlevel 1 (
    echo [ERROR] Backend installation test failed
    pause
    exit /b 1
)

echo [SUCCESS] Backend installation verified

REM Test frontend
echo [INFO] Testing frontend installation...
cd /d "%target_dir%\frontend"

npm list lucide-react >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Frontend dependency check failed
    pause
    exit /b 1
)

echo [SUCCESS] Frontend dependencies verified

REM Installation complete
echo.
echo [SUCCESS] Regional Language Chatbot installation completed successfully!
echo.
echo 🎉 Installation Summary:
echo ========================
echo ✅ Backend files installed and verified
echo ✅ Frontend files installed and verified
echo ✅ Dependencies installed
echo ✅ Test files copied
echo ✅ Documentation copied
echo.
echo 📋 Next Steps:
echo 1. Start the backend server:
echo    cd "%target_dir%\backend"
echo    python -m uvicorn api_server:app --host 0.0.0.0 --port 8000 --reload
echo.
echo 2. Start the frontend server:
echo    cd "%target_dir%\frontend"
echo    npm run dev
echo.
echo 3. Test the installation:
echo    cd "%target_dir%"
echo    python tests\test_frontend_api.py
echo.
echo 4. Access the chatbot:
echo    http://localhost:3000/get-started
echo.
echo 📚 Documentation available at:
echo    %target_dir%\docs\regional_chatbot\
echo.
echo 🎯 Test with: 'Mujhe pet Mein Dard Hai'
echo.

pause

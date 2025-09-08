#!/bin/bash

# Nirogya News Ticker Startup Script
# ==================================
# This script starts both the backend API server and frontend development server
# for the Nirogya News Ticker system.

echo "🏥 Starting Nirogya News Ticker System"
echo "======================================"

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   (The directory containing 'backend' and 'frontend' folders)"
    exit 1
fi

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env file not found"
    echo "   Creating from template..."
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env from template"
    echo "📝 Edit backend/.env to configure API keys if needed"
fi

# Function to start backend server
start_backend() {
    echo ""
    echo "🔧 Starting Backend Server..."
    echo "=============================="
    
    # Check if virtual environment exists
    if [ ! -d "backend/venv" ]; then
        echo "❌ Virtual environment not found at backend/venv"
        echo "   Please create it first: python -m venv backend/venv"
        exit 1
    fi
    
    # Activate virtual environment and start server
    cd backend
    source venv/bin/activate
    
    echo "📦 Installing/checking dependencies..."
    pip install -q python-dotenv aiohttp fastapi uvicorn
    
    echo "🚀 Starting API server on http://localhost:8002..."
    python -c "
import uvicorn
from api_server import app
print('✅ Backend server starting...')
uvicorn.run(app, host='0.0.0.0', port=8002)
" &
    
    BACKEND_PID=$!
    cd ..
    
    echo "✅ Backend server started (PID: $BACKEND_PID)"
    echo "📡 API available at: http://localhost:8002"
    echo "🔍 Health check: http://localhost:8002/api/news-ticker/health"
    echo "📰 News ticker: http://localhost:8002/api/news-ticker"
}

# Function to start frontend server
start_frontend() {
    echo ""
    echo "🎨 Starting Frontend Server..."
    echo "=============================="
    
    # Check if node_modules exists
    if [ ! -d "frontend/node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        cd frontend
        npm install
        cd ..
    fi
    
    echo "🚀 Starting frontend development server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    echo "✅ Frontend server started (PID: $FRONTEND_PID)"
    echo "🌐 Website available at: http://localhost:3000"
}

# Function to wait for servers to start
wait_for_servers() {
    echo ""
    echo "⏳ Waiting for servers to start..."
    sleep 3
    
    # Test backend
    echo "🔍 Testing backend server..."
    if curl -s http://localhost:8002/api/news-ticker/health > /dev/null; then
        echo "✅ Backend server is responding"
    else
        echo "⚠️  Backend server may still be starting..."
    fi
    
    echo "🔍 Testing frontend proxy..."
    sleep 2
    echo "   (Frontend may take a moment to compile)"
}

# Function to show status and instructions
show_status() {
    echo ""
    echo "🎉 Nirogya News Ticker System Started!"
    echo "====================================="
    echo ""
    echo "📊 Service Status:"
    echo "  🔧 Backend API:  http://localhost:8002"
    echo "  🎨 Frontend Web: http://localhost:3000"
    echo ""
    echo "🧪 Test Endpoints:"
    echo "  📡 Health Check: curl http://localhost:8002/api/news-ticker/health"
    echo "  📰 News Ticker:  curl http://localhost:8002/api/news-ticker"
    echo ""
    echo "🌐 Usage:"
    echo "  1. Visit http://localhost:3000 in your browser"
    echo "  2. Look for the news ticker at the top of the page"
    echo "  3. The ticker will show mock alerts automatically"
    echo ""
    echo "🔧 Configuration:"
    echo "  📝 Edit backend/.env to configure API keys"
    echo "  🎛️  Set USE_MOCK_DATA=false for real API data"
    echo ""
    echo "🛑 To stop servers:"
    echo "  Press Ctrl+C or run: pkill -f 'uvicorn\\|npm'"
    echo ""
    echo "📚 Documentation: See NEWS_TICKER_README.md"
}

# Trap to clean up background processes
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    pkill -f "uvicorn"
    pkill -f "npm"
    echo "✅ Servers stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Main execution
echo "🔍 Checking system requirements..."

# Check Python
if ! command -v python &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.8+"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+"
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm"
    exit 1
fi

echo "✅ System requirements met"

# Start services
start_backend
start_frontend
wait_for_servers
show_status

# Keep script running
echo "🔄 Servers running... Press Ctrl+C to stop"
wait

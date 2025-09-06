#!/bin/bash

# Regional Language Chatbot Installation Script
# ============================================
# 
# This script automates the installation of the Regional Language Chatbot
# into an existing SIH-LLM project.
#
# Usage: ./install.sh [target_project_path]
# Example: ./install.sh /path/to/your/sih-llm-project

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to backup existing files
backup_file() {
    local file="$1"
    if [ -f "$file" ]; then
        cp "$file" "$file.backup.$(date +%Y%m%d_%H%M%S)"
        print_status "Backed up $file"
    fi
}

# Main installation function
install_chatbot() {
    local target_dir="$1"
    local package_dir="$(dirname "$0")"
    
    print_status "Starting Regional Language Chatbot installation..."
    print_status "Target directory: $target_dir"
    print_status "Package directory: $package_dir"
    
    # Verify target directory structure
    print_status "Verifying target project structure..."
    
    if [ ! -d "$target_dir" ]; then
        print_error "Target directory does not exist: $target_dir"
        exit 1
    fi
    
    if [ ! -d "$target_dir/backend" ]; then
        print_error "Backend directory not found in target project"
        exit 1
    fi
    
    if [ ! -d "$target_dir/frontend" ]; then
        print_error "Frontend directory not found in target project"
        exit 1
    fi
    
    if [ ! -d "$target_dir/AI chatbot" ]; then
        print_error "AI chatbot directory not found in target project"
        print_error "Please ensure the original SIH-LLM structure is present"
        exit 1
    fi
    
    print_success "Project structure verified"
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    
    if ! command_exists python3; then
        print_error "Python 3 is required but not installed"
        exit 1
    fi
    
    if ! command_exists pip; then
        print_error "pip is required but not installed"
        exit 1
    fi
    
    if ! command_exists node; then
        print_error "Node.js is required but not installed"
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is required but not installed"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
    
    # Backend installation
    print_status "Installing backend components..."
    
    # Backup existing files
    backup_file "$target_dir/backend/api_server.py"
    backup_file "$target_dir/backend/disease_prediction_service.py"
    
    # Copy backend files
    cp "$package_dir/backend/api_server.py" "$target_dir/backend/"
    cp "$package_dir/backend/disease_prediction_service.py" "$target_dir/backend/"
    
    print_success "Backend files copied"
    
    # Install Python dependencies
    print_status "Installing Python dependencies..."
    cd "$target_dir"
    pip install -r "$package_dir/backend/requirements.txt"
    print_success "Python dependencies installed"
    
    # Frontend installation
    print_status "Installing frontend components..."
    
    # Backup existing files
    backup_file "$target_dir/frontend/app/get-started/page.tsx"
    
    # Copy frontend files
    cp "$package_dir/frontend/app/get-started/page.tsx" "$target_dir/frontend/app/get-started/"
    
    print_success "Frontend files copied"
    
    # Install Node.js dependencies
    print_status "Installing Node.js dependencies..."
    cd "$target_dir/frontend"
    npm install lucide-react
    print_success "Node.js dependencies installed"
    
    # Copy test files
    print_status "Copying test files..."
    mkdir -p "$target_dir/tests"
    cp -r "$package_dir/test_files/"* "$target_dir/tests/"
    print_success "Test files copied"
    
    # Copy documentation
    print_status "Copying documentation..."
    mkdir -p "$target_dir/docs/regional_chatbot"
    cp -r "$package_dir/documentation/"* "$target_dir/docs/regional_chatbot/"
    print_success "Documentation copied"
    
    # Verify installation
    print_status "Verifying installation..."
    
    # Check if required files exist
    required_files=(
        "backend/api_server.py"
        "backend/disease_prediction_service.py"
        "frontend/app/get-started/page.tsx"
        "AI chatbot/regional.json"
        "AI chatbot/waterborne_diseases.db"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$target_dir/$file" ]; then
            print_error "Required file missing: $file"
            exit 1
        fi
    done
    
    print_success "All required files present"
    
    # Test backend
    print_status "Testing backend installation..."
    cd "$target_dir/backend"
    
    # Quick Python import test
    python3 -c "
import sys
sys.path.append('.')
sys.path.append('../AI chatbot')
try:
    from api_server import app
    from disease_prediction_service import DiseasePredictor
    print('✅ Backend imports successful')
except ImportError as e:
    print(f'❌ Backend import error: {e}')
    sys.exit(1)
" || {
        print_error "Backend installation test failed"
        exit 1
    }
    
    print_success "Backend installation verified"
    
    # Test frontend
    print_status "Testing frontend installation..."
    cd "$target_dir/frontend"
    
    # Check if lucide-react is installed
    if npm list lucide-react >/dev/null 2>&1; then
        print_success "Frontend dependencies verified"
    else
        print_error "Frontend dependency check failed"
        exit 1
    fi
    
    # Installation complete
    print_success "Regional Language Chatbot installation completed successfully!"
    
    echo ""
    echo "🎉 Installation Summary:"
    echo "========================"
    echo "✅ Backend files installed and verified"
    echo "✅ Frontend files installed and verified"
    echo "✅ Dependencies installed"
    echo "✅ Test files copied"
    echo "✅ Documentation copied"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Start the backend server:"
    echo "   cd $target_dir/backend"
    echo "   python -m uvicorn api_server:app --host 0.0.0.0 --port 8000 --reload"
    echo ""
    echo "2. Start the frontend server:"
    echo "   cd $target_dir/frontend"
    echo "   npm run dev"
    echo ""
    echo "3. Test the installation:"
    echo "   cd $target_dir"
    echo "   python tests/test_frontend_api.py"
    echo ""
    echo "4. Access the chatbot:"
    echo "   http://localhost:3000/get-started"
    echo ""
    echo "📚 Documentation available at:"
    echo "   $target_dir/docs/regional_chatbot/"
    echo ""
    echo "🎯 Test with: 'Mujhe pet Mein Dard Hai'"
}

# Main script execution
main() {
    echo "🌍 Regional Language Chatbot Installer"
    echo "======================================"
    echo ""
    
    # Get target directory
    if [ $# -eq 0 ]; then
        read -p "Enter the path to your SIH-LLM project: " target_dir
    else
        target_dir="$1"
    fi
    
    # Convert to absolute path
    target_dir="$(cd "$target_dir" && pwd)"
    
    # Confirm installation
    echo ""
    print_warning "This will install the Regional Language Chatbot into:"
    print_warning "$target_dir"
    print_warning ""
    print_warning "Existing files will be backed up with timestamp."
    echo ""
    read -p "Do you want to continue? (y/N): " confirm
    
    if [[ $confirm =~ ^[Yy]$ ]]; then
        install_chatbot "$target_dir"
    else
        print_status "Installation cancelled"
        exit 0
    fi
}

# Run main function
main "$@"

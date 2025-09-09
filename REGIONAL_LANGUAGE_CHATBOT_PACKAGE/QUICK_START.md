# ⚡ Quick Start Guide - Regional Language Chatbot

## 🚀 5-Minute Integration

### Prerequisites
- Existing SIH-LLM project
- Python 3.8+
- Node.js 16+
- 5 minutes of your time

### Step 1: Run Installation Script
```bash
# Linux/Mac
./install.sh /path/to/your/sih-llm-project

# Windows
install.bat C:\path\to\your\sih-llm-project
```

### Step 2: Start Services
```bash
# Terminal 1: Backend
cd your-project/backend
python -m uvicorn api_server:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Frontend
cd your-project/frontend
npm run dev
```

### Step 3: Test
1. Open: http://localhost:3000/get-started
2. Type: "Mujhe pet Mein Dard Hai"
3. See: Perfect disease analysis! 🎉

## ✅ Success Indicators
- Backend shows: "✅ Disease predictor initialized successfully!"
- Frontend loads without errors
- Regional language input works correctly
- UI shows light blue theme

## 🆘 Quick Troubleshooting
- **Import errors**: Check if `AI chatbot/` directory exists
- **CORS errors**: Ensure backend runs on port 8000
- **Voice not working**: Use supported browser (Chrome/Edge)
- **"Unknown" results**: Run `python test_files/debug_translation.py`

## 📚 Full Documentation
- **Complete Guide**: `documentation/IMPLEMENTATION_GUIDE.md`
- **API Reference**: `documentation/API_DOCUMENTATION.md`
- **Troubleshooting**: `documentation/TROUBLESHOOTING.md`

## 🎯 Test Inputs
Try these to verify everything works:
- "Mujhe pet Dard Hai" → Stomach pain analysis
- "Pet mein dard, loose motion, bukhar hai" → Multiple symptoms
- "I have stomach pain and diarrhea" → English input

**🎉 That's it! Your regional language chatbot is ready!**

# 🔧 Troubleshooting Guide - Regional Language Chatbot

## 🚨 Common Issues and Solutions

### Backend Issues

#### 1. Import Errors

**Problem**: `ImportError: No module named 'chatbot'`
```
ModuleNotFoundError: No module named 'chatbot'
```

**Solution**:
```bash
# Check if AI chatbot directory exists
ls -la "AI chatbot/"

# Verify chatbot.py exists
ls -la "AI chatbot/chatbot.py"

# Check Python path
python -c "import sys; print(sys.path)"
```

**Fix**: Ensure the `AI chatbot` directory is in the correct location relative to the backend folder.

---

#### 2. Database Connection Issues

**Problem**: `FileNotFoundError: waterborne_diseases.db`
```
sqlite3.OperationalError: unable to open database file
```

**Solution**:
```bash
# Check database file exists
ls -la "AI chatbot/waterborne_diseases.db"

# Check file permissions
chmod 644 "AI chatbot/waterborne_diseases.db"
```

**Fix**: Ensure the database file exists and has proper read permissions.

---

#### 3. Regional Language File Missing

**Problem**: `FileNotFoundError: regional.json`
```
FileNotFoundError: [Errno 2] No such file or directory: 'regional.json'
```

**Solution**:
```bash
# Check if regional.json exists
ls -la "AI chatbot/regional.json"

# Verify JSON format
python -c "import json; print(json.load(open('AI chatbot/regional.json')))"
```

**Fix**: Ensure `regional.json` exists in the `AI chatbot` directory with valid JSON format.

---

#### 4. Dependency Issues

**Problem**: Missing Python packages
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solution**:
```bash
# Install all dependencies
pip install -r REGIONAL_LANGUAGE_CHATBOT_PACKAGE/backend/requirements.txt

# Check installed packages
pip list | grep fastapi
pip list | grep uvicorn
```

---

#### 5. Port Already in Use

**Problem**: `OSError: [Errno 48] Address already in use`

**Solution**:
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process (replace PID)
kill -9 <PID>

# Or use a different port
uvicorn api_server:app --port 8001
```

### Frontend Issues

#### 1. Module Not Found

**Problem**: `Module not found: Can't resolve 'lucide-react'`

**Solution**:
```bash
cd frontend
npm install lucide-react

# Verify installation
npm list lucide-react
```

---

#### 2. Speech Recognition Not Working

**Problem**: Voice input button doesn't work

**Possible Causes & Solutions**:

1. **Browser Compatibility**:
   ```javascript
   // Check browser support
   if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
     console.log('Speech recognition not supported');
   }
   ```

2. **HTTPS Required** (in production):
   - Speech recognition requires HTTPS in production
   - Use `http://localhost` for development

3. **Microphone Permissions**:
   - Check browser microphone permissions
   - Allow microphone access when prompted

---

#### 3. API Connection Failed

**Problem**: `Failed to fetch` or CORS errors

**Solution**:
```bash
# Check if backend is running
curl http://localhost:8000/health

# Check CORS configuration in api_server.py
# Ensure frontend URL is in allow_origins
```

**Fix**: Verify backend is running on port 8000 and CORS is properly configured.

---

#### 4. Build Errors

**Problem**: Next.js build fails

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### Regional Language Issues

#### 1. Translation Not Working

**Problem**: Regional language inputs return "Unknown"

**Debug Steps**:
```bash
# Run translation debug script
python REGIONAL_LANGUAGE_CHATBOT_PACKAGE/test_files/debug_translation.py

# Check specific input
python -c "
from disease_prediction_service import DiseasePredictor
predictor = DiseasePredictor()
print(predictor._translate_regional_terms('Mujhe pet Mein Dard Hai'))
"
```

**Common Fixes**:
1. Check if `regional.json` is loaded correctly
2. Verify translation patterns in `disease_prediction_service.py`
3. Ensure case sensitivity is handled

---

#### 2. Disease Prediction Returns Zero Probability

**Problem**: Enhanced prediction returns 0% confidence

**Debug**:
```python
# Test disease prediction directly
from disease_prediction_service import DiseasePredictor
predictor = DiseasePredictor()
result = predictor.predict_disease_type("stomach pain")
print(result)
```

**Fix**: Check if symptom patterns match the disease knowledge base.

---

#### 3. Severity Assessment Shows "Unknown"

**Problem**: API returns "Unknown" severity

**Debug Steps**:
1. Check if enhanced prediction is working
2. Verify API logic for using enhanced prediction
3. Test with known working inputs

**Solution**: Run the test suite to identify the specific issue:
```bash
python REGIONAL_LANGUAGE_CHATBOT_PACKAGE/test_files/test_frontend_api.py
```

### UI/UX Issues

#### 1. Colors Not Matching

**Problem**: UI doesn't show light blue theme

**Solution**:
```bash
# Check Tailwind configuration
cat frontend/tailwind.config.ts | grep primary

# Rebuild CSS
npm run build
```

**Fix**: Ensure `primary-50: '#B3EBF2'` is defined in Tailwind config.

---

#### 2. Icons Not Displaying

**Problem**: Voice icons not showing

**Solution**:
```bash
# Check lucide-react installation
npm list lucide-react

# Verify import in page.tsx
grep "Volume2" frontend/app/get-started/page.tsx
```

---

#### 3. Responsive Design Issues

**Problem**: Layout breaks on mobile

**Solution**: Check CSS classes and ensure responsive utilities are used:
```css
/* Use responsive classes */
grid-cols-1 md:grid-cols-2
text-sm md:text-base
```

### Performance Issues

#### 1. Slow API Responses

**Problem**: API takes too long to respond

**Debug**:
```bash
# Test API response time
time curl -X POST http://localhost:8000/analyze-symptoms \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","symptoms":"test","audio_input":false}'
```

**Solutions**:
- Optimize database queries
- Cache regional translations
- Use connection pooling

---

#### 2. High Memory Usage

**Problem**: Backend uses too much memory

**Solutions**:
- Restart the backend service
- Check for memory leaks in disease prediction
- Optimize data structures

### Testing Issues

#### 1. Test Files Fail

**Problem**: Test scripts return errors

**Solution**:
```bash
# Check test file paths
python -c "import sys; sys.path.append('backend'); from disease_prediction_service import DiseasePredictor"

# Run tests individually
python REGIONAL_LANGUAGE_CHATBOT_PACKAGE/test_files/test_regional_language.py
```

---

#### 2. API Tests Fail

**Problem**: API endpoint tests fail

**Debug**:
```bash
# Check if backend is running
curl http://localhost:8000/health

# Test with simple input
curl -X POST http://localhost:8000/analyze-symptoms \
  -H "Content-Type: application/json" \
  -d '{"name":"","symptoms":"test","audio_input":false}'
```

## 🔍 Debugging Tools

### 1. Backend Debugging
```python
# Add debug logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Test components individually
from disease_prediction_service import DiseasePredictor
predictor = DiseasePredictor()
```

### 2. Frontend Debugging
```javascript
// Add console logging
console.log('API Response:', result);

// Check network tab in browser dev tools
// Verify API calls are being made correctly
```

### 3. Database Debugging
```bash
# Check database contents
sqlite3 "AI chatbot/waterborne_diseases.db" ".tables"
sqlite3 "AI chatbot/waterborne_diseases.db" "SELECT * FROM diseases LIMIT 5;"
```

## 📞 Getting Help

### 1. Check Logs
- Backend: Check console output for error messages
- Frontend: Check browser console for JavaScript errors
- Network: Check browser network tab for API call failures

### 2. Run Diagnostic Commands
```bash
# Backend health check
curl http://localhost:8000/health

# Test regional language
python REGIONAL_LANGUAGE_CHATBOT_PACKAGE/test_files/debug_translation.py

# Frontend build check
cd frontend && npm run build
```

### 3. Verify File Structure
```bash
# Check all required files exist
ls -la backend/api_server.py
ls -la backend/disease_prediction_service.py
ls -la frontend/app/get-started/page.tsx
ls -la "AI chatbot/regional.json"
ls -la "AI chatbot/waterborne_diseases.db"
```

## ✅ Quick Fix Checklist

When something isn't working:

- [ ] Backend server is running on port 8000
- [ ] Frontend server is running on port 3000
- [ ] All dependencies are installed
- [ ] Database file exists and is accessible
- [ ] Regional.json file exists and is valid
- [ ] CORS is properly configured
- [ ] Browser supports speech recognition (if using voice)
- [ ] Microphone permissions are granted
- [ ] No port conflicts
- [ ] All test files pass

## 🎯 Success Indicators

Everything is working correctly when:

- ✅ `/health` endpoint returns healthy status
- ✅ Regional language inputs get proper disease predictions
- ✅ UI shows light blue theme consistently
- ✅ Voice input works in supported browsers
- ✅ All test files pass without errors
- ✅ API responses are fast (< 1 second)
- ✅ No console errors in browser or backend

---

**Last Updated**: December 2024
**Version**: 1.0.0

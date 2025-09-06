# 📡 API Documentation - Regional Language Chatbot

## 🌐 Base URL
```
http://localhost:8000
```

## 🔗 Endpoints

### 1. Health Check
**GET** `/health`

Check if the API server and services are running properly.

**Response:**
```json
{
  "status": "healthy",
  "chatbot_available": true,
  "disease_predictor_available": true
}
```

### 2. Root Information
**GET** `/`

Get basic API information and available endpoints.

**Response:**
```json
{
  "message": "Waterborne Disease Chatbot API",
  "version": "1.0.0",
  "endpoints": {
    "analyze_symptoms": "/analyze-symptoms",
    "health": "/health"
  }
}
```

### 3. Analyze Symptoms (Main Endpoint)
**POST** `/analyze-symptoms`

Analyze user symptoms and provide disease predictions with recommendations.

#### Request Body
```json
{
  "name": "string",           // User's name (can be empty)
  "symptoms": "string",       // Symptom description (English/Hindi/Hinglish)
  "audio_input": boolean      // Whether input came from speech recognition
}
```

#### Example Requests

**English Input:**
```json
{
  "name": "John Doe",
  "symptoms": "I have stomach pain and diarrhea",
  "audio_input": false
}
```

**Hindi Input:**
```json
{
  "name": "राम",
  "symptoms": "Mujhe pet Mein Dard Hai",
  "audio_input": true
}
```

**Complex Regional Input:**
```json
{
  "name": "Test User",
  "symptoms": "Pet mein dard, loose motion, bukhar hai",
  "audio_input": false
}
```

#### Response Format

**Success Response (200):**
```json
{
  "status": "success",
  "message": null,
  "diseases": [
    {
      "id": 999,
      "name": "Acute Diarrheal Disease",
      "confidence": 1.0,
      "description": "AI-predicted condition based on symptom analysis",
      "matching_symptoms": ["stomach pain"],
      "transmission": "Contaminated water/food",
      "severity": "Moderate",
      "treatment": "ORS, antibiotics if severe",
      "prevention": "Follow general health precautions",
      "region_specific_info": "Based on regional symptom analysis"
    }
  ],
  "disclaimer": "This is an AI assessment tool. Please consult a healthcare professional for accurate diagnosis.",
  "user_name": "Test User",
  "severity_assessment": "Moderate Risk - Consult Healthcare Provider Soon",
  "recommendations": [
    "🍵 Try ginger tea or warm water for stomach comfort",
    "🥗 Avoid spicy, oily, or heavy foods",
    "💧 Boil drinking water for at least 10 minutes",
    "🧼 Wash hands frequently with soap and clean water",
    "🏥 Contact nearest PHC (Primary Health Centre) if symptoms worsen"
  ],
  "emergency_contacts": {
    "ambulance": "108",
    "health_helpline": "104",
    "disaster_management": "1070"
  }
}
```

**No Match Response (200):**
```json
{
  "status": "no_match",
  "message": "Could not identify specific diseases based on the symptoms provided",
  "diseases": [],
  "disclaimer": "This is an AI assessment tool. Please consult a healthcare professional for accurate diagnosis.",
  "user_name": "Test User",
  "severity_assessment": "Unknown",
  "recommendations": [
    "Consult a healthcare professional for proper diagnosis",
    "Monitor symptoms and seek immediate care if they worsen",
    "Stay hydrated and rest"
  ],
  "emergency_contacts": {
    "ambulance": "108",
    "health_helpline": "104",
    "disaster_management": "1070"
  }
}
```

**Error Response (500):**
```json
{
  "detail": "Internal server error: [error description]"
}
```

## 🔍 Response Field Descriptions

### Disease Object
- **id**: Unique identifier for the disease
- **name**: Disease name
- **confidence**: Confidence score (0.0 to 1.0)
- **description**: Brief description of the condition
- **matching_symptoms**: List of symptoms that matched
- **transmission**: How the disease spreads
- **severity**: Severity level (Low/Moderate/High)
- **treatment**: Recommended treatment approach
- **prevention**: Prevention measures
- **region_specific_info**: Regional context information

### Severity Assessment Levels
- **"High Risk - Seek Immediate Medical Attention"**: Urgent medical care needed
- **"Moderate Risk - Consult Healthcare Provider Soon"**: See doctor within 24-48 hours
- **"Low to Moderate Risk - Monitor Symptoms Closely"**: Watch symptoms, see doctor if worsening
- **"Low Risk - General Precautions Advised"**: Basic care and monitoring
- **"Mild Symptoms - Basic Care Recommended"**: Rest and basic care
- **"Unknown"**: Unable to assess (fallback)

## 🌍 Regional Language Support

### Supported Input Patterns
The API automatically translates these Hindi/Hinglish patterns:

| Hindi/Hinglish | English Translation |
|----------------|-------------------|
| "Mujhe pet Mein Dard Hai" | "I have stomach pain" |
| "Mujhe pet Dard Hai" | "I have stomach pain" |
| "Pet mein dard" | "Stomach pain" |
| "Pet dard hai" | "Stomach pain" |
| "Loose motion" | "Diarrhea" |
| "Bukhar hai" | "Fever" |
| "Ulti aa rahi hai" | "Vomiting" |
| "Paani jaisa" | "Watery" |

### Regional Terms Database
The system uses `regional.json` for additional term mappings:
- 50+ Hindi medical terms
- Regional variations for Northeast India
- Cultural context for recommendations

## 🧪 Testing the API

### Using cURL
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test symptom analysis
curl -X POST http://localhost:8000/analyze-symptoms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "symptoms": "Mujhe pet Mein Dard Hai",
    "audio_input": false
  }'
```

### Using Python
```python
import requests

# Test API
response = requests.post('http://localhost:8000/analyze-symptoms', json={
    'name': 'Test User',
    'symptoms': 'Mujhe pet Mein Dard Hai',
    'audio_input': False
})

print(response.json())
```

### Using JavaScript/Frontend
```javascript
const response = await fetch('http://localhost:8000/analyze-symptoms', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Test User',
    symptoms: 'Mujhe pet Mein Dard Hai',
    audio_input: false
  }),
});

const result = await response.json();
console.log(result);
```

## ⚠️ Error Handling

### Common Error Scenarios

1. **Service Unavailable (500)**
   - Chatbot service not initialized
   - Database connection failed
   - Missing dependencies

2. **Invalid Input (422)**
   - Missing required fields
   - Invalid data types
   - Malformed JSON

3. **CORS Errors**
   - Frontend not running on allowed origins
   - Missing CORS headers

### Error Response Format
```json
{
  "detail": "Error description",
  "type": "error_type",
  "code": "error_code"
}
```

## 🔧 Configuration

### CORS Settings
The API is configured to accept requests from:
- `http://localhost:3000` (Next.js development)
- `http://127.0.0.1:3000` (Alternative localhost)

### Rate Limiting
Currently no rate limiting is implemented. For production, consider adding:
- Request rate limits per IP
- Authentication for API access
- Usage monitoring

## 📊 Performance

### Response Times
- Simple queries: ~200-500ms
- Complex regional language queries: ~500-1000ms
- Database queries: ~100-300ms

### Optimization Tips
- Cache regional translations
- Use connection pooling for database
- Implement response caching for common queries
- Add CDN for static assets

## 🔒 Security Considerations

### Input Validation
- All inputs are validated and sanitized
- SQL injection protection through ORM
- XSS protection in responses

### Production Recommendations
- Add authentication/authorization
- Implement rate limiting
- Use HTTPS only
- Add request logging
- Monitor for abuse patterns

## 📈 Monitoring

### Health Checks
Regular monitoring of:
- `/health` endpoint status
- Database connectivity
- Service response times
- Error rates

### Logging
The API logs:
- Request/response details
- Error messages
- Performance metrics
- Regional language processing results

---

**API Version**: 1.0.0
**Last Updated**: December 2024
**Documentation**: Complete

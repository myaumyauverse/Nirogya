#!/usr/bin/env python3
"""
Waterborne Disease Chatbot API Server
====================================

FastAPI backend service that integrates the AI chatbot with disease prediction
and provides endpoints for the frontend application.

Features:
- Symptom analysis using the existing chatbot
- Disease prediction with probability scores
- Speech-to-text integration support
- Regional context for Northeast India
- Enhanced regional language processing
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import sys
import os
import json
import logging

# Add the AI chatbot directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'AI chatbot'))

try:
    from chatbot import WaterborneDiseaseChatbot, create_web_api_response
except ImportError as e:
    print(f"Error importing chatbot: {e}")
    print("Make sure the chatbot.py file is in the AI chatbot directory")

# Add the backend directory to path for disease prediction
sys.path.append(os.path.dirname(__file__))

# Add the data directory to path for accessing existing data services
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'data'))

try:
    from disease_prediction_service import DiseasePredictor
except ImportError as e:
    print(f"Warning: Disease prediction service not available: {e}")
    DiseasePredictor = None

# Try to import additional data services if available
try:
    import correlation_api
    import water_quality_assessment
    print("✅ Additional data services loaded successfully")
except ImportError as e:
    print(f"ℹ️ Additional data services not loaded: {e}")
    print("This is normal if you only need basic chatbot functionality")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Waterborne Disease Chatbot API",
    description="AI-powered chatbot for waterborne disease analysis and prediction",
    version="1.0.0"
)

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for services
chatbot = None
chatbot_db_path = None
disease_predictor = None

# Pydantic models for request/response
class SymptomAnalysisRequest(BaseModel):
    name: str
    symptoms: str
    audio_input: bool = False

class DiseaseMatch(BaseModel):
    id: int
    name: str
    confidence: float
    description: str
    matching_symptoms: List[str]
    transmission: str
    severity: str
    treatment: str
    prevention: str
    region_specific_info: str

class SymptomAnalysisResponse(BaseModel):
    status: str
    message: Optional[str] = None
    diseases: List[DiseaseMatch]
    disclaimer: str
    user_name: str
    severity_assessment: str
    recommendations: List[str]
    emergency_contacts: Dict[str, str]

@app.on_event("startup")
async def startup_event():
    """Initialize the chatbot and disease predictor on startup"""
    global chatbot, chatbot_db_path, disease_predictor
    
    try:
        # Initialize the chatbot
        chatbot_db_path = os.path.join(os.path.dirname(__file__), '..', 'AI chatbot', 'waterborne_diseases.db')
        chatbot = WaterborneDiseaseChatbot(chatbot_db_path)
        logger.info("Chatbot initialized successfully")
        
        # Initialize the disease predictor
        if DiseasePredictor:
            disease_predictor = DiseasePredictor()
            logger.info("Disease predictor initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize services: {e}")

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Waterborne Disease Chatbot API",
        "version": "1.0.0",
        "endpoints": {
            "analyze_symptoms": "/analyze-symptoms",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "chatbot_available": chatbot is not None,
        "disease_predictor_available": disease_predictor is not None
    }

@app.post("/analyze-symptoms", response_model=SymptomAnalysisResponse)
async def analyze_symptoms(request: SymptomAnalysisRequest):
    """
    Analyze user symptoms and provide disease predictions with recommendations
    """
    try:
        if not chatbot:
            raise HTTPException(status_code=500, detail="Chatbot service not available")
        
        # Get disease analysis from chatbot
        chatbot_response = create_web_api_response(request.symptoms, chatbot_db_path)
        
        # Enhanced disease prediction with regional language support (try this first)
        enhanced_prediction = None
        if disease_predictor:
            try:
                enhanced_prediction = disease_predictor.predict_disease_type(request.symptoms)
                logger.info(f"Enhanced prediction completed for symptoms: {request.symptoms}")
            except Exception as e:
                logger.warning(f"Enhanced prediction failed: {e}")
        
        # If both original chatbot and enhanced prediction fail, return no match
        if chatbot_response["status"] == "no_match" and (not enhanced_prediction or enhanced_prediction.get('probability', 0) == 0):
            return SymptomAnalysisResponse(
                status="no_match",
                message="Could not identify specific diseases based on the symptoms provided",
                diseases=[],
                disclaimer="This is an AI assessment tool. Please consult a healthcare professional for accurate diagnosis.",
                user_name=request.name,
                severity_assessment="Unknown",
                recommendations=[
                    "Consult a healthcare professional for proper diagnosis",
                    "Monitor symptoms and seek immediate care if they worsen",
                    "Stay hydrated and rest"
                ],
                emergency_contacts={
                    "ambulance": "108",
                    "health_helpline": "104",
                    "disaster_management": "1070"
                }
            )
        
        # Convert chatbot diseases to our response format
        diseases = []
        if chatbot_response["status"] != "no_match":
            for disease_data in chatbot_response["diseases"]:
                diseases.append(DiseaseMatch(
                    id=disease_data["id"],
                    name=disease_data["name"],
                    confidence=disease_data["confidence"],
                    description=disease_data["description"],
                    matching_symptoms=disease_data["matching_symptoms"],
                    transmission=disease_data["transmission"],
                    severity=disease_data["severity"],
                    treatment=disease_data["treatment"],
                    prevention=disease_data["prevention"],
                    region_specific_info=disease_data["region_specific_info"]
                ))
        
        # If original chatbot found no diseases but enhanced prediction did, use enhanced prediction
        if not diseases and enhanced_prediction and enhanced_prediction.get('probability', 0) > 0:
            # Create a disease match from enhanced prediction
            diseases.append(DiseaseMatch(
                id=999,  # Special ID for enhanced predictions
                name=enhanced_prediction.get('predicted_disease', 'Unknown'),
                confidence=enhanced_prediction.get('probability', 0) / 100,  # Convert to 0-1 scale
                description=f"AI-predicted condition based on symptom analysis",
                matching_symptoms=enhanced_prediction.get('matched_symptoms', []),
                transmission=enhanced_prediction.get('disease_info', {}).get('transmission', 'Unknown'),
                severity=enhanced_prediction.get('disease_info', {}).get('severity', 'Unknown'),
                treatment=enhanced_prediction.get('disease_info', {}).get('treatment', 'Consult healthcare provider'),
                prevention="Follow general health precautions",
                region_specific_info="Based on regional symptom analysis"
            ))
        
        # Determine overall severity assessment
        max_confidence = max([d.confidence for d in diseases]) if diseases else 0
        if enhanced_prediction and 'error' not in enhanced_prediction:
            severity_assessment = disease_predictor.get_severity_assessment(enhanced_prediction, request.symptoms)
        else:
            severity_assessment = get_severity_assessment(diseases, max_confidence)

        # Generate personalized recommendations
        if enhanced_prediction and 'error' not in enhanced_prediction:
            recommendations = disease_predictor.get_health_recommendations(enhanced_prediction, request.symptoms)
        else:
            recommendations = generate_recommendations(diseases, request.symptoms)
        
        return SymptomAnalysisResponse(
            status="success",
            diseases=diseases,
            disclaimer=chatbot_response.get("disclaimer", "This is an AI assessment tool. Please consult a healthcare professional for accurate diagnosis."),
            user_name=request.name,
            severity_assessment=severity_assessment,
            recommendations=recommendations,
            emergency_contacts={
                "ambulance": "108",
                "health_helpline": "104",
                "disaster_management": "1070"
            }
        )
        
    except Exception as e:
        logger.error(f"Error analyzing symptoms: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

def get_severity_assessment(diseases: List[DiseaseMatch], max_confidence: float) -> str:
    """Determine overall severity assessment based on diseases and confidence"""
    if not diseases:
        return "Unknown"
    
    # Check for high-severity diseases
    high_severity_keywords = ["life-threatening", "severe", "emergency", "critical"]
    moderate_severity_keywords = ["moderate", "concerning"]
    
    for disease in diseases:
        severity_text = disease.severity.lower()
        if any(keyword in severity_text for keyword in high_severity_keywords):
            if max_confidence > 0.7:
                return "High Risk - Seek Immediate Medical Attention"
            else:
                return "Moderate Risk - Consult Healthcare Provider Soon"
    
    if max_confidence > 0.8:
        return "Moderate Risk - Monitor Symptoms Closely"
    elif max_confidence > 0.5:
        return "Low to Moderate Risk - Basic Care Recommended"
    else:
        return "Low Risk - General Precautions Advised"

def generate_recommendations(diseases: List[DiseaseMatch], symptoms: str) -> List[str]:
    """Generate health recommendations based on diseases and symptoms"""
    recommendations = []
    
    if not diseases:
        return [
            "Stay hydrated with clean, boiled water",
            "Rest and monitor symptoms",
            "Consult healthcare professional if symptoms persist"
        ]
    
    # General recommendations based on waterborne diseases
    recommendations.extend([
        "💧 Boil drinking water for at least 10 minutes",
        "🧼 Wash hands frequently with soap and clean water",
        "🍚 Eat freshly cooked, hot food",
        "🚫 Avoid raw or undercooked food",
        "🏥 Contact nearest PHC (Primary Health Centre) if symptoms worsen"
    ])
    
    # Symptom-specific recommendations
    symptoms_lower = symptoms.lower()
    if "diarrhea" in symptoms_lower or "loose" in symptoms_lower:
        recommendations.insert(0, "🚰 Drink ORS (Oral Rehydration Solution) to prevent dehydration")
    
    if "fever" in symptoms_lower:
        recommendations.append("🌡️ Monitor temperature and take fever reducers if needed")
    
    if "vomiting" in symptoms_lower:
        recommendations.append("💧 Take small, frequent sips of clear fluids")
    
    return recommendations[:7]  # Limit to 7 recommendations

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

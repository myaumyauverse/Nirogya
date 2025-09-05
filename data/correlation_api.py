#!/usr/bin/env python3
"""
Disease-Water Quality Correlation Analysis API
==============================================
A comprehensive Flask API for integrated disease-water quality correlation analysis.

Features:
- Complete integrated analysis with future predictions
- Water quality assessment endpoint
- Disease prediction endpoint
- Future outbreak trend prediction
- Batch analysis capabilities
- Real-time correlation scoring

Usage:
    python correlation_api.py

API Endpoints:
    POST /api/analyze - Complete integrated analysis
    POST /api/water-quality - Water quality assessment only
    POST /api/disease-prediction - Disease prediction only
    POST /api/future-trends - Future outbreak predictions
    POST /api/batch-analyze - Batch analysis
    GET /api/health - Health check
    GET /api/docs - API documentation

Author: SIH Project Team
Date: September 5, 2025
"""

import os
import sys
import json
from datetime import datetime
from typing import Dict, List, Any
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import warnings
warnings.filterwarnings('ignore')

# Add current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import our correlation analysis system
from disease_water_correlation import IntegratedHealthAnalyzer

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Global analyzer instance
analyzer = None

def initialize_analyzer():
    """Initialize the health analyzer"""
    global analyzer
    try:
        analyzer = IntegratedHealthAnalyzer()
        print("✅ Integrated Health Analyzer initialized successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to initialize analyzer: {e}")
        return False

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    global analyzer
    
    status = "healthy" if analyzer is not None else "unhealthy"
    
    return jsonify({
        "status": status,
        "service": "Disease-Water Quality Correlation API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "ml_models_loaded": analyzer is not None
    })

@app.route('/api/analyze', methods=['POST'])
def complete_analysis():
    """
    Complete integrated disease-water quality correlation analysis
    
    Expected JSON payload:
    {
        "outbreak_data": {
            "No_of_Cases": 150,
            "Northeast_State": 2,
            "Start_of_Outbreak_Month": 7
        },
        "water_params": {
            "ph": 8.5,
            "dissolved_oxygen": 3.0,
            "bod": 5.0,
            "nitrate_n": 12.0,
            "fecal_coliform": 80.0,
            "total_coliform": 450.0,
            "temperature": 28.0
        },
        "include_future": true,
        "months_ahead": 3
    }
    """
    try:
        if not analyzer:
            return jsonify({"error": "Service not properly initialized"}), 500
        
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        # Validate required fields
        if 'outbreak_data' not in data or 'water_params' not in data:
            return jsonify({"error": "Missing required fields: outbreak_data and water_params"}), 400
        
        outbreak_data = data['outbreak_data']
        water_params = data['water_params']
        include_future = data.get('include_future', True)
        
        # Validate outbreak data
        required_outbreak_fields = ['No_of_Cases', 'Northeast_State', 'Start_of_Outbreak_Month']
        for field in required_outbreak_fields:
            if field not in outbreak_data:
                return jsonify({"error": f"Missing required outbreak field: {field}"}), 400
        
        # Validate water parameters
        required_water_fields = ['ph', 'dissolved_oxygen', 'bod', 'nitrate_n', 'fecal_coliform', 'total_coliform']
        for field in required_water_fields:
            if field not in water_params:
                return jsonify({"error": f"Missing required water parameter: {field}"}), 400
        
        # Perform analysis
        analysis = analyzer.analyze_integrated_scenario(
            outbreak_data, 
            water_params, 
            include_future=include_future
        )
        
        # Format response
        response = {
            "success": True,
            "analysis": analysis,
            "input_data": {
                "outbreak_data": outbreak_data,
                "water_params": water_params
            },
            "metadata": {
                "analysis_timestamp": datetime.now().isoformat(),
                "service_version": "1.0.0",
                "include_future_predictions": include_future
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/api/water-quality', methods=['POST'])
def water_quality_assessment():
    """
    Water quality assessment endpoint
    
    Expected JSON payload:
    {
        "water_params": {
            "ph": 8.5,
            "dissolved_oxygen": 3.0,
            "bod": 5.0,
            "nitrate_n": 12.0,
            "fecal_coliform": 80.0,
            "total_coliform": 450.0,
            "temperature": 28.0
        }
    }
    """
    try:
        if not analyzer:
            return jsonify({"error": "Service not properly initialized"}), 500
        
        data = request.get_json()
        
        if not data or 'water_params' not in data:
            return jsonify({"error": "Missing required field: water_params"}), 400
        
        water_params = data['water_params']
        
        # Perform water quality assessment
        assessment = analyzer.assess_water_quality_risk(water_params)
        
        response = {
            "success": True,
            "water_assessment": assessment,
            "input_params": water_params,
            "timestamp": datetime.now().isoformat()
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/api/disease-prediction', methods=['POST'])
def disease_prediction():
    """
    Disease prediction endpoint
    
    Expected JSON payload:
    {
        "outbreak_data": {
            "No_of_Cases": 150,
            "Northeast_State": 2,
            "Start_of_Outbreak_Month": 7
        }
    }
    """
    try:
        if not analyzer:
            return jsonify({"error": "Service not properly initialized"}), 500
        
        data = request.get_json()
        
        if not data or 'outbreak_data' not in data:
            return jsonify({"error": "Missing required field: outbreak_data"}), 400
        
        outbreak_data = data['outbreak_data']
        
        # Perform disease prediction
        prediction = analyzer.predict_disease_from_outbreak(outbreak_data)
        
        response = {
            "success": True,
            "disease_prediction": prediction,
            "input_data": outbreak_data,
            "timestamp": datetime.now().isoformat()
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/api/future-trends', methods=['POST'])
def future_trends():
    """
    Future outbreak trends prediction endpoint
    
    Expected JSON payload:
    {
        "outbreak_data": {
            "No_of_Cases": 150,
            "Northeast_State": 2,
            "Start_of_Outbreak_Month": 7
        },
        "water_params": {
            "ph": 8.5,
            "dissolved_oxygen": 3.0,
            "bod": 5.0,
            "nitrate_n": 12.0,
            "fecal_coliform": 80.0,
            "total_coliform": 450.0,
            "temperature": 28.0
        },
        "months_ahead": 3
    }
    """
    try:
        if not analyzer:
            return jsonify({"error": "Service not properly initialized"}), 500
        
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        if 'outbreak_data' not in data or 'water_params' not in data:
            return jsonify({"error": "Missing required fields: outbreak_data and water_params"}), 400
        
        outbreak_data = data['outbreak_data']
        water_params = data['water_params']
        months_ahead = data.get('months_ahead', 3)
        
        # Perform future trend prediction
        future_predictions = analyzer.predict_future_outbreak_trend(
            outbreak_data, 
            water_params, 
            months_ahead=months_ahead
        )
        
        response = {
            "success": True,
            "future_predictions": future_predictions,
            "input_data": {
                "outbreak_data": outbreak_data,
                "water_params": water_params,
                "months_ahead": months_ahead
            },
            "timestamp": datetime.now().isoformat()
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/api/batch-analyze', methods=['POST'])
def batch_analysis():
    """
    Batch analysis endpoint for multiple scenarios
    
    Expected JSON payload:
    {
        "scenarios": [
            {
                "id": "scenario_1",
                "outbreak_data": {...},
                "water_params": {...}
            },
            {
                "id": "scenario_2", 
                "outbreak_data": {...},
                "water_params": {...}
            }
        ],
        "include_future": true
    }
    """
    try:
        if not analyzer:
            return jsonify({"error": "Service not properly initialized"}), 500
        
        data = request.get_json()
        
        if not data or 'scenarios' not in data:
            return jsonify({"error": "Missing required field: scenarios"}), 400
        
        scenarios = data['scenarios']
        include_future = data.get('include_future', True)
        
        if not isinstance(scenarios, list):
            return jsonify({"error": "Scenarios must be a list"}), 400
        
        results = []
        
        for i, scenario in enumerate(scenarios):
            try:
                scenario_id = scenario.get('id', f'scenario_{i+1}')
                outbreak_data = scenario['outbreak_data']
                water_params = scenario['water_params']
                
                # Perform analysis for this scenario
                analysis = analyzer.analyze_integrated_scenario(
                    outbreak_data, 
                    water_params, 
                    include_future=include_future
                )
                
                results.append({
                    "scenario_id": scenario_id,
                    "success": True,
                    "analysis": analysis,
                    "input_data": {
                        "outbreak_data": outbreak_data,
                        "water_params": water_params
                    }
                })
                
            except Exception as e:
                results.append({
                    "scenario_id": scenario.get('id', f'scenario_{i+1}'),
                    "success": False,
                    "error": str(e)
                })
        
        response = {
            "success": True,
            "batch_results": results,
            "total_scenarios": len(scenarios),
            "successful_analyses": len([r for r in results if r['success']]),
            "timestamp": datetime.now().isoformat()
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/api/docs', methods=['GET'])
def api_documentation():
    """API documentation endpoint"""
    
    docs_html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Disease-Water Quality Correlation API Documentation</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
            h1, h2, h3 { color: #2c3e50; }
            .endpoint { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .method { color: #fff; padding: 3px 8px; border-radius: 3px; font-weight: bold; }
            .post { background: #28a745; }
            .get { background: #007bff; }
            pre { background: #f1f1f1; padding: 10px; border-radius: 3px; overflow-x: auto; }
            .example { background: #e9ecef; padding: 10px; margin: 10px 0; border-radius: 3px; }
        </style>
    </head>
    <body>
        <h1>🏥💧 Disease-Water Quality Correlation API</h1>
        <p>A comprehensive API for integrated disease-water quality correlation analysis with ML-powered predictions.</p>
        
        <h2>📊 Available Endpoints</h2>
        
        <div class="endpoint">
            <h3><span class="method get">GET</span> /api/health</h3>
            <p>Health check endpoint to verify service status.</p>
            <div class="example">
                <strong>Response:</strong>
                <pre>{"status": "healthy", "service": "Disease-Water Quality Correlation API", "ml_models_loaded": true}</pre>
            </div>
        </div>
        
        <div class="endpoint">
            <h3><span class="method post">POST</span> /api/analyze</h3>
            <p>Complete integrated analysis with disease prediction, water quality assessment, correlation analysis, and future trends.</p>
            <div class="example">
                <strong>Request Body:</strong>
                <pre>{
  "outbreak_data": {
    "No_of_Cases": 150,
    "Northeast_State": 2,
    "Start_of_Outbreak_Month": 7
  },
  "water_params": {
    "ph": 8.5,
    "dissolved_oxygen": 3.0,
    "bod": 5.0,
    "nitrate_n": 12.0,
    "fecal_coliform": 80.0,
    "total_coliform": 450.0,
    "temperature": 28.0
  },
  "include_future": true
}</pre>
            </div>
        </div>
        
        <div class="endpoint">
            <h3><span class="method post">POST</span> /api/water-quality</h3>
            <p>Water quality assessment only.</p>
            <div class="example">
                <strong>Request Body:</strong>
                <pre>{
  "water_params": {
    "ph": 8.5,
    "dissolved_oxygen": 3.0,
    "bod": 5.0,
    "nitrate_n": 12.0,
    "fecal_coliform": 80.0,
    "total_coliform": 450.0,
    "temperature": 28.0
  }
}</pre>
            </div>
        </div>
        
        <div class="endpoint">
            <h3><span class="method post">POST</span> /api/disease-prediction</h3>
            <p>Disease outbreak prediction using ML models.</p>
            <div class="example">
                <strong>Request Body:</strong>
                <pre>{
  "outbreak_data": {
    "No_of_Cases": 150,
    "Northeast_State": 2,
    "Start_of_Outbreak_Month": 7
  }
}</pre>
            </div>
        </div>
        
        <div class="endpoint">
            <h3><span class="method post">POST</span> /api/future-trends</h3>
            <p>Predict future outbreak trends with seasonal analysis.</p>
            <div class="example">
                <strong>Request Body:</strong>
                <pre>{
  "outbreak_data": {
    "No_of_Cases": 150,
    "Northeast_State": 2,
    "Start_of_Outbreak_Month": 7
  },
  "water_params": {
    "ph": 8.5,
    "dissolved_oxygen": 3.0,
    "bod": 5.0,
    "nitrate_n": 12.0,
    "fecal_coliform": 80.0,
    "total_coliform": 450.0,
    "temperature": 28.0
  },
  "months_ahead": 3
}</pre>
            </div>
        </div>
        
        <div class="endpoint">
            <h3><span class="method post">POST</span> /api/batch-analyze</h3>
            <p>Batch analysis for multiple scenarios.</p>
            <div class="example">
                <strong>Request Body:</strong>
                <pre>{
  "scenarios": [
    {
      "id": "scenario_1",
      "outbreak_data": {...},
      "water_params": {...}
    },
    {
      "id": "scenario_2",
      "outbreak_data": {...},
      "water_params": {...}
    }
  ],
  "include_future": true
}</pre>
            </div>
        </div>
        
        <h2>🎯 Parameter Specifications</h2>
        
        <h3>Outbreak Data Parameters:</h3>
        <ul>
            <li><strong>No_of_Cases</strong>: Number of disease cases (integer, ≥0)</li>
            <li><strong>Northeast_State</strong>: State code 1-8 (integer)</li>
            <li><strong>Start_of_Outbreak_Month</strong>: Month 1-12 (integer)</li>
        </ul>
        
        <h3>Water Quality Parameters:</h3>
        <ul>
            <li><strong>ph</strong>: pH level (6.0-9.5, ideal: 6.5-8.5)</li>
            <li><strong>dissolved_oxygen</strong>: DO in mg/L (ideal: >5.0)</li>
            <li><strong>bod</strong>: BOD in mg/L (ideal: <3.0)</li>
            <li><strong>nitrate_n</strong>: Nitrate-N in mg/L (ideal: <10.0)</li>
            <li><strong>fecal_coliform</strong>: Fecal coliform CFU/100mL (ideal: <1.0)</li>
            <li><strong>total_coliform</strong>: Total coliform CFU/100mL (ideal: <50.0)</li>
            <li><strong>temperature</strong>: Temperature in °C (optional)</li>
        </ul>
        
        <h2>🔬 Features</h2>
        <ul>
            <li>✅ ML-powered disease prediction (91.6% accuracy)</li>
            <li>✅ Standardized water quality assessment (WQI)</li>
            <li>✅ Intelligent correlation analysis</li>
            <li>✅ 3-month future outbreak predictions</li>
            <li>✅ Seasonal pattern recognition</li>
            <li>✅ Risk-based recommendations</li>
            <li>✅ Batch processing capabilities</li>
            <li>✅ Real-time analysis</li>
        </ul>
        
        <p><strong>Service Version:</strong> 1.0.0 | <strong>Last Updated:</strong> September 5, 2025</p>
    </body>
    </html>
    """
    
    return docs_html

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Endpoint not found",
        "message": "Please check the API documentation at /api/docs",
        "available_endpoints": [
            "/api/health",
            "/api/analyze", 
            "/api/water-quality",
            "/api/disease-prediction",
            "/api/future-trends",
            "/api/batch-analyze",
            "/api/docs"
        ]
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "error": "Internal server error",
        "message": "An unexpected error occurred",
        "timestamp": datetime.now().isoformat()
    }), 500

def main():
    """Start the API server"""
    print("🚀 Starting Disease-Water Quality Correlation API...")
    
    # Initialize the analyzer
    if not initialize_analyzer():
        print("❌ Failed to initialize service. Exiting.")
        return
    
    print("✅ Service initialized successfully!")
    print("📚 API Documentation: http://localhost:5000/api/docs")
    print("🔍 Health Check: http://localhost:5000/api/health")
    print("=" * 60)
    
    # Start the Flask development server
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        threaded=True
    )

if __name__ == "__main__":
    main()

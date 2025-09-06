#!/usr/bin/env python3
"""
Disease Prediction API Service
=============================

A simple Flask API for serving disease outbreak predictions.
Run this script to start a web service that accepts prediction requests.

Usage:
    python api_service.py
    
Then make POST requests to: http://localhost:5000/predict

Requirements:
    pip install flask flask-cors
"""

try:
    from flask import Flask, request, jsonify
    from flask_cors import CORS
    FLASK_AVAILABLE = True
except ImportError:
    FLASK_AVAILABLE = False

import json
from disease_prediction_service import DiseasePredictor


app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Global predictor instance
predictor = None


def initialize_predictor():
    """Initialize the predictor when the app starts"""
    global predictor
    try:
        predictor = DiseasePredictor()
        print("✅ Disease prediction model loaded successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to load model: {str(e)}")
        return False


@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        'status': 'active',
        'service': 'Disease Prediction API',
        'version': '1.0',
        'model_loaded': predictor is not None
    })


@app.route('/predict', methods=['POST'])
def predict():
    """
    Prediction endpoint
    
    Expects JSON with outbreak data:
    {
        "No_of_Deaths": 5,
        "Northeast_State": 1,
        "Start_of_Outbreak_Month": 7,
        "Start_of_Outbreak_Season": 2,
        ...
    }
    """
    try:
        if predictor is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Get JSON data from request
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Make prediction
        result = predictor.predict_single(data)
        
        if 'error' in result:
            return jsonify(result), 400
        
        return jsonify({
            'success': True,
            'prediction': result,
            'input_data': data
        })
        
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500


@app.route('/predict/batch', methods=['POST'])
def predict_batch():
    """
    Batch prediction endpoint
    
    Expects JSON array of outbreak data:
    [
        {"No_of_Deaths": 5, "Northeast_State": 1, ...},
        {"No_of_Deaths": 3, "Northeast_State": 2, ...}
    ]
    """
    try:
        if predictor is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Get JSON data from request
        data = request.get_json()
        if not data or not isinstance(data, list):
            return jsonify({'error': 'Expected JSON array of outbreak data'}), 400
        
        # Convert to DataFrame and make predictions
        import pandas as pd
        df = pd.DataFrame(data)
        result_df = predictor.predict_batch(df)
        
        if result_df is None:
            return jsonify({'error': 'Batch prediction failed'}), 500
        
        # Convert back to JSON-serializable format
        results = result_df.to_dict('records')
        
        return jsonify({
            'success': True,
            'predictions': results,
            'count': len(results)
        })
        
    except Exception as e:
        return jsonify({'error': f'Batch prediction failed: {str(e)}'}), 500


@app.route('/model/info', methods=['GET'])
def model_info():
    """Get model information and performance metrics"""
    try:
        if predictor is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Get feature importance
        feature_importance = predictor.get_feature_importance(10)
        top_features = []
        if feature_importance is not None:
            top_features = [
                {'feature': row['feature'], 'importance': float(row['importance'])}
                for _, row in feature_importance.iterrows()
            ]
        
        return jsonify({
            'model_type': 'GradientBoostingRegressor',
            'feature_count': len(predictor.feature_names),
            'performance': {
                'r2_score': float(predictor.metadata['performance_metrics']['test_r2']),
                'rmse': float(predictor.metadata['performance_metrics']['test_rmse']),
                'training_time': float(predictor.metadata['performance_metrics']['training_time'])
            },
            'top_features': top_features
        })
        
    except Exception as e:
        return jsonify({'error': f'Failed to get model info: {str(e)}'}), 500


@app.route('/example', methods=['GET'])
def get_example():
    """Get an example input for testing"""
    if predictor is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    example = predictor.create_sample_input()
    return jsonify({
        'example_input': example,
        'description': 'Use this example data structure for making predictions'
    })


def main():
    """Main function to start the API service"""
    if not FLASK_AVAILABLE:
        print("❌ Flask not available. Install with: pip install flask flask-cors")
        return
    
    print("🏥 Disease Prediction API Service")
    print("=" * 40)
    
    # Initialize the predictor
    if not initialize_predictor():
        print("Failed to start service - model could not be loaded")
        return
    
    print("\n🚀 Starting API service...")
    print("📍 Service will be available at: http://localhost:5000")
    print("\nAvailable endpoints:")
    print("  GET  /              - Health check")
    print("  POST /predict       - Single prediction")
    print("  POST /predict/batch - Batch predictions")
    print("  GET  /model/info    - Model information")
    print("  GET  /example       - Example input format")
    print("\n💡 Example curl command:")
    print('curl -X POST http://localhost:5000/predict \\')
    print('     -H "Content-Type: application/json" \\')
    print('     -d \'{"No_of_Deaths": 5, "Northeast_State": 1, "Start_of_Outbreak_Month": 7}\'')
    print("\nPress Ctrl+C to stop the service")
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=False)
    except KeyboardInterrupt:
        print("\n👋 Service stopped")


if __name__ == "__main__":
    main()

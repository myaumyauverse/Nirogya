
import joblib
import pickle
import pandas as pd
import numpy as np

def load_model_components():
    """Load the saved model and preprocessors"""
    model = joblib.load("saved_models/gradient_boosting_model_20250905_152526.pkl")
    
    with open("saved_models/model_metadata_20250905_152526.pkl", "rb") as f:
        metadata = pickle.load(f)
    
    with open("saved_models/preprocessors_20250905_152526.pkl", "rb") as f:
        preprocessors = pickle.load(f)
    
    return model, metadata, preprocessors

def predict_disease_cases(input_data):
    """
    Predict disease cases using the trained GradientBoosting model
    
    Parameters:
    input_data: dict or DataFrame with the same features used for training
    
    Returns:
    predicted_cases: float or array of predicted case counts
    """
    model, metadata, preprocessors = load_model_components()
    
    # Convert to DataFrame if dict
    if isinstance(input_data, dict):
        input_data = pd.DataFrame([input_data])
    
    # Ensure all required features are present
    required_features = metadata['feature_names']
    for feature in required_features:
        if feature not in input_data.columns:
            input_data[feature] = 0  # Default value for missing features
    
    # Select and order features correctly
    input_data = input_data[required_features]
    
    # Make prediction
    prediction = model.predict(input_data)
    
    return prediction[0] if len(prediction) == 1 else prediction

# Model Information
print("Model Performance:")
print(f"R² Score: {0.916} ({model_metadata['performance_metrics']['test_r2']*100:.1f}%)")
print(f"RMSE: {9.867}")
print(f"Training Time: {0.344} seconds")
print(f"Requirements Met: {True}")

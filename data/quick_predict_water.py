#!/usr/bin/env python3
"""
Quick Water Quality Test Example
===============================
Simple script to demonstrate water quality prediction with predefined examples.

Usage: python quick_predict_water.py
"""

import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from water_quality_predictor import WaterQualityPredictor

def run_example_predictions():
    """Run example predictions with predefined water samples"""
    
    print("🌊 WATER QUALITY PREDICTION - EXAMPLE TESTS")
    print("=" * 50)
    
    try:
        # Initialize predictor
        predictor = WaterQualityPredictor()
        
        # Define test samples
        test_samples = [
            {
                'name': 'Clean Mountain Stream',
                'data': {
                    'temperature': 18.0,
                    'ph': 7.2,
                    'dissolved_oxygen': 8.5,
                    'bod': 1.2,
                    'nitrate_n': 2.1,
                    'fecal_coliform': 5.0,
                    'total_coliform': 25.0,
                    'fecal_streptococci': 2.0
                }
            },
            {
                'name': 'Urban River Water',
                'data': {
                    'temperature': 25.0,
                    'ph': 6.8,
                    'dissolved_oxygen': 4.2,
                    'bod': 8.5,
                    'nitrate_n': 15.0,
                    'fecal_coliform': 120.0,
                    'total_coliform': 800.0,
                    'fecal_streptococci': 45.0
                }
            },
            {
                'name': 'Treated Drinking Water',
                'data': {
                    'temperature': 22.0,
                    'ph': 7.5,
                    'dissolved_oxygen': 6.8,
                    'bod': 0.8,
                    'nitrate_n': 1.5,
                    'fecal_coliform': 0.0,
                    'total_coliform': 5.0,
                    'fecal_streptococci': 0.0
                }
            },
            {
                'name': 'Polluted Industrial Runoff',
                'data': {
                    'temperature': 35.0,
                    'ph': 5.2,
                    'dissolved_oxygen': 1.8,
                    'bod': 25.0,
                    'nitrate_n': 35.0,
                    'fecal_coliform': 500.0,
                    'total_coliform': 2500.0,
                    'fecal_streptococci': 200.0
                }
            }
        ]
        
        # Run predictions for each sample
        for i, sample in enumerate(test_samples, 1):
            print(f"\n{'='*60}")
            print(f"🧪 TEST SAMPLE {i}: {sample['name']}")
            print('='*60)
            
            # Make prediction
            predictions = predictor.predict_water_quality(sample['data'])
            
            # Display results
            predictor.display_results(sample['data'], predictions)
            
            # Add separator for readability
            if i < len(test_samples):
                input("\nPress Enter to continue to next sample...")
        
        print(f"\n{'='*60}")
        print("✅ ALL EXAMPLE PREDICTIONS COMPLETED!")
        print("💡 To test with your own data, run: python water_quality_predictor.py")
        print('='*60)
        
    except Exception as e:
        print(f"❌ Error running predictions: {str(e)}")
        print("Please ensure all model files are present in the 'saved_models' directory.")
        return False
    
    return True

def main():
    """Main function"""
    print("🚀 Starting Water Quality Prediction Examples...")
    
    if run_example_predictions():
        print("\n🎉 Examples completed successfully!")
    else:
        print("\n❌ Examples failed. Please check your setup.")
        sys.exit(1)

if __name__ == "__main__":
    main()

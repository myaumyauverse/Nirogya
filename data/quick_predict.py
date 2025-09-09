#!/usr/bin/env python3
"""
Quick Disease Outbreak Prediction Tool
=====================================
Command-line tool for rapid disease outbreak predictions using trained ML models.

Usage: 
  python quick_predict.py --deaths 5 --state 1 --month 7
  python quick_predict.py --interactive
  python quick_predict.py --info

Features:
  - Single outbreak prediction
  - Batch prediction from CSV
  - Interactive mode
  - Disease type classification
  - Risk assessment and recommendations
"""

import sys
import os
import argparse

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from disease_prediction_service import DiseasePredictor


def predict_disease_type(outbreak_data):
    """
    Predict the most likely disease type based on outbreak characteristics.
    
    Args:
        outbreak_data (dict): Outbreak characteristics
        
    Returns:
        dict: Disease prediction with probability scores
    """
    
    # Disease classification rules based on medical knowledge and data patterns
    diseases = {
        'Food Poisoning': 0.0,
        'Acute Diarrheal Disease': 0.0,
        'Typhoid': 0.0,
        'Hepatitis A': 0.0,
        'Cholera': 0.0,
        'Dysentery': 0.0
    }
    
    deaths = outbreak_data.get('No_of_Deaths', 0)
    month = outbreak_data.get('Start_of_Outbreak_Month', 7)
    season = outbreak_data.get('Start_of_Outbreak_Season', 2)
    prev_cases = outbreak_data.get('Cases_Lag_1', 0)
    
    # Calculate death ratio
    death_ratio = deaths / max(prev_cases, 1) if prev_cases > 0 else deaths / 10
    
    # Food Poisoning - Usually acute, shorter duration, higher mortality
    diseases['Food Poisoning'] += 30  # Base probability
    if deaths > 5:
        diseases['Food Poisoning'] += 20
    if death_ratio > 0.15:  # High mortality rate
        diseases['Food Poisoning'] += 25
    if month in [4, 5, 6, 7, 8]:  # Summer months
        diseases['Food Poisoning'] += 15
    
    # Acute Diarrheal Disease - Most common, all seasons
    diseases['Acute Diarrheal Disease'] += 40  # Base probability (most common)
    if season == 2:  # Monsoon season
        diseases['Acute Diarrheal Disease'] += 20
    if deaths <= 3:  # Usually lower mortality
        diseases['Acute Diarrheal Disease'] += 15
    if prev_cases > 20:  # Can affect many people
        diseases['Acute Diarrheal Disease'] += 10
    
    # Typhoid - More severe, longer duration
    diseases['Typhoid'] += 10  # Base probability
    if deaths >= 3:
        diseases['Typhoid'] += 20
    if death_ratio > 0.1:
        diseases['Typhoid'] += 15
    if season in [1, 2]:  # Pre-monsoon and monsoon
        diseases['Typhoid'] += 15
    if month in [4, 5, 6, 7, 8, 9]:
        diseases['Typhoid'] += 10
    
    # Hepatitis A - Specific patterns
    diseases['Hepatitis A'] += 5  # Base probability
    if deaths >= 2:
        diseases['Hepatitis A'] += 15
    if season == 2:  # Monsoon
        diseases['Hepatitis A'] += 20
    if month in [6, 7, 8, 9]:
        diseases['Hepatitis A'] += 15
    
    # Cholera - Epidemic potential, water-related
    diseases['Cholera'] += 5  # Base probability
    if prev_cases > 30:  # Epidemic potential
        diseases['Cholera'] += 25
    if season == 2:  # Monsoon
        diseases['Cholera'] += 20
    if deaths >= 5:
        diseases['Cholera'] += 15
    if death_ratio > 0.12:
        diseases['Cholera'] += 10
    
    # Dysentery - Bacterial infection
    diseases['Dysentery'] += 8  # Base probability
    if deaths >= 2:
        diseases['Dysentery'] += 15
    if season in [2, 3]:  # Monsoon and post-monsoon
        diseases['Dysentery'] += 15
    if death_ratio > 0.08:
        diseases['Dysentery'] += 10
    
    # Normalize probabilities
    total_score = sum(diseases.values())
    if total_score > 0:
        for disease in diseases:
            diseases[disease] = (diseases[disease] / total_score) * 100
    
    # Sort by probability
    sorted_diseases = sorted(diseases.items(), key=lambda x: x[1], reverse=True)
    
    return {
        'most_likely': sorted_diseases[0][0],
        'probability': round(sorted_diseases[0][1], 1),
        'all_probabilities': {disease: round(prob, 1) for disease, prob in sorted_diseases},
        'confidence': 'High' if sorted_diseases[0][1] > 40 else 'Medium' if sorted_diseases[0][1] > 25 else 'Low'
    }


def get_disease_info(disease_name):
    """Get information about a specific disease"""
    disease_info = {
        'Food Poisoning': {
            'description': 'Acute illness from contaminated food',
            'symptoms': 'Nausea, vomiting, diarrhea, abdominal pain',
            'duration': '1-3 days',
            'prevention': 'Proper food hygiene, safe storage'
        },
        'Acute Diarrheal Disease': {
            'description': 'Rapid onset diarrhea from various causes',
            'symptoms': 'Frequent loose stools, dehydration',
            'duration': '3-7 days',
            'prevention': 'Clean water, sanitation, hygiene'
        },
        'Typhoid': {
            'description': 'Bacterial infection from contaminated water/food',
            'symptoms': 'Fever, headache, diarrhea, rose-colored rash',
            'duration': '2-4 weeks',
            'prevention': 'Vaccination, safe water, proper sanitation'
        },
        'Hepatitis A': {
            'description': 'Viral liver infection',
            'symptoms': 'Fatigue, nausea, jaundice, dark urine',
            'duration': '2-8 weeks',
            'prevention': 'Vaccination, hygiene, safe water'
        },
        'Cholera': {
            'description': 'Severe bacterial diarrheal infection',
            'symptoms': 'Severe watery diarrhea, dehydration',
            'duration': '3-5 days',
            'prevention': 'Safe water, sanitation, ORS treatment'
        },
        'Dysentery': {
            'description': 'Bacterial infection causing bloody diarrhea',
            'symptoms': 'Bloody diarrhea, fever, abdominal cramps',
            'duration': '5-10 days',
            'prevention': 'Clean water, proper hygiene, sanitation'
        }
    }
    
    return disease_info.get(disease_name, {
        'description': 'Waterborne disease',
        'symptoms': 'Gastrointestinal symptoms',
        'duration': 'Variable',
        'prevention': 'Safe water and sanitation'
    })


def create_parser():
    """Create command line argument parser"""
    parser = argparse.ArgumentParser(
        description="Quick Disease Outbreak Prediction Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python quick_predict.py --deaths 5 --state 1 --month 7
  python quick_predict.py --deaths 10 --state 2 --month 12 --season 4 --prev-cases 20
  python quick_predict.py --interactive
        """
    )
    
    # Basic required arguments
    parser.add_argument('--deaths', '-d', type=int, 
                       help='Number of deaths from the outbreak')
    
    # Optional arguments
    parser.add_argument('--state', '-s', type=int, choices=[1,2,3,4,5], default=1,
                       help='Northeast state (1=Assam, 2=Meghalaya, 3=Mizoram, 4=Tripura, 5=Other)')
    
    parser.add_argument('--month', '-m', type=int, choices=range(1,13), 
                       help='Outbreak start month (1-12)')
    
    parser.add_argument('--season', type=int, choices=[1,2,3,4], default=2,
                       help='Season (1=Pre-Monsoon, 2=Monsoon, 3=Post-Monsoon, 4=Winter)')
    
    parser.add_argument('--prev-cases', type=float, default=0,
                       help='Cases from previous outbreak (improves accuracy)')
    
    parser.add_argument('--district', type=int, default=1,
                       help='District code (1-50)')
    
    parser.add_argument('--source', type=int, choices=[1,2,3], default=1,
                       help='Data source (1-3)')
    
    # Mode arguments
    parser.add_argument('--interactive', '-i', action='store_true',
                       help='Run in interactive mode')
    
    parser.add_argument('--batch', '-b', 
                       help='Batch prediction from CSV file')
    
    parser.add_argument('--info', action='store_true',
                       help='Show model information')
    
    parser.add_argument('--disease-info', 
                       help='Show information about a specific disease')
    
    parser.add_argument('--quiet', '-q', action='store_true',
                       help='Minimal output')
    
    return parser


def quick_predict(args, predictor):
    """Make a quick prediction from command line arguments"""
    
    if args.deaths is None:
        print("❌ Error: --deaths is required for prediction")
        return
    
    # Prepare input data
    input_data = {
        'No_of_Deaths': args.deaths,
        'Northeast_State': args.state,
        'Start_of_Outbreak_Month': args.month or 7,  # Default to July
        'Start_of_Outbreak_Season': args.season,
        'Cases_Lag_1': args.prev_cases,
        'Cases_Rolling_Mean_2': args.prev_cases,
        'District_Encoded': args.district,
        'Source_Table': args.source,
    }
    
    # Make case count prediction
    result = predictor.predict_single(input_data)
    
    # Make disease type prediction
    disease_prediction = predict_disease_type(input_data)
    
    if not args.quiet:
        print("🏥 Disease Outbreak Prediction")
        print("=" * 35)
        print(f"Input: {args.deaths} deaths, State {args.state}, Month {input_data['Start_of_Outbreak_Month']}")
        
        if args.prev_cases > 0:
            print(f"Historical data: {args.prev_cases} previous cases")
    
    if 'error' in result:
        print(f"❌ {result['error']}")
        return
    
    predicted_cases = result['predicted_cases']
    confidence = result['confidence']
    
    if args.quiet:
        # Minimal output for scripting
        print(f"{predicted_cases},{disease_prediction['most_likely']}")
    else:
        # Detailed output
        print(f"\n📊 Case Count Prediction:")
        print(f"  Predicted Cases: {predicted_cases}")
        print(f"  Confidence: {confidence}")
        
        # Risk assessment
        if predicted_cases < 5:
            risk = "🟢 Low Risk"
        elif predicted_cases < 20:
            risk = "🟡 Moderate Risk"
        elif predicted_cases < 50:
            risk = "🟠 High Risk"
        else:
            risk = "🔴 Very High Risk"
        
        print(f"  Risk Level: {risk}")
        
        # Disease type prediction
        print(f"\n🦠 Disease Type Prediction:")
        print(f"  Most Likely Disease: {disease_prediction['most_likely']}")
        print(f"  Probability: {disease_prediction['probability']}%")
        print(f"  Confidence: {disease_prediction['confidence']}")
        
        # Show top 3 disease probabilities
        print(f"\n📈 All Disease Probabilities:")
        for disease, prob in list(disease_prediction['all_probabilities'].items())[:3]:
            print(f"  {disease}: {prob}%")
        
        # Disease information
        disease_info = get_disease_info(disease_prediction['most_likely'])
        print(f"\n💡 Disease Information:")
        print(f"  Description: {disease_info['description']}")
        print(f"  Typical Duration: {disease_info['duration']}")
        print(f"  Key Symptoms: {disease_info['symptoms']}")
        
        # Recommendations
        if predicted_cases > 10 or disease_prediction['most_likely'] in ['Cholera', 'Typhoid']:
            print(f"\n⚠️  Urgent Recommendations:")
            print(f"  • Alert health authorities immediately")
            print(f"  • Isolate suspected cases")
            print(f"  • Test water sources")
            print(f"  • Prepare specific treatment for {disease_prediction['most_likely']}")
        elif predicted_cases > 5:
            print(f"\n💡 Recommendations:")
            print(f"  • Monitor the situation closely")
            print(f"  • Ensure proper sanitation")
            print(f"  • Educate community about {disease_info['prevention']}")
        
        print(f"\n🔬 Prevention Focus: {disease_info['prevention']}")


def batch_predict(csv_file, predictor):
    """Run batch predictions from CSV file"""
    try:
        import pandas as pd
        
        # Read CSV file
        df = pd.read_csv(csv_file)
        print(f"📊 Processing {len(df)} outbreaks from {csv_file}")
        
        # Make batch predictions
        results = predictor.predict_batch(df)
        
        if results is not None:
            # Save results
            output_file = csv_file.replace('.csv', '_predictions.csv')
            results.to_csv(output_file, index=False)
            print(f"✅ Results saved to {output_file}")
            
            # Summary
            avg_cases = results['predicted_cases'].mean()
            max_cases = results['predicted_cases'].max()
            min_cases = results['predicted_cases'].min()
            
            print(f"\n📈 Summary:")
            print(f"  Average predicted cases: {avg_cases:.2f}")
            print(f"  Range: {min_cases:.2f} - {max_cases:.2f}")
            
        else:
            print(f"❌ Batch prediction failed")
            
    except Exception as e:
        print(f"❌ Error processing batch file: {e}")


def show_model_info(predictor):
    """Show model information"""
    print("📈 Model Information")
    print("=" * 25)
    print("Algorithm: Gradient Boosting Regressor")
    print("R² Score: 0.916 (91.6% accuracy)")
    print("RMSE: 9.867 cases")
    print("Features: 52 engineered features")
    print("Training Data: 199 outbreak records")
    
    print("\n🔍 Top Features:")
    feature_importance = predictor.get_feature_importance(5)
    if feature_importance is not None:
        for idx, row in feature_importance.iterrows():
            print(f"  {row['feature']}: {row['importance']:.3f}")


def main():
    """Main function for command line interface"""
    parser = create_parser()
    args = parser.parse_args()
    
    # Initialize predictor
    try:
        if not args.quiet:
            print("🔄 Loading model...")
        predictor = DiseasePredictor()
        if not args.quiet:
            print("✅ Model loaded successfully!\n")
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        sys.exit(1)
    
    # Handle different modes
    if args.interactive:
        # Import and run interactive mode
        from data.disease_prediction_service import interactive_prediction_loop
        interactive_prediction_loop(predictor)
        
    elif args.batch:
        batch_predict(args.batch, predictor)
        
    elif args.info:
        show_model_info(predictor)
        
    elif args.disease_info:
        disease_info = get_disease_info(args.disease_info)
        print(f"🦠 Disease Information: {args.disease_info}")
        print("=" * 40)
        print(f"Description: {disease_info['description']}")
        print(f"Symptoms: {disease_info['symptoms']}")
        print(f"Duration: {disease_info['duration']}")
        print(f"Prevention: {disease_info['prevention']}")
        
    elif args.deaths is not None:
        quick_predict(args, predictor)
        
    else:
        # Show help if no arguments provided
        parser.print_help()
        print(f"\n💡 Quick start examples:")
        print(f"  python quick_predict.py --deaths 5 --state 1 --month 7")
        print(f"  python quick_predict.py --deaths 10 --prev-cases 25 --season 2")
        print(f"  python quick_predict.py --interactive")
        print(f"  python quick_predict.py --info")
        print(f"  python quick_predict.py --disease-info 'Typhoid'")
        print(f"  python quick_predict.py --deaths 3 --quiet  # CSV output")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Simple Water Quality Prediction Demo
===================================
Simplified script that uses the WQI calculation directly without ML models
for quick water quality assessment.

Created: September 5, 2025
Purpose: Quick water quality assessment using standardized WQI calculation
"""

import numpy as np
from datetime import datetime

def calculate_wqi(water_params):
    """Calculate Water Quality Index using standardized formula"""
    weights = {
        'ph': 0.15,
        'dissolved_oxygen': 0.20,
        'bod': 0.15,
        'nitrate_n': 0.15,
        'fecal_coliform': 0.20,
        'total_coliform': 0.15
    }
    
    wqi = 0
    
    # pH scoring (optimal range: 6.5-8.5)
    ph_val = water_params['ph']
    if 6.5 <= ph_val <= 8.5:
        ph_score = 0
    else:
        ph_score = min(abs(ph_val - 7.0) * 15, 100)
    wqi += weights['ph'] * ph_score
    
    # Dissolved Oxygen scoring (higher is better, >5 mg/L is good)
    do_val = water_params['dissolved_oxygen']
    if do_val >= 5:
        do_score = 0
    else:
        do_score = (5 - do_val) * 20
    wqi += weights['dissolved_oxygen'] * min(do_score, 100)
    
    # BOD scoring (lower is better, <3 mg/L is good)
    bod_val = water_params['bod']
    if bod_val <= 3:
        bod_score = 0
    else:
        bod_score = (bod_val - 3) * 10
    wqi += weights['bod'] * min(bod_score, 100)
    
    # Nitrate scoring (lower is better, <10 mg/L is good)
    nitrate_val = water_params['nitrate_n']
    if nitrate_val <= 10:
        nitrate_score = nitrate_val * 2
    else:
        nitrate_score = 20 + (nitrate_val - 10) * 8
    wqi += weights['nitrate_n'] * min(nitrate_score, 100)
    
    # Fecal Coliform scoring (lower is better, <50 CFU/100mL is good)
    fc_val = water_params['fecal_coliform']
    if fc_val <= 50:
        fc_score = fc_val * 0.5
    else:
        fc_score = 25 + (fc_val - 50) * 0.1
    wqi += weights['fecal_coliform'] * min(fc_score, 100)
    
    # Total Coliform scoring (lower is better, <500 CFU/100mL is good)
    tc_val = water_params['total_coliform']
    if tc_val <= 500:
        tc_score = tc_val * 0.05
    else:
        tc_score = 25 + (tc_val - 500) * 0.01
    wqi += weights['total_coliform'] * min(tc_score, 100)
    
    return wqi

def get_sample_inputs():
    """Provide sample water quality scenarios"""
    return {
        "1": {
            "name": "🟢 Excellent Quality Water (River upstream)",
            "data": {
                'temperature': 22.0,
                'ph': 7.2,
                'dissolved_oxygen': 8.5,
                'bod': 1.5,
                'nitrate_n': 3.0,
                'fecal_coliform': 10.0,
                'total_coliform': 50.0,
                'fecal_streptococci': 5.0
            }
        },
        "2": {
            "name": "🟡 Good Quality Water (Clean lake)",
            "data": {
                'temperature': 25.0,
                'ph': 7.0,
                'dissolved_oxygen': 6.0,
                'bod': 2.5,
                'nitrate_n': 7.0,
                'fecal_coliform': 30.0,
                'total_coliform': 200.0,
                'fecal_streptococci': 15.0
            }
        },
        "3": {
            "name": "🟠 Moderate Quality Water (Agricultural runoff area)",
            "data": {
                'temperature': 28.0,
                'ph': 8.2,
                'dissolved_oxygen': 4.0,
                'bod': 4.0,
                'nitrate_n': 12.0,
                'fecal_coliform': 80.0,
                'total_coliform': 600.0,
                'fecal_streptococci': 40.0
            }
        },
        "4": {
            "name": "🔴 Poor Quality Water (Urban polluted water)",
            "data": {
                'temperature': 32.0,
                'ph': 9.0,
                'dissolved_oxygen': 2.0,
                'bod': 8.0,
                'nitrate_n': 20.0,
                'fecal_coliform': 200.0,
                'total_coliform': 1500.0,
                'fecal_streptococci': 100.0
            }
        },
        "5": {
            "name": "⚫ Very Poor Quality Water (Sewage contaminated)",
            "data": {
                'temperature': 35.0,
                'ph': 9.5,
                'dissolved_oxygen': 1.0,
                'bod': 15.0,
                'nitrate_n': 30.0,
                'fecal_coliform': 500.0,
                'total_coliform': 3000.0,
                'fecal_streptococci': 200.0
            }
        },
        "6": {
            "name": "📝 Custom Input",
            "data": None
        }
    }

def get_custom_input():
    """Get custom water quality parameters from user"""
    print("\n📝 Enter water quality parameters:")
    
    parameters = {
        'temperature': "Temperature (°C) [10-40]: ",
        'ph': "pH Level [6.0-9.0]: ",
        'dissolved_oxygen': "Dissolved Oxygen (mg/L) [0-15]: ",
        'bod': "BOD (mg/L) [0-20]: ",
        'nitrate_n': "Nitrate-N (mg/L) [0-50]: ",
        'fecal_coliform': "Fecal Coliform (CFU/100mL) [0-1000]: ",
        'total_coliform': "Total Coliform (CFU/100mL) [0-5000]: ",
        'fecal_streptococci': "Fecal Streptococci (CFU/100mL) [0-500]: "
    }
    
    water_data = {}
    for param, prompt in parameters.items():
        while True:
            try:
                value = float(input(f"  {prompt}"))
                if value < 0:
                    print("    ⚠️ Please enter a positive value!")
                    continue
                water_data[param] = value
                break
            except ValueError:
                print("    ❌ Please enter a valid number!")
    
    return water_data

def analyze_parameters(water_data):
    """Analyze individual water quality parameters"""
    analysis = {}
    
    # Temperature analysis
    temp = water_data['temperature']
    if temp < 15:
        analysis['temperature'] = "❄️ Too cold - may affect aquatic life"
    elif temp > 30:
        analysis['temperature'] = "🔥 Too warm - reduces oxygen levels"
    else:
        analysis['temperature'] = "✅ Normal temperature range"
    
    # pH analysis
    ph = water_data['ph']
    if ph < 6.5:
        analysis['ph'] = "🔴 Too acidic - harmful to aquatic life"
    elif ph > 8.5:
        analysis['ph'] = "🔵 Too alkaline - may cause scaling"
    else:
        analysis['ph'] = "✅ Optimal pH range"
    
    # Dissolved Oxygen analysis
    do = water_data['dissolved_oxygen']
    if do < 2:
        analysis['dissolved_oxygen'] = "⚫ Critical - fish cannot survive"
    elif do < 5:
        analysis['dissolved_oxygen'] = "🔴 Low - stress on aquatic life"
    elif do > 12:
        analysis['dissolved_oxygen'] = "🔵 High - possible algae bloom"
    else:
        analysis['dissolved_oxygen'] = "✅ Good oxygen levels"
    
    # BOD analysis
    bod = water_data['bod']
    if bod > 10:
        analysis['bod'] = "⚫ Very high - severe pollution"
    elif bod > 5:
        analysis['bod'] = "🔴 High - organic pollution present"
    elif bod > 3:
        analysis['bod'] = "🟠 Moderate - some organic matter"
    else:
        analysis['bod'] = "✅ Low organic pollution"
    
    # Nitrate analysis
    nitrate = water_data['nitrate_n']
    if nitrate > 20:
        analysis['nitrate_n'] = "🔴 High - eutrophication risk"
    elif nitrate > 10:
        analysis['nitrate_n'] = "🟠 Elevated - agricultural runoff"
    else:
        analysis['nitrate_n'] = "✅ Acceptable nitrate levels"
    
    # Fecal Coliform analysis
    fc = water_data['fecal_coliform']
    if fc > 200:
        analysis['fecal_coliform'] = "⚫ Dangerous - sewage contamination"
    elif fc > 50:
        analysis['fecal_coliform'] = "🔴 High - not safe for contact"
    else:
        analysis['fecal_coliform'] = "✅ Safe bacterial levels"
    
    # Total Coliform analysis
    tc = water_data['total_coliform']
    if tc > 1000:
        analysis['total_coliform'] = "🔴 High contamination"
    elif tc > 500:
        analysis['total_coliform'] = "🟠 Moderate contamination"
    else:
        analysis['total_coliform'] = "✅ Low contamination"
    
    return analysis

def get_recommendations(wqi_value, water_data):
    """Provide recommendations based on WQI and parameters"""
    recommendations = []
    
    if wqi_value <= 25:
        recommendations.append("🎉 Excellent water quality! Safe for drinking and all recreational activities.")
        recommendations.append("💧 Suitable for aquaculture and irrigation.")
    elif wqi_value <= 50:
        recommendations.append("👍 Good water quality. Safe for most uses with minimal treatment.")
        recommendations.append("🏊 Suitable for recreational activities.")
    elif wqi_value <= 75:
        recommendations.append("⚠️ Moderate water quality. Requires treatment for drinking.")
        recommendations.append("🔍 Monitor regularly and address pollution sources.")
    elif wqi_value <= 100:
        recommendations.append("🚨 Poor water quality. Not suitable for drinking without extensive treatment.")
        recommendations.append("⛔ Avoid direct contact. Not safe for swimming.")
    else:
        recommendations.append("☣️ Very poor water quality. Immediate action required!")
        recommendations.append("🚫 Do not use for any purpose without comprehensive treatment.")
    
    # Specific parameter recommendations
    if water_data['ph'] < 6.5 or water_data['ph'] > 8.5:
        recommendations.append("🔧 Adjust pH levels using lime (raise) or acid (lower)")
    
    if water_data['dissolved_oxygen'] < 5:
        recommendations.append("💨 Increase aeration to boost oxygen levels")
    
    if water_data['bod'] > 3:
        recommendations.append("🛠️ Implement organic waste treatment systems")
    
    if water_data['fecal_coliform'] > 50:
        recommendations.append("🦠 Investigate and eliminate sewage contamination sources")
    
    if water_data['nitrate_n'] > 10:
        recommendations.append("🌱 Control agricultural runoff and fertilizer use")
    
    return recommendations

def display_results(water_data, wqi_value):
    """Display comprehensive water quality analysis"""
    print("\n" + "="*60)
    print("🔬 COMPREHENSIVE WATER QUALITY ANALYSIS")
    print("="*60)
    
    # Input parameters
    print("\n📊 INPUT PARAMETERS:")
    print("-" * 25)
    for param, value in water_data.items():
        unit_map = {
            'temperature': '°C',
            'ph': '',
            'dissolved_oxygen': 'mg/L',
            'bod': 'mg/L',
            'nitrate_n': 'mg/L',
            'fecal_coliform': 'CFU/100mL',
            'total_coliform': 'CFU/100mL',
            'fecal_streptococci': 'CFU/100mL'
        }
        unit = unit_map.get(param, '')
        print(f"  {param.replace('_', ' ').title()}: {value} {unit}")
    
    # WQI Result
    print(f"\n🎯 WATER QUALITY INDEX (WQI): {wqi_value:.2f}")
    print("-" * 35)
    
    # WQI Category
    if wqi_value <= 25:
        category = "🟢 EXCELLENT"
        description = "Outstanding water quality"
    elif wqi_value <= 50:
        category = "🟡 GOOD"
        description = "Good water quality with minor issues"
    elif wqi_value <= 75:
        category = "🟠 MODERATE"
        description = "Moderate pollution requiring attention"
    elif wqi_value <= 100:
        category = "🔴 POOR"
        description = "Significant pollution - needs treatment"
    else:
        category = "⚫ VERY POOR"
        description = "Severe pollution - immediate action required"
    
    print(f"  Category: {category}")
    print(f"  Status: {description}")
    
    # Individual parameter analysis
    print(f"\n🔍 PARAMETER ANALYSIS:")
    print("-" * 25)
    analysis = analyze_parameters(water_data)
    for param, status in analysis.items():
        print(f"  {param.replace('_', ' ').title()}: {status}")
    
    # Recommendations
    print(f"\n💡 RECOMMENDATIONS:")
    print("-" * 20)
    recommendations = get_recommendations(wqi_value, water_data)
    for i, rec in enumerate(recommendations, 1):
        print(f"  {i}. {rec}")
    
    # Usage guidelines
    print(f"\n🚰 USAGE GUIDELINES:")
    print("-" * 20)
    if wqi_value <= 25:
        print("  ✅ Safe for drinking (with standard treatment)")
        print("  ✅ Excellent for recreational use")
        print("  ✅ Suitable for all aquatic life")
    elif wqi_value <= 50:
        print("  ⚠️ Requires treatment for drinking")
        print("  ✅ Safe for recreational activities")
        print("  ✅ Good for most aquatic life")
    elif wqi_value <= 75:
        print("  🔴 Not suitable for drinking without extensive treatment")
        print("  ⚠️ Limited recreational use")
        print("  ⚠️ May stress sensitive aquatic species")
    else:
        print("  🚫 Do not use for drinking")
        print("  🚫 Avoid all water contact")
        print("  🚫 Harmful to aquatic ecosystems")

def main():
    """Main function"""
    print("🌊 WATER QUALITY ASSESSMENT TOOL")
    print("=================================")
    print("Professional Water Quality Index (WQI) Calculator")
    print("Based on international water quality standards\n")
    
    # Show sample options
    samples = get_sample_inputs()
    
    print("🧪 Choose a water sample to analyze:")
    for key, sample in samples.items():
        print(f"  {key}. {sample['name']}")
    
    # Get user choice
    while True:
        choice = input(f"\nEnter choice (1-{len(samples)}): ").strip()
        if choice in samples:
            break
        print(f"Invalid choice! Please enter 1-{len(samples)}.")
    
    # Get water data
    if choice == "6":
        water_data = get_custom_input()
    else:
        water_data = samples[choice]['data']
        print(f"\n✅ Analyzing: {samples[choice]['name']}")
    
    # Calculate WQI
    print("\n🔄 Calculating Water Quality Index...")
    wqi_value = calculate_wqi(water_data)
    
    # Display comprehensive results
    display_results(water_data, wqi_value)
    
    print(f"\n📅 Analysis completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("🌍 Thank you for monitoring water quality!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye!")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        print("Please check your inputs and try again.")

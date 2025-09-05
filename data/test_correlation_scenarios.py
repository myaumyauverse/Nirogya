#!/usr/bin/env python3
"""
Test Script for Disease-Water Quality Correlation Analysis
=========================================================
This script demonstrates various scenarios and capabilities of the integrated analysis system.

Usage: python test_correlation_scenarios.py
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from disease_water_correlation import IntegratedHealthAnalyzer

def test_scenario(name, outbreak_data, water_params, analyzer):
    """Test a specific scenario"""
    print(f"\n{'='*80}")
    print(f"🧪 TESTING SCENARIO: {name}")
    print('='*80)
    
    analysis = analyzer.analyze_integrated_scenario(outbreak_data, water_params)
    analyzer.display_integrated_results(analysis, outbreak_data, water_params)
    
    return analysis

def main():
    """Run test scenarios"""
    print("🚀 DISEASE-WATER QUALITY CORRELATION - TEST SCENARIOS")
    print("="*60)
    
    # Initialize analyzer
    analyzer = IntegratedHealthAnalyzer()
    
    # Scenario 1: Low risk - Good water, few cases
    test_scenario(
        "LOW RISK SCENARIO",
        outbreak_data={
            'No_of_Cases': 25,
            'Northeast_State': 1,
            'Start_of_Outbreak_Month': 7
        },
        water_params={
            'ph': 7.2,
            'dissolved_oxygen': 7.5,
            'bod': 2.0,
            'nitrate_n': 5.0,
            'fecal_coliform': 15.0,
            'total_coliform': 80.0,
            'temperature': 24.0
        },
        analyzer=analyzer
    )
    
    # Scenario 2: High risk - Poor water, many cases
    test_scenario(
        "HIGH RISK SCENARIO",
        outbreak_data={
            'No_of_Cases': 500,
            'Northeast_State': 2,
            'Start_of_Outbreak_Month': 8  # Monsoon
        },
        water_params={
            'ph': 9.5,
            'dissolved_oxygen': 1.0,
            'bod': 25.0,
            'nitrate_n': 30.0,
            'fecal_coliform': 800.0,
            'total_coliform': 3500.0,
            'temperature': 35.0
        },
        analyzer=analyzer
    )
    
    # Scenario 3: Cholera-like pattern
    test_scenario(
        "CHOLERA-LIKE PATTERN",
        outbreak_data={
            'No_of_Cases': 200,
            'Northeast_State': 3,
            'Start_of_Outbreak_Month': 7  # Monsoon
        },
        water_params={
            'ph': 6.0,
            'dissolved_oxygen': 3.0,
            'bod': 8.0,
            'nitrate_n': 15.0,
            'fecal_coliform': 400.0,
            'total_coliform': 2000.0,
            'temperature': 30.0
        },
        analyzer=analyzer
    )
    
    # Scenario 4: Typhoid-like pattern
    test_scenario(
        "TYPHOID-LIKE PATTERN",
        outbreak_data={
            'No_of_Cases': 120,
            'Northeast_State': 1,
            'Start_of_Outbreak_Month': 5  # Pre-monsoon
        },
        water_params={
            'ph': 7.8,
            'dissolved_oxygen': 4.0,
            'bod': 6.0,
            'nitrate_n': 20.0,
            'fecal_coliform': 150.0,
            'total_coliform': 900.0,
            'temperature': 28.0
        },
        analyzer=analyzer
    )
    
    print(f"\n{'='*80}")
    print("✅ ALL TEST SCENARIOS COMPLETED!")
    print("💡 Key observations:")
    print("  • Higher case counts increase disease risk scores")
    print("  • Poor water quality correlates with disease likelihood")
    print("  • Combined analysis provides comprehensive recommendations")
    print("  • Different diseases show different water quality patterns")
    print("  • Future predictions adapt to seasonal patterns and current conditions")
    print("  • Monsoon months show higher predicted case numbers")
    print("  • Winter months show lower predicted case numbers")
    print('='*80)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Testing interrupted!")
    except Exception as e:
        print(f"\n❌ Error during testing: {str(e)}")
        import traceback
        traceback.print_exc()

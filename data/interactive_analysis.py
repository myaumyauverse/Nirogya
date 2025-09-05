#!/usr/bin/env python3
"""
Interactive Disease-Water Quality Correlation Analysis Tool
==========================================================
A user-friendly interface for real-time correlation analysis.

Usage: python interactive_analysis.py
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from disease_water_correlation import IntegratedHealthAnalyzer

def get_outbreak_data():
    """Get disease outbreak data from user"""
    print("\n🦠 DISEASE OUTBREAK DATA")
    print("-" * 30)
    
    try:
        cases = int(input("Number of cases: "))
        state = int(input("Northeast state (1-8): "))
        month = int(input("Outbreak start month (1-12): "))
        
        return {
            'No_of_Cases': cases,
            'Northeast_State': state,
            'Start_of_Outbreak_Month': month
        }
    except ValueError:
        print("❌ Please enter valid numbers!")
        return None

def get_water_params():
    """Get water quality parameters from user"""
    print("\n💧 WATER QUALITY PARAMETERS")
    print("-" * 30)
    
    try:
        params = {}
        params['ph'] = float(input("pH (6.5-8.5 ideal): "))
        params['dissolved_oxygen'] = float(input("Dissolved Oxygen (mg/L, >5 ideal): "))
        params['bod'] = float(input("BOD (mg/L, <3 ideal): "))
        params['nitrate_n'] = float(input("Nitrate-N (mg/L, <10 ideal): "))
        params['fecal_coliform'] = float(input("Fecal Coliform (CFU/100ml, <1 ideal): "))
        params['total_coliform'] = float(input("Total Coliform (CFU/100ml, <50 ideal): "))
        params['temperature'] = float(input("Temperature (°C): "))
        
        return params
    except ValueError:
        print("❌ Please enter valid numbers!")
        return None

def show_parameter_guidelines():
    """Show guidelines for water parameters"""
    print("\n📋 WATER QUALITY PARAMETER GUIDELINES")
    print("=" * 50)
    print("pH:               6.5-8.5 (ideal)")
    print("Dissolved Oxygen: >5 mg/L (good), <2 mg/L (poor)")
    print("BOD:              <3 mg/L (good), >6 mg/L (poor)")
    print("Nitrate-N:        <10 mg/L (good), >20 mg/L (poor)")
    print("Fecal Coliform:   <1 CFU/100ml (excellent), >100 (poor)")
    print("Total Coliform:   <50 CFU/100ml (good), >1000 (poor)")
    print("Temperature:      20-30°C (normal range)")
    print("=" * 50)

def show_menu():
    """Show main menu"""
    print("\n🏥💧 INTEGRATED HEALTH ANALYSIS SYSTEM")
    print("=" * 50)
    print("1. 📊 Run Full Analysis")
    print("2. 📋 Show Parameter Guidelines")
    print("3. 🧪 Quick Test with Sample Data")
    print("4. ❓ Help & Information")
    print("5. 🚪 Exit")
    print("=" * 50)

def quick_test(analyzer):
    """Run a quick test with sample data"""
    print("\n🧪 QUICK TEST WITH SAMPLE DATA")
    print("=" * 40)
    
    # Sample moderate risk scenario
    outbreak_data = {
        'No_of_Cases': 150,
        'Northeast_State': 2,
        'Start_of_Outbreak_Month': 8
    }
    
    water_params = {
        'ph': 8.5,
        'dissolved_oxygen': 3.5,
        'bod': 5.0,
        'nitrate_n': 12.0,
        'fecal_coliform': 80.0,
        'total_coliform': 450.0,
        'temperature': 28.0
    }
    
    print("Using sample data:")
    print(f"  Cases: {outbreak_data['No_of_Cases']}")
    print(f"  State: {outbreak_data['Northeast_State']}")
    print(f"  Month: {outbreak_data['Start_of_Outbreak_Month']}")
    print(f"  pH: {water_params['ph']}")
    print(f"  DO: {water_params['dissolved_oxygen']} mg/L")
    print(f"  BOD: {water_params['bod']} mg/L")
    print(f"  Fecal Coliform: {water_params['fecal_coliform']} CFU/100ml")
    
    analysis = analyzer.analyze_integrated_scenario(outbreak_data, water_params)
    analyzer.display_integrated_results(analysis, outbreak_data, water_params)

def show_help():
    """Show help information"""
    print("\n❓ HELP & INFORMATION")
    print("=" * 40)
    print("This tool analyzes the correlation between disease outbreaks")
    print("and water quality conditions in Northeast India.")
    print()
    print("📊 ANALYSIS COMPONENTS:")
    print("  • Disease outbreak prediction using ML")
    print("  • Water quality assessment (WQI calculation)")
    print("  • Correlation analysis between both factors")
    print("  • Integrated risk assessment")
    print("  • Actionable recommendations")
    print()
    print("🎯 INPUT REQUIREMENTS:")
    print("  • Disease: Cases, state, outbreak month")
    print("  • Water: pH, DO, BOD, nitrates, coliforms, temperature")
    print()
    print("📈 OUTPUT PROVIDES:")
    print("  • Risk levels and scores")
    print("  • Disease predictions")
    print("  • Water quality classification")
    print("  • Targeted intervention recommendations")

def main():
    """Main interactive loop"""
    print("🚀 STARTING INTEGRATED HEALTH ANALYSIS SYSTEM...")
    
    # Initialize analyzer
    try:
        analyzer = IntegratedHealthAnalyzer()
        print("✅ System initialized successfully!")
    except Exception as e:
        print(f"❌ Failed to initialize system: {e}")
        return
    
    while True:
        show_menu()
        
        try:
            choice = input("\nEnter your choice (1-5): ").strip()
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        
        if choice == '1':
            # Full analysis
            print("\n📝 ENTER DATA FOR ANALYSIS")
            print("=" * 35)
            
            outbreak_data = get_outbreak_data()
            if outbreak_data is None:
                continue
                
            water_params = get_water_params()
            if water_params is None:
                continue
            
            print("\n🔄 Running analysis...")
            try:
                analysis = analyzer.analyze_integrated_scenario(outbreak_data, water_params)
                analyzer.display_integrated_results(analysis, outbreak_data, water_params)
            except Exception as e:
                print(f"❌ Analysis failed: {e}")
        
        elif choice == '2':
            show_parameter_guidelines()
        
        elif choice == '3':
            quick_test(analyzer)
        
        elif choice == '4':
            show_help()
        
        elif choice == '5':
            print("\n👋 Thank you for using the Integrated Health Analysis System!")
            break
        
        else:
            print("❌ Invalid choice! Please enter 1-5.")
        
        input("\nPress Enter to continue...")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye!")
    except Exception as e:
        print(f"\n❌ System error: {e}")
        import traceback
        traceback.print_exc()

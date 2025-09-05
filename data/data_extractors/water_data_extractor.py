"""
Northeast States Water Quality Data Extractor - Specialized for Northeast India
Extracts water quality data from PDFs and saves as CSV with focus on northeastern states
"""

import re
import pandas as pd
from pathlib import Path
import PyPDF2
import pdfplumber
from typing import Dict, List, Optional
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

class NortheastWaterQualityExtractor:
    """Specialized water quality data extractor for northeastern states of India"""

    def __init__(self, pdf_folder: str = r"C:\Users\sayan\OneDrive - Manipal University Jaipur\SIH\water data",
                 output_folder: str = "."):
        self.pdf_folder = Path(pdf_folder)
        self.output_folder = Path(output_folder)
        self.output_folder.mkdir(exist_ok=True)

        # Define northeastern states and their identifiers
        self.northeast_states = {
            'AS': 'Assam', 'AR': 'Arunachal Pradesh', 'MN': 'Manipur', 'ML': 'Meghalaya',
            'MZ': 'Mizoram', 'NL': 'Nagaland', 'TR': 'Tripura', 'SK': 'Sikkim'
        }

        # Northeast state variations and keywords
        self.northeast_keywords = [
            'ASSAM', 'ARUNACHAL PRADESH', 'MANIPUR', 'MEGHALAYA', 'MIZORAM',
            'NAGALAND', 'TRIPURA', 'SIKKIM', 'GUWAHATI', 'IMPHAL', 'SHILLONG',
            'AIZAWL', 'KOHIMA', 'AGARTALA', 'GANGTOK', 'ITANAGAR'
        ]

        # Northeast districts and locations
        self.northeast_locations = [
            'KAMRUP', 'DIBRUGARH', 'JORHAT', 'SILCHAR', 'TEZPUR', 'NAGAON',
            'LOKTAK', 'UMIAM', 'RUDRASAGAR', 'ANJUNEM', 'BRAHMAPUTRA',
            'BARAK', 'SURMA', 'KOPILI', 'DHANSIRI', 'DOYANG', 'TUIRIAL'
        ]
        
        # Enhanced regex patterns optimized for northeastern states water quality data
        self.patterns = {
            'temperature': r'(?:temp(?:erature)?|water\s*temp)[\s:=]*(\d+\.?\d*)\s*°?[Cc]?',
            'ph': r'(?:ph|p\.h\.?)[\s:=]*(\d+\.?\d*)',
            'dissolved_oxygen': r'(?:dissolved\s*oxygen|d\.?o\.?|oxygen)[\s:=]*(\d+\.?\d*)',
            'bod': r'(?:bod|b\.o\.d\.?|biochemical\s*oxygen)[\s:=]*(\d+\.?\d*)',
            'nitrate_n': r'(?:nitrate[\s\-]*n?|no3[\s\-]*n?|nitrogen)[\s:=]*(\d+\.?\d*)',
            'fecal_coliform': r'(?:fecal\s*coliform|f[\.\s]*coliform|e[\.\s]*coli)[\s:=]*(\d+\.?\d*)',
            'total_coliform': r'(?:total\s*coliform|t[\.\s]*coliform)[\s:=]*(\d+\.?\d*)',
            'fecal_streptococci': r'(?:fecal\s*streptococci|f[\.\s]*streptococci|streptococci)[\s:=]*(\d+\.?\d*)'
        }

        # Compile patterns for better performance
        self.compiled_patterns = {k: re.compile(v, re.IGNORECASE) for k, v in self.patterns.items()}

    def is_northeast_data(self, text: str) -> bool:
        """Check if the text contains northeastern states data"""
        if not text:
            return False

        text_upper = text.upper()

        # First check for non-northeastern states to exclude them
        non_northeast_states = [
            'ODISHA', 'TELANGANA', 'GOA', 'ANDHRA PRADESH', 'KARNATAKA', 'KERALA',
            'TAMIL NADU', 'MAHARASHTRA', 'GUJARAT', 'RAJASTHAN', 'MADHYA PRADESH',
            'UTTAR PRADESH', 'BIHAR', 'JHARKHAND', 'WEST BENGAL', 'PUNJAB',
            'HARYANA', 'HIMACHAL PRADESH', 'UTTARAKHAND', 'DELHI', 'CHANDIGARH'
        ]

        for non_ne_state in non_northeast_states:
            if non_ne_state in text_upper:
                return False

        # Check for northeastern state keywords
        for keyword in self.northeast_keywords:
            if keyword in text_upper:
                return True

        # Check for northeastern locations
        for location in self.northeast_locations:
            if location in text_upper:
                return True

        return False

    def identify_northeast_state(self, text: str) -> str:
        """Identify which northeastern state the data belongs to"""
        if not text:
            return ""

        text_upper = text.upper()

        # First check for non-northeastern states and return empty if found
        non_northeast_states = [
            'ODISHA', 'TELANGANA', 'GOA', 'ANDHRA PRADESH', 'KARNATAKA', 'KERALA',
            'TAMIL NADU', 'MAHARASHTRA', 'GUJARAT', 'RAJASTHAN', 'MADHYA PRADESH',
            'UTTAR PRADESH', 'BIHAR', 'JHARKHAND', 'WEST BENGAL', 'PUNJAB',
            'HARYANA', 'HIMACHAL PRADESH', 'UTTARAKHAND', 'DELHI', 'CHANDIGARH'
        ]

        for non_ne_state in non_northeast_states:
            if non_ne_state in text_upper:
                return ""  # Return empty for non-northeastern states

        # Check for state codes
        for code, state in self.northeast_states.items():
            if f'/{code}/' in text_upper or text_upper.startswith(f'{code}/'):
                return state

        # Check for state names (exact matches)
        state_mappings = {
            'ASSAM': 'Assam', 'ARUNACHAL PRADESH': 'Arunachal Pradesh',
            'MANIPUR': 'Manipur', 'MEGHALAYA': 'Meghalaya', 'MIZORAM': 'Mizoram',
            'NAGALAND': 'Nagaland', 'TRIPURA': 'Tripura', 'SIKKIM': 'Sikkim'
        }

        for state_name, state in state_mappings.items():
            if state_name in text_upper:
                return state

        # Check for major cities/locations and map to states
        location_to_state = {
            'GUWAHATI': 'Assam', 'KAMRUP': 'Assam', 'DIBRUGARH': 'Assam', 'JORHAT': 'Assam',
            'SILCHAR': 'Assam', 'TEZPUR': 'Assam', 'NAGAON': 'Assam', 'ANJUNEM': 'Assam',
            'BRAHMAPUTRA': 'Assam', 'BARAK': 'Assam',
            'ITANAGAR': 'Arunachal Pradesh', 'TAWANG': 'Arunachal Pradesh',
            'IMPHAL': 'Manipur', 'LOKTAK': 'Manipur', 'UMIAM': 'Manipur',
            'SHILLONG': 'Meghalaya', 'AIZAWL': 'Mizoram', 'KOHIMA': 'Nagaland',
            'AGARTALA': 'Tripura', 'RUDRASAGAR': 'Tripura', 'GANGTOK': 'Sikkim'
        }

        for location, state in location_to_state.items():
            if location in text_upper:
                return state

        return ""

    def validate_and_clean_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Validate and clean the extracted data"""
        if df.empty:
            return df

        print(f"\n🔍 VALIDATING AND CLEANING DATA...")
        print(f"Initial records: {len(df)}")

        # Remove records without proper northeastern state identification
        if 'northeast_state' in df.columns:
            before_state_filter = len(df)
            df = df[df['northeast_state'].notna() & (df['northeast_state'] != '')].copy()
            removed_no_state = before_state_filter - len(df)
            if removed_no_state > 0:
                print(f"Removed {removed_no_state} records without northeastern state identification")

        # Remove records from non-northeastern states based on sample_location
        non_northeast_indicators = [
            'ODISHA', 'TELANGANA', 'GOA', 'ANDHRA PRADESH', 'KARNATAKA', 'KERALA',
            'TAMIL NADU', 'MAHARASHTRA', 'GUJARAT', 'RAJASTHAN', 'MADHYA PRADESH',
            'UTTAR PRADESH', 'BIHAR', 'JHARKHAND', 'WEST BENGAL', 'PUNJAB',
            'HARYANA', 'HIMACHAL PRADESH', 'UTTARAKHAND', 'DELHI', 'CHANDIGARH'
        ]

        before_location_filter = len(df)
        for indicator in non_northeast_indicators:
            df = df[~df['sample_location'].str.contains(indicator, case=False, na=False)].copy()

        removed_non_ne = before_location_filter - len(df)
        if removed_non_ne > 0:
            print(f"Removed {removed_non_ne} records from non-northeastern states")

        # Remove records with no meaningful data (all parameters missing)
        parameter_cols = ['temperature', 'ph', 'dissolved_oxygen', 'bod', 'nitrate_n',
                         'fecal_coliform', 'total_coliform', 'fecal_streptococci']

        before_param_filter = len(df)
        df = df[df[parameter_cols].notna().any(axis=1)].copy()
        removed_no_params = before_param_filter - len(df)
        if removed_no_params > 0:
            print(f"Removed {removed_no_params} records with no water quality parameters")

        # Validate parameter ranges
        if 'ph' in df.columns:
            df.loc[df['ph'] < 0, 'ph'] = None
            df.loc[df['ph'] > 14, 'ph'] = None

        if 'temperature' in df.columns:
            df.loc[df['temperature'] < -10, 'temperature'] = None
            df.loc[df['temperature'] > 60, 'temperature'] = None

        if 'dissolved_oxygen' in df.columns:
            df.loc[df['dissolved_oxygen'] < 0, 'dissolved_oxygen'] = None
            df.loc[df['dissolved_oxygen'] > 50, 'dissolved_oxygen'] = None

        print(f"Final clean records: {len(df)}")
        print(f"Data cleaning completed ✅")

        return df

    def fill_missing_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Fill missing data using intelligent imputation methods"""
        if df.empty:
            return df

        print(f"\n🔧 FILLING MISSING DATA...")

        parameter_cols = ['temperature', 'ph', 'dissolved_oxygen', 'bod', 'nitrate_n',
                         'fecal_coliform', 'total_coliform', 'fecal_streptococci']

        # Count missing values before
        missing_before = {}
        for col in parameter_cols:
            if col in df.columns:
                missing_before[col] = df[col].isna().sum()

        # Fill missing values using median by state (if available) or overall median
        for col in parameter_cols:
            if col in df.columns and df[col].notna().sum() > 0:
                if 'northeast_state' in df.columns:
                    # Fill by state median first
                    df[col] = df.groupby('northeast_state')[col].transform(
                        lambda x: x.fillna(x.median())
                    )

                # Fill remaining missing values with overall median
                overall_median = df[col].median()
                if pd.notna(overall_median):
                    df[col] = df[col].fillna(overall_median)
                else:
                    # Use default values if no data available
                    default_values = {
                        'temperature': 25.0, 'ph': 7.0, 'dissolved_oxygen': 6.0,
                        'bod': 3.0, 'nitrate_n': 1.0, 'fecal_coliform': 0.0,
                        'total_coliform': 10.0, 'fecal_streptococci': 0.0
                    }
                    df[col] = df[col].fillna(default_values.get(col, 0.0))

        # Count missing values after
        missing_after = {}
        filled_count = 0
        for col in parameter_cols:
            if col in df.columns:
                missing_after[col] = df[col].isna().sum()
                filled = missing_before.get(col, 0) - missing_after[col]
                filled_count += filled
                if filled > 0:
                    print(f"  {col}: Filled {filled} missing values")

        print(f"Total missing values filled: {filled_count}")
        print(f"Missing data imputation completed ✅")

        return df
    
    def extract_text_from_pdf(self, pdf_path: Path) -> List[Dict]:
        """Extract text from PDF using multiple methods"""
        pages_data = []
        
        try:
            # Try pdfplumber first (better for structured data)
            with pdfplumber.open(pdf_path) as pdf:
                for page_num, page in enumerate(pdf.pages, 1):
                    text = page.extract_text()
                    if text and text.strip():
                        pages_data.append({
                            'page_number': page_num,
                            'text': text,
                            'method': 'pdfplumber'
                        })
        except Exception as e:
            logger.warning(f"pdfplumber failed for {pdf_path.name}: {e}")
            
            # Fallback to PyPDF2
            try:
                with open(pdf_path, 'rb') as file:
                    reader = PyPDF2.PdfReader(file)
                    for page_num, page in enumerate(reader.pages, 1):
                        text = page.extract_text()
                        if text and text.strip():
                            pages_data.append({
                                'page_number': page_num,
                                'text': text,
                                'method': 'PyPDF2'
                            })
            except Exception as e2:
                logger.error(f"Both PDF extraction methods failed for {pdf_path.name}: {e2}")
        
        return pages_data
    
    def extract_parameters(self, text: str) -> Dict[str, Optional[float]]:
        """Extract water quality parameters from text using compiled regex and table parsing"""
        parameters = {}

        # First try regular regex patterns
        for param_name, pattern in self.compiled_patterns.items():
            match = pattern.search(text)
            if match:
                try:
                    value = float(match.group(1))
                    parameters[param_name] = round(value, 3)
                except (ValueError, IndexError):
                    parameters[param_name] = None
            else:
                parameters[param_name] = None

        # If no parameters found, try table-based extraction
        if not any(v is not None for v in parameters.values()):
            parameters = self.extract_from_table_text(text)

        return parameters

    def extract_from_table_text(self, text: str) -> Dict[str, Optional[float]]:
        """Extract parameters from tabular text data"""
        parameters = {
            'temperature': None, 'ph': None, 'dissolved_oxygen': None, 'bod': None,
            'nitrate_n': None, 'fecal_coliform': None, 'total_coliform': None, 'fecal_streptococci': None
        }

        # Look for numeric data patterns in table format
        lines = text.split('\n')

        for line in lines:
            # Skip header lines and empty lines
            if not line.strip() or 'Temperature' in line or 'STN' in line or 'Min Max' in line:
                continue

            # Extract numbers from the line
            numbers = re.findall(r'\b\d+\.?\d*\b', line)

            if len(numbers) >= 8:  # Expect at least 8 numeric values for a complete record
                try:
                    # Based on the table structure: Temperature, DO, pH, Conductivity, BOD, Nitrate, Fecal Coliform, Total Coliform
                    # Extract min values (even indices) for simplicity
                    if len(numbers) >= 2:
                        temp_min = float(numbers[0])
                        if 10 <= temp_min <= 50:  # Reasonable temperature range
                            parameters['temperature'] = temp_min

                    if len(numbers) >= 4:
                        do_min = float(numbers[2])
                        if 0 <= do_min <= 20:  # Reasonable DO range
                            parameters['dissolved_oxygen'] = do_min

                    if len(numbers) >= 6:
                        ph_min = float(numbers[4])
                        if 4 <= ph_min <= 10:  # Reasonable pH range
                            parameters['ph'] = ph_min

                    if len(numbers) >= 10:
                        bod_min = float(numbers[8])
                        if 0 <= bod_min <= 100:  # Reasonable BOD range
                            parameters['bod'] = bod_min

                    if len(numbers) >= 12:
                        nitrate_min = float(numbers[10])
                        if 0 <= nitrate_min <= 50:  # Reasonable nitrate range
                            parameters['nitrate_n'] = nitrate_min

                    if len(numbers) >= 14:
                        fc_min = float(numbers[12])
                        if fc_min >= 0:  # Fecal coliform
                            parameters['fecal_coliform'] = fc_min

                    if len(numbers) >= 16:
                        tc_min = float(numbers[14])
                        if tc_min >= 0:  # Total coliform
                            parameters['total_coliform'] = tc_min

                    # If we found at least one parameter, break (take first valid record)
                    if any(v is not None for v in parameters.values()):
                        break

                except (ValueError, IndexError):
                    continue

        return parameters
    
    def extract_metadata(self, text: str) -> Dict[str, str]:
        """Extract sample location and date from text"""
        location = ""
        date = "2021"  # Default year from the document title

        # Enhanced location patterns for table data
        location_patterns = [
            r'([A-Z][A-Z\s]+(?:LAKE|POND|TANK|WETLAND))[A-Z\s]+(?:LAKE|POND|TANK)',
            r'(\w+\s+(?:LAKE|POND|TANK|WETLAND))',
            r'([A-Z][A-Z\s]+)\s+(?:LAKE|POND|TANK)',
            r'(?:location|station|site)[\s:]*([A-Za-z0-9\s\-]+?)(?:\n|$|[,;])',
        ]

        # Look for location in the text
        for pattern in location_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                location = match.group(1).strip()
                # Clean up the location name
                location = re.sub(r'\s+', ' ', location)
                if len(location) > 5:  # Only use if it's a reasonable length
                    break

        # Look for state names to add context
        states = ['ANDHRA PRADESH', 'ASSAM', 'GOA', 'GUJARAT', 'JAMMU & KASHMIR',
                 'JHARKHAND', 'KARNATAKA', 'KERALA', 'MADHYA PRADESH', 'MANIPUR',
                 'ODISHA', 'RAJASTHAN', 'TELANGANA', 'TRIPURA', 'WEST BENGAL']

        for state in states:
            if state in text:
                if location and state not in location:
                    location = f"{location}, {state}"
                elif not location:
                    location = state
                break

        # Date patterns
        date_patterns = [
            r'(\d{4}-\d{2}-\d{2})',
            r'(\d{2}/\d{2}/\d{4})',
            r'(\d{2}-\d{2}-\d{4})',
            r'(2021|2022|2023|2024)'  # Year from document
        ]

        for pattern in date_patterns:
            match = re.search(pattern, text)
            if match:
                date = match.group(1)
                break

        return {'sample_location': location, 'sample_date': date}
    
    def process_pdf(self, pdf_path: Path) -> List[Dict]:
        """Process a single PDF file and filter for northeastern states data"""
        logger.info(f"Processing: {pdf_path.name}")
        results = []

        pages_data = self.extract_text_from_pdf(pdf_path)

        for page_data in pages_data:
            text = page_data['text']

            # Check if this page contains northeastern states data
            if not self.is_northeast_data(text):
                logger.info(f"  Page {page_data['page_number']}: No northeastern states data found")
                continue

            # Debug: Show first 500 characters of extracted text
            logger.info(f"  Page {page_data['page_number']} - Northeast data found: {text[:300]}...")

            # Extract parameters and metadata
            parameters = self.extract_parameters(text)
            metadata = self.extract_metadata(text)

            # Identify the northeastern state
            northeast_state = self.identify_northeast_state(text)
            if northeast_state:
                metadata['northeast_state'] = northeast_state
                logger.info(f"  Identified state: {northeast_state}")

            # Debug: Show what parameters were found
            found_params = [k for k, v in parameters.items() if v is not None]
            if found_params:
                logger.info(f"  Found parameters: {found_params}")
            else:
                logger.info(f"  No parameters found on page {page_data['page_number']}")

            # Only include records with at least one parameter and northeastern state data
            if any(v is not None for v in parameters.values()) and self.is_northeast_data(text):
                record = {
                    'filename': pdf_path.name,
                    'page_number': page_data['page_number'],
                    **metadata,
                    **parameters
                }
                results.append(record)

        return results
    
    def process_all_pdfs(self) -> pd.DataFrame:
        """Process all PDF files in the folder"""
        if not self.pdf_folder.exists():
            logger.warning(f"PDF folder {self.pdf_folder} does not exist")
            return pd.DataFrame()
        
        pdf_files = list(self.pdf_folder.glob("*.pdf"))
        if not pdf_files:
            logger.warning(f"No PDF files found in {self.pdf_folder}")
            return pd.DataFrame()
        
        all_results = []
        for pdf_file in pdf_files:
            results = self.process_pdf(pdf_file)
            all_results.extend(results)
        
        if all_results:
            df = pd.DataFrame(all_results)
            logger.info(f"Extracted {len(df)} raw records")

            # Validate and clean the data
            df = self.validate_and_clean_data(df)

            # Fill missing data
            df = self.fill_missing_data(df)

            # Reorder columns for better CSV structure
            column_order = ['filename', 'page_number', 'sample_location', 'sample_date', 'northeast_state',
                          'temperature', 'ph', 'dissolved_oxygen', 'bod', 'nitrate_n',
                          'fecal_coliform', 'total_coliform', 'fecal_streptococci']
            df = df.reindex(columns=column_order, fill_value=None)
            return df
        
        return pd.DataFrame()
    
    def save_csv(self, df: pd.DataFrame) -> None:
        """Save northeastern states water quality results as CSV files"""
        if df.empty:
            logger.warning("No northeastern states water quality data to save")
            return

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        # Main CSV file for northeastern states
        main_csv = self.output_folder / "northeast_water_quality_data.csv"
        df.to_csv(main_csv, index=False, encoding='utf-8')
        logger.info(f"✅ Northeast water quality CSV saved: {main_csv}")

        # Backup CSV with timestamp
        backup_csv = self.output_folder / f"northeast_water_quality_data_{timestamp}.csv"
        df.to_csv(backup_csv, index=False, encoding='utf-8')
        logger.info(f"✅ Backup CSV saved: {backup_csv}")

        # Summary statistics
        self.create_summary(df, timestamp)

        print(f"\n📁 NORTHEAST WATER QUALITY CSV FILES CREATED:")
        print(f"   📄 Main: {main_csv}")
        print(f"   📄 Backup: {backup_csv}")
        print(f"   📄 Summary: {self.output_folder}/northeast_water_summary_{timestamp}.csv")
    
    def create_summary(self, df: pd.DataFrame, timestamp: str) -> None:
        """Create summary statistics CSV for northeastern states data"""
        summary_data = []

        # Basic statistics
        summary_data.append(['Total Records', len(df)])
        summary_data.append(['Files Processed', df['filename'].nunique()])
        summary_data.append(['Unique Locations', df['sample_location'].nunique()])

        # Northeastern states coverage
        if 'northeast_state' in df.columns:
            summary_data.append(['Northeast States Covered', df['northeast_state'].nunique()])
            state_counts = df['northeast_state'].value_counts()
            for state, count in state_counts.items():
                summary_data.append([f'{state}_records', count])

        # Parameter coverage
        for col in df.columns:
            if col not in ['filename', 'page_number', 'sample_location', 'sample_date', 'northeast_state']:
                non_null = df[col].notna().sum()
                percentage = (non_null / len(df)) * 100
                summary_data.append([f'{col}_records', f'{non_null} ({percentage:.1f}%)'])

        summary_df = pd.DataFrame(summary_data, columns=['Metric', 'Value'])
        summary_path = self.output_folder / f"northeast_water_summary_{timestamp}.csv"
        summary_df.to_csv(summary_path, index=False, encoding='utf-8')

def create_sample_csv() -> None:
    """Create sample CSV to show expected format"""
    sample_data = {
        'filename': ['report1.pdf', 'report1.pdf', 'report2.pdf'],
        'page_number': [1, 1, 2],
        'sample_location': ['River Station A', 'River Station B', 'Lake Point C'],
        'sample_date': ['2024-01-15', '2024-01-15', '2024-01-20'],
        'temperature': [22.5, 24.1, 18.7],
        'ph': [7.2, 6.8, 7.5],
        'dissolved_oxygen': [8.5, 7.2, 9.1],
        'bod': [3.2, 4.1, 2.8],
        'nitrate_n': [1.5, 2.1, 1.2],
        'fecal_coliform': [120, 180, 95],
        'total_coliform': [450, 620, 380],
        'fecal_streptococci': [85, 110, 70]
    }
    
    df = pd.DataFrame(sample_data)
    df.to_csv("sample_water_quality_data.csv", index=False, encoding='utf-8')
    print("📄 Sample CSV created: sample_water_quality_data.csv")

def main():
    """Main execution function for northeastern states water quality extraction"""
    PDF_FOLDER = r"C:\Users\sayan\OneDrive - Manipal University Jaipur\SIH\water data"
    OUTPUT_FOLDER = "."  # Save in current directory (main project folder)

    print("🗺️  NORTHEAST STATES WATER QUALITY EXTRACTOR")
    print("=" * 60)
    print("Extracting water quality data specifically for northeastern states:")
    print("Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Tripura, Sikkim")
    print()

    # Check for PDF files
    pdf_path = Path(PDF_FOLDER)
    if not pdf_path.exists():
        print(f"📁 PDF folder does not exist: {PDF_FOLDER}")
        print(f"💡 Please ensure the water data folder exists with PDF files")
        return

    pdf_files = list(pdf_path.glob("*.pdf"))
    if not pdf_files:
        print(f"📁 No PDF files found in: {PDF_FOLDER}")
        print(f"💡 Add PDF files to this folder and run again")
        return

    print(f"📁 Found {len(pdf_files)} PDF files in water data folder")
    print(f"🔄 Starting northeastern states water quality extraction...")

    try:
        # Process PDFs with northeastern states focus
        extractor = NortheastWaterQualityExtractor(PDF_FOLDER, OUTPUT_FOLDER)
        df = extractor.process_all_pdfs()

        if not df.empty:
            extractor.save_csv(df)
            
            # Print results
            print(f"\n🎉 NORTHEAST WATER QUALITY EXTRACTION COMPLETE")
            print(f"📊 Records extracted: {len(df)}")
            print(f"📁 Files processed: {df['filename'].nunique()}")
            print(f"📍 Locations found: {df['sample_location'].nunique()}")

            # Show northeastern states coverage
            if 'northeast_state' in df.columns:
                state_counts = df['northeast_state'].value_counts()
                print(f"\n🗺️  Northeastern states found:")
                for state, count in state_counts.items():
                    print(f"  ✅ {state}: {count} records")

            # Show parameter coverage
            print(f"\n📈 Parameters extracted:")
            for col in ['temperature', 'ph', 'dissolved_oxygen', 'bod', 'nitrate_n', 'fecal_coliform']:
                if col in df.columns:
                    count = df[col].notna().sum()
                    if count > 0:
                        print(f"  ✅ {col}: {count} records")

            print(f"\n📁 Files saved in main project directory:")
            print(f"  📄 northeast_water_quality_data.csv")
            print(f"  📄 northeast_water_quality_data_*.csv (backup)")

        else:
            print("❌ No northeastern states water quality data found in PDF files")
            print("💡 Possible reasons:")
            print("  - PDFs don't contain northeastern states data")
            print("  - Data format not recognized by extraction patterns")
            print("  - PDFs are scanned images (not text-based)")

    except Exception as e:
        logger.error(f"Error during extraction: {e}")
        print(f"❌ Extraction failed: {e}")

if __name__ == "__main__":
    main()

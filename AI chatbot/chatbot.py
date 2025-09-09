import json
import sqlite3
import re
from typing import Dict, List, Tuple, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from datetime import datetime
import os

class DiseaseDatabaseManager:
    """Handles all database operations for disease data"""
    
    def __init__(self, db_path: str = "waterborne_diseases.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the database with required tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create diseases table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS diseases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT NOT NULL,
            transmission TEXT,
            severity TEXT,
            treatment TEXT,
            prevention TEXT,
            region_specific_info TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # Create symptoms table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS symptoms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            disease_id INTEGER,
            symptom_text TEXT NOT NULL,
            severity_level TEXT DEFAULT 'moderate',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (disease_id) REFERENCES diseases (id) ON DELETE CASCADE
        )
        ''')
        
        # Create symptom synonyms table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS symptom_synonyms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            original_term TEXT NOT NULL,
            synonym TEXT NOT NULL,
            language TEXT DEFAULT 'english',
            region TEXT DEFAULT 'northeast_india'
        )
        ''')
        
        # Create prevention tips table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS prevention_tips (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tip_text TEXT NOT NULL,
            category TEXT,
            region_specific INTEGER DEFAULT 0,
            priority_level INTEGER DEFAULT 1
        )
        ''')
        
        conn.commit()
        conn.close()
        
        # Populate with initial data if database is empty
        self.populate_initial_data()
    
    def populate_initial_data(self):
        """Add initial disease data if database is empty"""
        if self.get_disease_count() == 0:
            self.add_initial_diseases()
            self.add_initial_synonyms()
            self.add_prevention_tips()
    
    def get_disease_count(self) -> int:
        """Get total number of diseases in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM diseases")
        count = cursor.fetchone()[0]
        conn.close()
        return count
    
    def add_disease(self, name: str, description: str, transmission: str, 
                   severity: str, treatment: str, prevention: str, 
                   symptoms: List[str], region_specific_info: str = "") -> int:
        """Add a new disease to the database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Insert disease
            cursor.execute('''
            INSERT INTO diseases (name, description, transmission, severity, 
                                treatment, prevention, region_specific_info)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (name, description, transmission, severity, treatment, prevention, region_specific_info))
            
            disease_id = cursor.lastrowid
            
            # Insert symptoms
            for symptom in symptoms:
                cursor.execute('''
                INSERT INTO symptoms (disease_id, symptom_text)
                VALUES (?, ?)
                ''', (disease_id, symptom.strip().lower()))
            
            conn.commit()
            print(f"✅ Disease '{name}' added successfully with ID: {disease_id}")
            return disease_id
            
        except sqlite3.IntegrityError:
            print(f"❌ Disease '{name}' already exists!")
            return -1
        finally:
            conn.close()
    
    def update_disease(self, disease_id: int, **kwargs) -> bool:
        """Update disease information"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Update disease basic info
            update_fields = []
            values = []
            
            for field, value in kwargs.items():
                if field != 'symptoms' and value is not None:
                    update_fields.append(f"{field} = ?")
                    values.append(value)
            
            if update_fields:
                values.append(disease_id)
                cursor.execute(f'''
                UPDATE diseases 
                SET {", ".join(update_fields)}, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                ''', values)
            
            # Update symptoms if provided
            if 'symptoms' in kwargs:
                cursor.execute("DELETE FROM symptoms WHERE disease_id = ?", (disease_id,))
                for symptom in kwargs['symptoms']:
                    cursor.execute('''
                    INSERT INTO symptoms (disease_id, symptom_text)
                    VALUES (?, ?)
                    ''', (disease_id, symptom.strip().lower()))
            
            conn.commit()
            return True
            
        except Exception as e:
            print(f"❌ Error updating disease: {e}")
            return False
        finally:
            conn.close()
    
    def delete_disease(self, disease_id: int) -> bool:
        """Delete a disease and its symptoms"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute("DELETE FROM diseases WHERE id = ?", (disease_id,))
            conn.commit()
            print(f"✅ Disease with ID {disease_id} deleted successfully")
            return True
        except Exception as e:
            print(f"❌ Error deleting disease: {e}")
            return False
        finally:
            conn.close()
    
    def get_all_diseases(self) -> List[Dict]:
        """Get all diseases with their symptoms"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
        SELECT d.id, d.name, d.description, d.transmission, d.severity,
               d.treatment, d.prevention, d.region_specific_info,
               GROUP_CONCAT(s.symptom_text, '|') as symptoms
        FROM diseases d
        LEFT JOIN symptoms s ON d.id = s.disease_id
        GROUP BY d.id
        ''')
        
        diseases = []
        for row in cursor.fetchall():
            disease = {
                'id': row[0],
                'name': row[1],
                'description': row[2],
                'transmission': row[3],
                'severity': row[4],
                'treatment': row[5],
                'prevention': row[6],
                'region_specific_info': row[7],
                'symptoms': row[8].split('|') if row[8] else []
            }
            diseases.append(disease)
        
        conn.close()
        return diseases
    
    def get_disease_by_id(self, disease_id: int) -> Optional[Dict]:
        """Get a specific disease by ID"""
        diseases = self.get_all_diseases()
        return next((d for d in diseases if d['id'] == disease_id), None)
    
    def add_synonym(self, original_term: str, synonym: str, language: str = 'english', region: str = 'northeast_india'):
        """Add a symptom synonym"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
        INSERT INTO symptom_synonyms (original_term, synonym, language, region)
        VALUES (?, ?, ?, ?)
        ''', (original_term, synonym, language, region))
        
        conn.commit()
        conn.close()
    
    def get_all_synonyms(self) -> Dict[str, str]:
        """Get all symptom synonyms as a dictionary"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT synonym, original_term FROM symptom_synonyms")
        synonyms = dict(cursor.fetchall())
        
        conn.close()
        return synonyms
    
    def add_initial_diseases(self):
        """Add initial disease data"""
        initial_diseases = [
            {
                "name": "cholera",
                "description": "Cholera is an acute diarrheal infection caused by ingestion of food or water contaminated with Vibrio cholerae bacteria.",
                "transmission": "Contaminated water, poor sanitation, contaminated food",
                "severity": "Can be life-threatening if untreated",
                "treatment": "Oral rehydration therapy, antibiotics in severe cases, immediate medical attention required",
                "prevention": "Safe drinking water, proper sanitation, hand hygiene",
                "region_specific_info": "Common during monsoon season in Northeast India. Contact nearest PHC immediately.",
                "symptoms": [
                    "severe watery diarrhea", "rice water stools", "dehydration", 
                    "vomiting", "muscle cramps", "rapid heart rate", "low blood pressure",
                    "thirst", "dry mouth", "decreased urination", "weakness", "fatigue"
                ]
            },
            {
                "name": "hepatitis_a",
                "description": "Hepatitis A is a viral liver infection caused by the hepatitis A virus (HAV).",
                "transmission": "Contaminated water, contaminated food, poor hygiene",
                "severity": "Usually mild, self-limiting",
                "treatment": "Rest, adequate nutrition, avoid alcohol, supportive care",
                "prevention": "Vaccination, safe water, good hygiene, proper food handling",
                "region_specific_info": "Vaccination available at government health centers across Northeast India.",
                "symptoms": [
                    "jaundice", "yellow eyes", "yellow skin", "fatigue", "abdominal pain",
                    "nausea", "vomiting", "loss of appetite", "low grade fever", 
                    "dark urine", "light colored stools", "joint pain", "itching"
                ]
            },
            {
                "name": "typhoid",
                "description": "Typhoid fever is a bacterial infection caused by Salmonella Typhi.",
                "transmission": "Contaminated water, contaminated food, poor sanitation",
                "severity": "Serious infection requiring medical treatment",
                "treatment": "Antibiotics (fluoroquinolones, azithromycin), hospitalization may be required",
                "prevention": "Vaccination, safe water, proper food hygiene",
                "region_specific_info": "Endemic in Northeast India. Vaccination recommended for travelers and high-risk areas.",
                "symptoms": [
                    "high fever", "headache", "stomach pain", "constipation", "diarrhea",
                    "weakness", "loss of appetite", "rose colored rash", "enlarged spleen",
                    "abdominal tenderness", "step ladder fever pattern", "malaise"
                ]
            },
            {
                "name": "dysentery",
                "description": "Dysentery is an intestinal infection that causes severe diarrhea with blood and mucus.",
                "transmission": "Contaminated water, poor sanitation, contaminated food",
                "severity": "Can be serious, especially in children and elderly",
                "treatment": "Antibiotics, fluid replacement, medical supervision",
                "prevention": "Clean water, proper sanitation, hand hygiene",
                "region_specific_info": "Common during monsoon. Seek immediate treatment at nearest health facility.",
                "symptoms": [
                    "bloody diarrhea", "mucus in stool", "severe abdominal cramps",
                    "fever", "nausea", "vomiting", "dehydration", "urgency to defecate",
                    "tenesmus", "fatigue"
                ]
            }
        ]
        
        for disease_data in initial_diseases:
            symptoms = disease_data.pop('symptoms')
            self.add_disease(**disease_data, symptoms=symptoms)
    
    def add_initial_synonyms(self):
        """Add initial symptom synonyms"""
        synonyms = [
            ("diarrhea", "loose motions"),
            ("diarrhea", "loose stools"),
            ("stomach cramps", "stomach upset"),
            ("abdominal pain", "belly pain"),
            ("abdominal pain", "stomach ache"),
            ("vomiting", "throwing up"),
            ("vomiting", "puking"),
            ("jaundice", "yellow color"),
            ("muscle aches", "body pain"),
            ("muscle aches", "body ache"),
            ("fatigue", "tiredness"),
            ("weakness", "feeling weak"),
            ("fever", "bukhar"),  # Hindi/local term
            ("diarrhea", "pet kharab"),  # Hindi/local term
        ]
        
        for original, synonym in synonyms:
            self.add_synonym(original, synonym)
    
    def add_prevention_tips(self):
        """Add prevention tips"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        tips = [
            ("Always boil water for at least 1 minute before drinking", "water_safety", 1, 1),
            ("Use only bottled water from reputable sources", "water_safety", 0, 2),
            ("Avoid ice cubes unless made from safe water", "water_safety", 0, 2),
            ("Wash hands frequently with soap and clean water", "hygiene", 0, 1),
            ("Eat only hot, freshly cooked food", "food_safety", 0, 1),
            ("Avoid raw or undercooked seafood", "food_safety", 0, 2),
            ("Peel fruits yourself", "food_safety", 0, 2),
            ("During monsoon, be extra careful with water sources", "seasonal", 1, 1),
            ("Get vaccinated for Hepatitis A and Typhoid", "vaccination", 1, 1),
            ("Keep surroundings clean and dry", "sanitation", 1, 1)
        ]
        
        for tip_text, category, region_specific, priority in tips:
            cursor.execute('''
            INSERT INTO prevention_tips (tip_text, category, region_specific, priority_level)
            VALUES (?, ?, ?, ?)
            ''', (tip_text, category, region_specific, priority))
        
        conn.commit()
        conn.close()


class WaterborneDiseaseChatbot:
    """Main chatbot class with RAG functionality"""
    
    def __init__(self, db_path: str = "waterborne_diseases.db"):
        self.db_manager = DiseaseDatabaseManager(db_path)
        self.load_disease_data()
        self.create_symptom_vectors()
    
    def load_disease_data(self):
        """Load disease data from database"""
        self.diseases = self.db_manager.get_all_diseases()
        self.symptom_synonyms = self.db_manager.get_all_synonyms()
    
    def refresh_data(self):
        """Refresh data from database (call after adding new diseases)"""
        self.load_disease_data()
        self.create_symptom_vectors()
    
    def create_symptom_vectors(self):
        """Create TF-IDF vectors for symptom matching"""
        if not self.diseases:
            print("⚠️ No diseases found in database!")
            return
        
        all_symptoms = []
        self.disease_symptom_map = []
        
        for disease in self.diseases:
            symptom_text = " ".join(disease["symptoms"])
            all_symptoms.append(symptom_text)
            self.disease_symptom_map.append(disease)
        
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 3), stop_words='english')
        self.symptom_vectors = self.vectorizer.fit_transform(all_symptoms)
    
    def preprocess_user_input(self, user_input: str) -> str:
        """Preprocess user input by normalizing symptoms"""
        user_input = user_input.lower()
        
        # Replace synonyms
        for synonym, standard in self.symptom_synonyms.items():
            user_input = user_input.replace(synonym, standard)
        
        return user_input
    
    def extract_symptoms(self, user_input: str) -> List[str]:
        """Extract symptoms from user input using keyword matching"""
        user_input = self.preprocess_user_input(user_input)
        found_symptoms = []
        
        for disease in self.diseases:
            for symptom in disease["symptoms"]:
                if symptom.lower() in user_input or any(word in user_input for word in symptom.lower().split()):
                    found_symptoms.append(symptom)
        
        return list(set(found_symptoms))
    
    def diagnose_disease(self, user_input: str) -> List[Tuple[Dict, float, List[str]]]:
        """Diagnose potential diseases based on symptoms using RAG approach"""
        if not self.diseases:
            return []
        
        # Preprocess input
        processed_input = self.preprocess_user_input(user_input)
        
        # Extract symptoms
        found_symptoms = self.extract_symptoms(user_input)
        
        # Create vector for user input
        user_vector = self.vectorizer.transform([processed_input])
        
        # Calculate similarity scores
        similarities = cosine_similarity(user_vector, self.symptom_vectors)[0]
        
        # Get disease matches with scores
        disease_matches = []
        for i, score in enumerate(similarities):
            if score > 0.1:  # Threshold for relevance
                disease = self.disease_symptom_map[i]
                matching_symptoms = [s for s in found_symptoms if s in disease["symptoms"]]
                disease_matches.append((disease, score, matching_symptoms))
        
        # Sort by similarity score
        disease_matches.sort(key=lambda x: x[1], reverse=True)
        
        return disease_matches[:3]  # Return top 3 matches
    
    def format_response(self, disease_matches: List[Tuple[Dict, float, List[str]]]) -> str:
        """Format the diagnosis response"""
        if not disease_matches:
            return """I couldn't identify a specific waterborne disease based on your symptoms. 
However, if you're experiencing concerning symptoms, please consult a healthcare professional immediately.

Some general advice:
- Stay hydrated
- Avoid contaminated water and food
- Maintain good hygiene
- Seek medical attention if symptoms persist or worsen"""

        response = "Based on your symptoms, here are the possible waterborne diseases:\n\n"
        
        for i, (disease, score, matching_symptoms) in enumerate(disease_matches, 1):
            disease_name = disease['name'].replace("_", " ").title()
            
            response += f"{i}. **{disease_name}** (Confidence: {score:.2f})\n"
            response += f"   Description: {disease['description']}\n"
            
            if matching_symptoms:
                response += f"   Your matching symptoms: {', '.join(matching_symptoms)}\n"
            
            response += f"   Transmission: {disease['transmission']}\n"
            response += f"   Severity: {disease['severity']}\n"
            response += f"   Treatment: {disease['treatment']}\n"
            response += f"   Prevention: {disease['prevention']}\n"
            
            if disease['region_specific_info']:
                response += f"   Northeast India Info: {disease['region_specific_info']}\n"
            
            response += "\n"
        
        response += """⚠️ IMPORTANT DISCLAIMER ⚠️
This is an AI-based assessment tool and should not replace professional medical diagnosis.
If you're experiencing severe symptoms, please seek immediate medical attention.

For Northeast India specifically:
- Contact your nearest Primary Health Centre (PHC)
- In emergencies, call 108 (National Ambulance Service)
- Ensure you drink only boiled or purified water
- Maintain strict hygiene practices during monsoon season"""
        
        return response
    
    def admin_menu(self):
        """Administrative menu for database management"""
        while True:
            print("\n" + "="*50)
            print("🔧 DISEASE DATABASE ADMINISTRATION 🔧")
            print("="*50)
            print("1. View all diseases")
            print("2. Add new disease")
            print("3. Update disease")
            print("4. Delete disease")
            print("5. Add symptom synonym")
            print("6. Export database to JSON")
            print("7. Import from JSON")
            print("8. Show database info & file locations")
            print("9. Create sample JSON files")
            print("10. Back to main chat")
            
            choice = input("\nEnter your choice (1-10): ").strip()
            
            if choice == '1':
                self.view_all_diseases()
            elif choice == '2':
                self.add_new_disease_interactive()
            elif choice == '3':
                self.update_disease_interactive()
            elif choice == '4':
                self.delete_disease_interactive()
            elif choice == '5':
                self.add_synonym_interactive()
            elif choice == '6':
                self.export_to_json()
            elif choice == '7':
                self.import_from_json()
            elif choice == '8':
                self.show_database_info()
            elif choice == '9':
                self.create_sample_files()
            elif choice == '10':
                break
            else:
                print("❌ Invalid choice! Please try again.")
    
    def show_database_info(self):
        """Show database and file location information"""
        print("\n" + "="*60)
        print("📊 DATABASE & FILE INFORMATION")
        print("="*60)
        
        # Current directory
        current_dir = os.path.abspath('.')
        print(f"📁 Current working directory: {current_dir}")
        
        # Database file
        db_path = os.path.abspath(self.db_manager.db_path)
        db_exists = os.path.exists(db_path)
        print(f"🗄️  Database file: {db_path}")
        print(f"   Status: {'✅ Exists' if db_exists else '❌ Not found'}")
        
        if db_exists:
            # Database statistics
            stats = DatabaseUtils.get_database_stats(self.db_manager.db_path)
            if stats:
                print(f"   Diseases: {stats['diseases']}")
                print(f"   Symptoms: {stats['symptoms']}")
                print(f"   Synonyms: {stats['synonyms']}")
                print(f"   Size: {stats['database_size_mb']} MB")
        
        # Export directory
        export_dir = os.path.abspath('exported_data')
        export_exists = os.path.exists(export_dir)
        print(f"📤 Export directory: {export_dir}")
        print(f"   Status: {'✅ Exists' if export_exists else '❌ Not found'}")
        
        if export_exists:
            json_files = [f for f in os.listdir(export_dir) if f.endswith('.json')]
            print(f"   JSON files: {len(json_files)}")
            if json_files:
                for file in json_files[:5]:  # Show first 5 files
                    print(f"     - {file}")
                if len(json_files) > 5:
                    print(f"     ... and {len(json_files) - 5} more")
        
        # Files in current directory
        json_files_current = [f for f in os.listdir('.') if f.endswith('.json')]
        if json_files_current:
            print(f"📄 JSON files in current directory: {len(json_files_current)}")
            for file in json_files_current[:3]:
                print(f"   - {file}")
            if len(json_files_current) > 3:
                print(f"   ... and {len(json_files_current) - 3} more")
    
    def create_sample_files(self):
        """Create sample JSON files for testing import functionality"""
        try:
            # Create exports directory
            export_dir = "exported_data"
            if not os.path.exists(export_dir):
                os.makedirs(export_dir)
            
            # Sample disease data
            sample_diseases = {
                "diseases": [
                    {
                        "name": "sample_waterborne_disease",
                        "description": "This is a sample waterborne disease for testing import functionality",
                        "transmission": "Contaminated water and poor sanitation",
                        "severity": "Moderate to severe",
                        "treatment": "Antibiotics and supportive care",
                        "prevention": "Safe drinking water and good hygiene",
                        "region_specific_info": "Common during monsoon season in Northeast India",
                        "symptoms": ["sample diarrhea", "sample fever", "sample dehydration", "sample nausea"]
                    },
                    {
                        "name": "example_viral_infection",
                        "description": "Example viral infection for demonstration",
                        "transmission": "Contaminated food and water",
                        "severity": "Mild to moderate",
                        "treatment": "Supportive care and rest",
                        "prevention": "Vaccination and hygiene",
                        "region_specific_info": "More common in rural areas of Northeast India",
                        "symptoms": ["example fatigue", "example headache", "example muscle pain"]
                    }
                ],
                "synonyms": {
                    "loose motions": "diarrhea",
                    "pet kharab": "stomach upset",
                    "bukhar": "fever",
                    "kamjori": "weakness"
                },
                "created_date": datetime.now().isoformat(),
                "description": "Sample import file created for testing purposes"
            }
            
            # Create sample files
            sample_files = [
                ("sample_import_diseases.json", sample_diseases),
                ("test_diseases_import.json", {
                    "diseases": [sample_diseases["diseases"][0]],  # Only first disease
                    "synonyms": {"sample term": "original term"}
                })
            ]
            
            created_files = []
            for filename, data in sample_files:
                filepath = os.path.join(export_dir, filename)
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                created_files.append(filepath)
            
            print("✅ Sample JSON files created successfully!")
            for file in created_files:
                print(f"   📄 {os.path.abspath(file)}")
            
            print("\n💡 You can now test the import functionality using these sample files.")
            print("   They contain example diseases with proper JSON structure.")
            
        except Exception as e:
            print(f"❌ Error creating sample files: {e}")
    
    def view_all_diseases(self):
        """Display all diseases in the database"""
        diseases = self.db_manager.get_all_diseases()
        
        if not diseases:
            print("📋 No diseases found in database.")
            return
        
        print(f"\n📋 Found {len(diseases)} diseases in database:\n")
        
        for disease in diseases:
            print(f"ID: {disease['id']}")
            print(f"Name: {disease['name'].replace('_', ' ').title()}")
            print(f"Description: {disease['description'][:100]}...")
            print(f"Symptoms: {', '.join(disease['symptoms'][:5])}{'...' if len(disease['symptoms']) > 5 else ''}")
            print("-" * 50)
    
    def add_new_disease_interactive(self):
        """Interactive disease addition"""
        print("\n➕ ADD NEW DISEASE")
        print("=" * 30)
        
        try:
            name = input("Disease name: ").strip().lower().replace(" ", "_")
            description = input("Description: ").strip()
            transmission = input("Transmission method: ").strip()
            severity = input("Severity level: ").strip()
            treatment = input("Treatment: ").strip()
            prevention = input("Prevention measures: ").strip()
            region_info = input("Northeast India specific info (optional): ").strip()
            
            print("\nEnter symptoms (type 'done' when finished):")
            symptoms = []
            while True:
                symptom = input(f"Symptom {len(symptoms) + 1}: ").strip()
                if symptom.lower() == 'done':
                    break
                if symptom:
                    symptoms.append(symptom)
            
            if len(symptoms) == 0:
                print("❌ At least one symptom is required!")
                return
            
            disease_id = self.db_manager.add_disease(
                name, description, transmission, severity, 
                treatment, prevention, symptoms, region_info
            )
            
            if disease_id > 0:
                self.refresh_data()
                print("✅ Disease added successfully! Chatbot data refreshed.")
        
        except KeyboardInterrupt:
            print("\n❌ Operation cancelled.")
    
    def update_disease_interactive(self):
        """Interactive disease update"""
        self.view_all_diseases()
        
        try:
            disease_id = int(input("\nEnter disease ID to update: "))
            disease = self.db_manager.get_disease_by_id(disease_id)
            
            if not disease:
                print("❌ Disease not found!")
                return
            
            print(f"\nUpdating: {disease['name'].replace('_', ' ').title()}")
            print("(Press Enter to keep current value)\n")
            
            # Get updates
            updates = {}
            
            new_desc = input(f"Description [{disease['description'][:50]}...]: ").strip()
            if new_desc:
                updates['description'] = new_desc
            
            new_transmission = input(f"Transmission [{disease['transmission']}]: ").strip()
            if new_transmission:
                updates['transmission'] = new_transmission
            
            # ... (continue for other fields)
            
            if updates:
                if self.db_manager.update_disease(disease_id, **updates):
                    self.refresh_data()
                    print("✅ Disease updated successfully!")
        
        except ValueError:
            print("❌ Invalid disease ID!")
        except KeyboardInterrupt:
            print("\n❌ Operation cancelled.")
    
    def delete_disease_interactive(self):
        """Interactive disease deletion"""
        self.view_all_diseases()
        
        try:
            disease_id = int(input("\nEnter disease ID to delete: "))
            disease = self.db_manager.get_disease_by_id(disease_id)
            
            if not disease:
                print("❌ Disease not found!")
                return
            
            confirm = input(f"Are you sure you want to delete '{disease['name']}'? (yes/no): ")
            if confirm.lower() == 'yes':
                if self.db_manager.delete_disease(disease_id):
                    self.refresh_data()
                    print("✅ Disease deleted successfully!")
        
        except ValueError:
            print("❌ Invalid disease ID!")
        except KeyboardInterrupt:
            print("\n❌ Operation cancelled.")
    
    def add_synonym_interactive(self):
        """Interactive synonym addition"""
        try:
            original = input("Original symptom term: ").strip().lower()
            synonym = input("Synonym/local term: ").strip().lower()
            language = input("Language (default: english): ").strip() or "english"
            
            self.db_manager.add_synonym(original, synonym, language)
            self.refresh_data()
            print("✅ Synonym added successfully!")
        
        except KeyboardInterrupt:
            print("\n❌ Operation cancelled.")
    
    def export_to_json(self):
        """Export database to JSON file"""
        try:
            diseases = self.db_manager.get_all_diseases()
            synonyms = self.db_manager.get_all_synonyms()
            
            data = {
                'diseases': diseases,
                'synonyms': synonyms,
                'export_date': datetime.now().isoformat()
            }
            
            filename = f"disease_database_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Database exported to {filename}")
        
        except Exception as e:
            print(f"❌ Export failed: {e}")
    
    def import_from_json(self):
        """Import diseases from JSON file"""
        filename = input("Enter JSON filename to import: ").strip()
        
        try:
            if not os.path.exists(filename):
                print("❌ File not found!")
                return
            
            with open(filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if 'diseases' in data:
                for disease in data['diseases']:
                    # Skip ID field for import
                    symptoms = disease.pop('symptoms', [])
                    disease.pop('id', None)
                    
                    self.db_manager.add_disease(**disease, symptoms=symptoms)
            
            if 'synonyms' in data:
                for synonym, original in data['synonyms'].items():
                    self.db_manager.add_synonym(original, synonym)
            
            self.refresh_data()
            print("✅ Data imported successfully!")
        
        except Exception as e:
            print(f"❌ Import failed: {e}")
    
    def chat(self):
        """Main chat interface"""
        print("🏥 Northeast India Waterborne Disease Assessment Chatbot 🏥")
        print("=" * 70)
        print("I can help assess potential waterborne diseases based on your symptoms.")
        print("Type 'quit' to exit, 'admin' for database management, 'help' for guidance.\n")
        
        while True:
            user_input = input("You: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'bye']:
                print("Chatbot: Take care! Stay healthy and drink safe water. 🙏")
                break
            
            elif user_input.lower() == 'admin':
                self.admin_menu()
            
            elif user_input.lower() == 'help':
                print("""
Chatbot: Here's how to use me effectively:

1. Describe your symptoms clearly, for example:
   - "I have severe diarrhea and vomiting"
   - "I'm experiencing yellow eyes and fatigue"
   - "I have high fever, headache, and stomach pain"

2. Use common terms - I understand both medical and everyday language
3. Mention multiple symptoms for better accuracy
4. Type 'admin' to manage the disease database
5. Remember: I'm a screening tool, not a replacement for medical care

Currently loaded diseases: {len(self.diseases)} diseases in database
                """.format(len=len))
            
            elif len(user_input.strip()) < 5:
                print("Chatbot: Please provide more details about your symptoms so I can help you better.")
            
            else:
                print("\nChatbot: Let me analyze your symptoms...\n")
                disease_matches = self.diagnose_disease(user_input)
                response = self.format_response(disease_matches)
                print("Chatbot:", response)
                print("\n" + "="*70 + "\n")


# Web API functions
def create_web_api_response(user_symptoms: str, db_path: str = "waterborne_diseases.db") -> Dict:
    """Function to be used in web API - returns structured JSON response"""
    chatbot = WaterborneDiseaseChatbot(db_path)
    disease_matches = chatbot.diagnose_disease(user_symptoms)
    
    if not disease_matches:
        return {
            "status": "no_match",
            "message": "Could not identify specific diseases",
            "advice": "Please consult a healthcare professional",
            "diseases": []
        }
    
    diseases_data = []
    for disease, score, matching_symptoms in disease_matches:
        diseases_data.append({
            "id": disease['id'],
            "name": disease['name'].replace("_", " ").title(),
            "confidence": round(score, 2),
            "description": disease["description"],
            "matching_symptoms": matching_symptoms,
            "transmission": disease["transmission"],
            "severity": disease["severity"],
            "treatment": disease["treatment"],
            "prevention": disease["prevention"],
            "region_specific_info": disease.get("region_specific_info", "")
        })
    
    return {
        "status": "success",
        "diseases": diseases_data,
        "disclaimer": "This is an AI assessment tool. Seek professional medical advice for accurate diagnosis."
    }


# Example Flask web application integration
def create_flask_app():
    """Create a Flask web application for the chatbot"""
    try:
        from flask import Flask, request, jsonify, render_template_string
    except ImportError:
        print("Flask not installed. Install with: pip install flask")
        return None
    
    app = Flask(__name__)
    
    HTML_TEMPLATE = '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Northeast India Waterborne Disease Chatbot</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .chat-container { border: 1px solid #ddd; height: 400px; overflow-y: auto; padding: 10px; margin: 10px 0; }
            .user-msg { background: #e3f2fd; padding: 10px; margin: 5px 0; border-radius: 5px; }
            .bot-msg { background: #f5f5f5; padding: 10px; margin: 5px 0; border-radius: 5px; }
            input[type="text"] { width: 70%; padding: 10px; }
            button { padding: 10px 20px; background: #2196f3; color: white; border: none; cursor: pointer; }
            .disclaimer { background: #fff3cd; padding: 15px; margin: 10px 0; border-radius: 5px; }
        </style>
    </head>
    <body>
        <h1>🏥 Northeast India Waterborne Disease Assessment</h1>
        
        <div class="disclaimer">
            <strong>⚠️ Medical Disclaimer:</strong> This tool is for educational purposes only and should not replace professional medical diagnosis. 
            If you have severe symptoms, contact your nearest healthcare facility or call 108 (Emergency Services).
        </div>
        
        <div id="chat-container" class="chat-container">
            <div class="bot-msg">
                Hi! I can help assess potential waterborne diseases based on your symptoms. 
                Please describe what you're experiencing (e.g., "I have diarrhea, fever, and stomach pain").
            </div>
        </div>
        
        <div>
            <input type="text" id="user-input" placeholder="Describe your symptoms..." onkeypress="if(event.keyCode==13) sendMessage()">
            <button onclick="sendMessage()">Send</button>
            <button onclick="clearChat()">Clear</button>
        </div>
        
        <div style="margin-top: 20px;">
            <h3>Quick Links for Northeast India:</h3>
            <ul>
                <li>Emergency: 108</li>
                <li>Find nearest PHC: Contact local health department</li>
                <li>Vaccination centers: Government health facilities</li>
            </ul>
        </div>
        
        <script>
            function sendMessage() {
                const input = document.getElementById('user-input');
                const message = input.value.trim();
                if (!message) return;
                
                // Add user message to chat
                addMessageToChat(message, 'user-msg');
                input.value = '';
                
                // Show loading
                addMessageToChat('Analyzing your symptoms...', 'bot-msg');
                
                // Send to API
                fetch('/diagnose', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ symptoms: message })
                })
                .then(response => response.json())
                .then(data => {
                    // Remove loading message
                    const chatContainer = document.getElementById('chat-container');
                    chatContainer.removeChild(chatContainer.lastChild);
                    
                    // Add bot response
                    let response = formatResponse(data);
                    addMessageToChat(response, 'bot-msg');
                })
                .catch(error => {
                    console.error('Error:', error);
                    addMessageToChat('Sorry, there was an error processing your request. Please try again.', 'bot-msg');
                });
            }
            
            function addMessageToChat(message, className) {
                const chatContainer = document.getElementById('chat-container');
                const messageDiv = document.createElement('div');
                messageDiv.className = className;
                messageDiv.innerHTML = message.replace(/\\n/g, '<br>');
                chatContainer.appendChild(messageDiv);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
            
            function formatResponse(data) {
                if (data.status === 'no_match') {
                    return data.message + '<br><br>' + data.advice;
                }
                
                let response = 'Based on your symptoms, here are possible waterborne diseases:<br><br>';
                
                data.diseases.forEach((disease, index) => {
                    response += `<strong>${index + 1}. ${disease.name}</strong> (Confidence: ${disease.confidence})<br>`;
                    response += `Description: ${disease.description}<br>`;
                    
                    if (disease.matching_symptoms.length > 0) {
                        response += `Your matching symptoms: ${disease.matching_symptoms.join(', ')}<br>`;
                    }
                    
                    response += `Transmission: ${disease.transmission}<br>`;
                    response += `Severity: ${disease.severity}<br>`;
                    response += `Treatment: ${disease.treatment}<br>`;
                    response += `Prevention: ${disease.prevention}<br>`;
                    
                    if (disease.region_specific_info) {
                        response += `<em>Northeast India Info: ${disease.region_specific_info}</em><br>`;
                    }
                    response += '<br>';
                });
                
                response += '<strong>⚠️ ' + data.disclaimer + '</strong>';
                return response;
            }
            
            function clearChat() {
                const chatContainer = document.getElementById('chat-container');
                chatContainer.innerHTML = '<div class="bot-msg">Chat cleared. How can I help you?</div>';
            }
        </script>
    </body>
    </html>
    '''
    
    @app.route('/')
    def index():
        return render_template_string(HTML_TEMPLATE)
    
    @app.route('/diagnose', methods=['POST'])
    def diagnose():
        try:
            data = request.get_json()
            symptoms = data.get('symptoms', '')
            
            if not symptoms:
                return jsonify({
                    "status": "error",
                    "message": "No symptoms provided"
                })
            
            result = create_web_api_response(symptoms)
            return jsonify(result)
        
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": f"Server error: {str(e)}"
            })
    
    @app.route('/admin/diseases', methods=['GET'])
    def get_diseases():
        """API endpoint to get all diseases"""
        try:
            db_manager = DiseaseDatabaseManager()
            diseases = db_manager.get_all_diseases()
            return jsonify({"status": "success", "diseases": diseases})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)})
    
    @app.route('/admin/diseases', methods=['POST'])
    def add_disease_api():
        """API endpoint to add a new disease"""
        try:
            data = request.get_json()
            db_manager = DiseaseDatabaseManager()
            
            disease_id = db_manager.add_disease(
                name=data['name'],
                description=data['description'],
                transmission=data['transmission'],
                severity=data['severity'],
                treatment=data['treatment'],
                prevention=data['prevention'],
                symptoms=data['symptoms'],
                region_specific_info=data.get('region_specific_info', '')
            )
            
            if disease_id > 0:
                return jsonify({"status": "success", "disease_id": disease_id})
            else:
                return jsonify({"status": "error", "message": "Disease already exists"})
        
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)})
    
    return app


# Database utilities
class DatabaseUtils:
    """Utility functions for database management"""
    
    @staticmethod
    def backup_database(source_db: str, backup_path: str = None):
        """Create a backup of the database"""
        if backup_path is None:
            backup_path = f"backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db"
        
        try:
            import shutil
            shutil.copy2(source_db, backup_path)
            print(f"✅ Database backed up to {backup_path}")
            return backup_path
        except Exception as e:
            print(f"❌ Backup failed: {e}")
            return None
    
    @staticmethod
    def restore_database(backup_path: str, target_db: str):
        """Restore database from backup"""
        try:
            import shutil
            shutil.copy2(backup_path, target_db)
            print(f"✅ Database restored from {backup_path}")
            return True
        except Exception as e:
            print(f"❌ Restore failed: {e}")
            return False
    
    @staticmethod
    def get_database_stats(db_path: str):
        """Get database statistics"""
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Get table counts
            cursor.execute("SELECT COUNT(*) FROM diseases")
            disease_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM symptoms")
            symptom_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM symptom_synonyms")
            synonym_count = cursor.fetchone()[0]
            
            # Get database size
            cursor.execute("SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()")
            db_size = cursor.fetchone()[0]
            
            conn.close()
            
            stats = {
                "diseases": disease_count,
                "symptoms": symptom_count,
                "synonyms": synonym_count,
                "database_size_bytes": db_size,
                "database_size_mb": round(db_size / (1024 * 1024), 2)
            }
            
            return stats
        
        except Exception as e:
            print(f"❌ Error getting database stats: {e}")
            return None


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "web":
            # Run web application
            app = create_flask_app()
            if app:
                print("🌐 Starting web application...")
                print("Access the chatbot at: http://localhost:5000")
                print("API endpoint: http://localhost:5000/diagnose")
                app.run(debug=True, host='0.0.0.0', port=5000)
            else:
                print("❌ Flask not available. Install with: pip install flask")
        
        elif sys.argv[1] == "backup":
            # Create database backup
            db_path = sys.argv[2] if len(sys.argv) > 2 else "waterborne_diseases.db"
            DatabaseUtils.backup_database(db_path)
        
        elif sys.argv[1] == "stats":
            # Show database statistics
            db_path = sys.argv[2] if len(sys.argv) > 2 else "waterborne_diseases.db"
            stats = DatabaseUtils.get_database_stats(db_path)
            if stats:
                print("\n📊 Database Statistics:")
                print(f"Diseases: {stats['diseases']}")
                print(f"Symptoms: {stats['symptoms']}")
                print(f"Synonyms: {stats['synonyms']}")
                print(f"Database size: {stats['database_size_mb']} MB")
        
        else:
            print("Usage:")
            print("  python script.py          - Run terminal chatbot")
            print("  python script.py web      - Run web application")
            print("  python script.py backup   - Create database backup")
            print("  python script.py stats    - Show database statistics")
    
    else:
        # Default: Run terminal chatbot
        try:
            chatbot = WaterborneDiseaseChatbot()
            chatbot.chat()
        except KeyboardInterrupt:
            print("\n\nChatbot: Session ended. Stay healthy! 🙏")
        except Exception as e:
            print(f"Error: {e}")
            print("Please check your database and try again.")
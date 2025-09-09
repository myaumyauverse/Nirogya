# Northeast India Waterborne Disease Assessment Chatbot

An AI-powered chatbot system designed to help assess potential waterborne diseases based on symptoms, specifically tailored for Northeast India. This tool provides educational information and preliminary screening but should not replace professional medical diagnosis.

## Features

- **Symptom Analysis**: Uses TF-IDF vectorization and cosine similarity to match user symptoms with disease databases
- **Regional Focus**: Tailored for Northeast India with region-specific information and local terminology
- **Multi-language Support**: Understands common local terms and synonyms
- **Database Management**: Complete admin interface for managing diseases, symptoms, and synonyms
- **Multiple Interfaces**: Terminal chatbot, web application, and API endpoints
- **Data Import/Export**: JSON-based data management for easy updates

## Installation

### Requirements
```bash
pip install scikit-learn numpy sqlite3 flask
```

### Quick Start
1. Clone or download the script
2. Run the terminal version:
   ```bash
   python waterborne_disease_chatbot.py
   ```
3. For web interface:
   ```bash
   python waterborne_disease_chatbot.py web
   ```

## Usage

### Terminal Interface
- Start the chatbot and describe your symptoms in natural language
- Type `admin` to access database management
- Type `help` for usage instructions
- Type `quit` to exit

### Web Interface
- Access at `http://localhost:5000` after running with `web` parameter
- Interactive chat interface with region-specific health resources
- API endpoint available at `/diagnose` for integration

### Admin Features
- View all diseases in database
- Add/update/delete diseases
- Manage symptom synonyms
- Import/export data in JSON format
- Database backup and statistics

## Command Line Options

```bash
python waterborne_disease_chatbot.py          # Terminal chatbot
python waterborne_disease_chatbot.py web      # Web application
python waterborne_disease_chatbot.py backup   # Create database backup
python waterborne_disease_chatbot.py stats    # Show database statistics
```

## Database Structure

The system uses SQLite with four main tables:
- `diseases`: Core disease information
- `symptoms`: Individual symptoms linked to diseases
- `symptom_synonyms`: Local terms and translations
- `prevention_tips`: Regional prevention advice

## Sample Usage

```
You: I have severe diarrhea, vomiting, and dehydration
Chatbot: Based on your symptoms, possible diseases include:
1. Cholera (Confidence: 0.85)
   - Symptoms match: severe watery diarrhea, vomiting, dehydration
   - Treatment: Immediate oral rehydration therapy...
```

## Important Disclaimers

- This is an educational tool, not a medical diagnostic device
- Always seek professional medical care for concerning symptoms
- In emergencies, contact nearest Primary Health Centre or call 108
- Designed specifically for waterborne diseases common in Northeast India

## File Structure

```
waterborne_diseases.db          # SQLite database (auto-created)
exported_data/                  # JSON export directory
sample_import_diseases.json     # Sample data files
backup_YYYYMMDD_HHMMSS.db      # Database backups
```

## Data Management

### Export Data
```python
# Exports to timestamped JSON file
chatbot.export_to_json()
```

### Import Data
```python
# Import from JSON file
chatbot.import_from_json("filename.json")
```

### JSON Format
```json
{
  "diseases": [...],
  "synonyms": {...},
  "export_date": "ISO timestamp"
}
```

## API Integration

For web applications, use the API endpoint:
```python
response = create_web_api_response("user symptoms")
# Returns structured JSON with disease matches
```

## Development Notes

- Uses scikit-learn for symptom matching via TF-IDF vectors
- SQLite database with foreign key constraints
- Modular design allows easy extension
- Includes sample data for common waterborne diseases
- Error handling and input validation throughout

## Regional Customization

The system includes Northeast India specific features:
- Local terminology recognition (Hindi/regional terms)
- Monsoon-related health advisories
- Government health service references
- Regional vaccination information

## License

Educational use. Ensure compliance with local healthcare regulations when deploying.

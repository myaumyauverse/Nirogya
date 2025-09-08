#!/usr/bin/env python3
"""
Mock News Data Service
=====================
Provides realistic mock data for the news ticker during development and testing.
This simulates real alerts from WaterNet ICMR and Meersens API.

Usage:
    python mock_news_data.py
"""

import random
from datetime import datetime, timedelta
from typing import List, Dict, Any

class MockNewsDataService:
    """Generate realistic mock news ticker data"""
    
    def __init__(self):
        self.northeast_cities = [
            {"name": "Guwahati", "state": "Assam"},
            {"name": "Imphal", "state": "Manipur"},
            {"name": "Shillong", "state": "Meghalaya"},
            {"name": "Agartala", "state": "Tripura"},
            {"name": "Aizawl", "state": "Mizoram"},
            {"name": "Kohima", "state": "Nagaland"},
            {"name": "Itanagar", "state": "Arunachal Pradesh"},
            {"name": "Gangtok", "state": "Sikkim"}
        ]
        
        self.disease_templates = [
            {
                "disease": "Cholera",
                "action": "Boil water before drinking!",
                "severity": ["high", "critical"]
            },
            {
                "disease": "Typhoid",
                "action": "Ensure water purification!",
                "severity": ["medium", "high"]
            },
            {
                "disease": "Hepatitis A",
                "action": "Avoid contaminated water sources!",
                "severity": ["medium", "high"]
            },
            {
                "disease": "Acute Diarrheal Disease",
                "action": "Practice good hygiene!",
                "severity": ["low", "medium"]
            },
            {
                "disease": "Gastroenteritis",
                "action": "Stay hydrated with safe water!",
                "severity": ["low", "medium"]
            }
        ]
        
        self.water_quality_templates = [
            {
                "issue": "High bacterial contamination",
                "action": "Use water purification tablets",
                "severity": ["medium", "high"]
            },
            {
                "issue": "Elevated nitrate levels",
                "action": "Avoid drinking tap water",
                "severity": ["medium"]
            },
            {
                "issue": "pH levels out of range",
                "action": "Use alternative water sources",
                "severity": ["low", "medium"]
            },
            {
                "issue": "Low dissolved oxygen",
                "action": "Monitor water quality",
                "severity": ["low"]
            }
        ]
        
        self.advisory_templates = [
            "Monsoon season water quality monitoring intensified",
            "Health department conducting water source inspections",
            "Community water purification drive launched",
            "Water quality testing camps organized",
            "Public health advisory on waterborne diseases issued"
        ]
    
    def generate_disease_alert(self) -> Dict[str, Any]:
        """Generate a realistic disease outbreak alert"""
        city = random.choice(self.northeast_cities)
        disease_info = random.choice(self.disease_templates)
        case_count = random.randint(5, 150)
        trend = random.choice(["rising", "increasing", "reported", "confirmed"])
        
        severity = random.choice(disease_info["severity"])
        
        message = f"{disease_info['disease']} cases {trend} in {city['name']}, {city['state']} ({case_count} cases)"
        
        return {
            "id": f"disease_{datetime.now().timestamp()}_{random.randint(1000, 9999)}",
            "text": f"{message} – {disease_info['action']}",
            "severity": severity,
            "region": f"{city['name']}, {city['state']}",
            "source": "WaterNet ICMR",
            "timestamp": (datetime.now() - timedelta(minutes=random.randint(0, 120))).isoformat(),
            "type": "disease_outbreak"
        }
    
    def generate_water_quality_alert(self) -> Dict[str, Any]:
        """Generate a realistic water quality alert"""
        city = random.choice(self.northeast_cities)
        water_info = random.choice(self.water_quality_templates)
        quality_index = random.randint(60, 95)
        
        severity = random.choice(water_info["severity"])
        
        message = f"Water quality alert in {city['name']}, {city['state']} - {water_info['issue']} (Quality index: {quality_index}/100)"
        
        return {
            "id": f"water_{datetime.now().timestamp()}_{random.randint(1000, 9999)}",
            "text": f"{message} – {water_info['action']}",
            "severity": severity,
            "region": f"{city['name']}, {city['state']}",
            "source": "Meersens API",
            "timestamp": (datetime.now() - timedelta(minutes=random.randint(0, 60))).isoformat(),
            "type": "water_quality"
        }
    
    def generate_advisory_alert(self) -> Dict[str, Any]:
        """Generate a general advisory alert"""
        advisory = random.choice(self.advisory_templates)
        region = random.choice(["Northeast India", "Assam", "Manipur", "Meghalaya"])
        
        return {
            "id": f"advisory_{datetime.now().timestamp()}_{random.randint(1000, 9999)}",
            "text": f"{advisory} in {region} – Stay informed!",
            "severity": "low",
            "region": region,
            "source": "Health Department",
            "timestamp": (datetime.now() - timedelta(minutes=random.randint(0, 180))).isoformat(),
            "type": "advisory"
        }
    
    def generate_contamination_alert(self) -> Dict[str, Any]:
        """Generate a contamination alert"""
        city = random.choice(self.northeast_cities)
        contamination_types = [
            "Industrial discharge detected",
            "Agricultural runoff contamination",
            "Sewage overflow reported",
            "Chemical contamination suspected"
        ]
        
        contamination = random.choice(contamination_types)
        
        return {
            "id": f"contamination_{datetime.now().timestamp()}_{random.randint(1000, 9999)}",
            "text": f"{contamination} in {city['name']}, {city['state']} – Avoid water contact!",
            "severity": random.choice(["medium", "high"]),
            "region": f"{city['name']}, {city['state']}",
            "source": "Environmental Monitoring",
            "timestamp": (datetime.now() - timedelta(minutes=random.randint(0, 90))).isoformat(),
            "type": "contamination"
        }
    
    def generate_mock_alerts(self, count: int = 8) -> List[Dict[str, Any]]:
        """Generate a mix of realistic mock alerts"""
        alerts = []
        
        # Generate different types of alerts
        alert_generators = [
            (self.generate_disease_alert, 0.4),      # 40% disease alerts
            (self.generate_water_quality_alert, 0.3), # 30% water quality alerts
            (self.generate_advisory_alert, 0.2),     # 20% advisory alerts
            (self.generate_contamination_alert, 0.1) # 10% contamination alerts
        ]
        
        for _ in range(count):
            # Choose alert type based on weights
            rand = random.random()
            cumulative = 0
            
            for generator, weight in alert_generators:
                cumulative += weight
                if rand <= cumulative:
                    alerts.append(generator())
                    break
        
        # Sort by severity and timestamp
        severity_order = {"critical": 4, "high": 3, "medium": 2, "low": 1}
        alerts.sort(key=lambda x: (severity_order.get(x["severity"], 0), x["timestamp"]), reverse=True)
        
        return alerts[:count]
    
    def get_mock_response(self) -> Dict[str, Any]:
        """Get a complete mock response for the API"""
        alerts = self.generate_mock_alerts(6)
        
        return {
            "success": True,
            "alerts": alerts,
            "last_updated": datetime.now().isoformat(),
            "next_update": (datetime.now() + timedelta(hours=1)).isoformat(),
            "total_alerts": len(alerts)
        }

# Global instance for easy import
mock_service = MockNewsDataService()

def get_mock_alerts() -> List[Dict[str, Any]]:
    """Get mock alerts for testing"""
    return mock_service.generate_mock_alerts()

def get_mock_response() -> Dict[str, Any]:
    """Get complete mock response"""
    return mock_service.get_mock_response()

if __name__ == "__main__":
    # Test the mock service
    print("🧪 Mock News Ticker Data Service")
    print("=" * 40)
    
    response = mock_service.get_mock_response()
    print(f"Generated {len(response['alerts'])} mock alerts:")
    print()
    
    for i, alert in enumerate(response['alerts'], 1):
        severity_emoji = {
            "critical": "🔴",
            "high": "🟠", 
            "medium": "🟡",
            "low": "🟢"
        }.get(alert['severity'], "⚪")
        
        print(f"{i}. {severity_emoji} [{alert['severity'].upper()}] {alert['text']}")
        print(f"   📍 {alert['region']} | 📡 {alert['source']} | 🕒 {alert['timestamp'][:16]}")
        print()
    
    print(f"Last updated: {response['last_updated'][:19]}")
    print(f"Next update: {response['next_update'][:19]}")

#!/usr/bin/env python3
"""
Flash News Ticker Service
========================
Real-time alert fetching service for WaterNet (ICMR) surveillance platform
and Meersens API integration for Northeast India water quality alerts.

Features:
- WaterNet (ICMR) surveillance data fetching
- Meersens API water quality data integration
- Region-specific alert formatting for Northeast India
- Automatic hourly updates
- Alert prioritization and filtering
- Concise, actionable alert messages

Author: Nirogya Team
Date: September 2025
"""

import asyncio
import aiohttp
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
import os
from enum import Enum

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AlertSeverity(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class AlertType(Enum):
    DISEASE_OUTBREAK = "disease_outbreak"
    WATER_QUALITY = "water_quality"
    CONTAMINATION = "contamination"
    ADVISORY = "advisory"

@dataclass
class Alert:
    id: str
    title: str
    message: str
    region: str
    severity: AlertSeverity
    alert_type: AlertType
    timestamp: datetime
    source: str
    action_required: str
    expires_at: Optional[datetime] = None

class WaterNetICMRClient:
    """Client for WaterNet (ICMR) surveillance platform"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('WATERNET_API_KEY')
        self.base_url = "https://api.waternet.icmr.gov.in/v1"  # Hypothetical endpoint
        self.northeast_states = [
            "Assam", "Arunachal Pradesh", "Manipur", "Meghalaya", 
            "Mizoram", "Nagaland", "Tripura", "Sikkim"
        ]
    
    async def fetch_surveillance_data(self, session: aiohttp.ClientSession) -> List[Dict[str, Any]]:
        """Fetch surveillance data from WaterNet ICMR"""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            # Fetch data for Northeast India
            params = {
                "region": "northeast_india",
                "states": ",".join(self.northeast_states),
                "alert_types": "outbreak,contamination,advisory",
                "time_range": "24h",
                "severity": "medium,high,critical"
            }
            
            async with session.get(f"{self.base_url}/alerts", headers=headers, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    logger.info(f"Fetched {len(data.get('alerts', []))} alerts from WaterNet ICMR")
                    return data.get('alerts', [])
                else:
                    logger.error(f"WaterNet ICMR API error: {response.status}")
                    return []
                    
        except Exception as e:
            logger.error(f"Error fetching WaterNet ICMR data: {e}")
            return []

class MeersensClient:
    """Client for Meersens API water quality data"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('MEERSENS_API_KEY')
        self.base_url = "https://api.meersens.com/environment/public/water/current"
        
        # Major cities in Northeast India with coordinates
        self.northeast_cities = {
            "Guwahati": {"lat": 26.1445, "lng": 91.7362, "state": "Assam"},
            "Imphal": {"lat": 24.8170, "lng": 93.9368, "state": "Manipur"},
            "Shillong": {"lat": 25.5788, "lng": 91.8933, "state": "Meghalaya"},
            "Agartala": {"lat": 23.8315, "lng": 91.2868, "state": "Tripura"},
            "Aizawl": {"lat": 23.7307, "lng": 92.7173, "state": "Mizoram"},
            "Kohima": {"lat": 25.6751, "lng": 94.1086, "state": "Nagaland"},
            "Itanagar": {"lat": 27.0844, "lng": 93.6053, "state": "Arunachal Pradesh"},
            "Gangtok": {"lat": 27.3389, "lng": 88.6065, "state": "Sikkim"}
        }
    
    async def fetch_water_quality_data(self, session: aiohttp.ClientSession) -> List[Dict[str, Any]]:
        """Fetch water quality data from Meersens API"""
        alerts = []
        
        try:
            headers = {
                "X-API-Key": self.api_key,
                "Content-Type": "application/json"
            }
            
            for city, coords in self.northeast_cities.items():
                params = {
                    "lat": coords["lat"],
                    "lng": coords["lng"],
                    "index_type": "meersens"
                }
                
                try:
                    async with session.get(self.base_url, headers=headers, params=params) as response:
                        if response.status == 200:
                            data = await response.json()
                            water_quality = self._process_water_quality_data(data, city, coords["state"])
                            if water_quality:
                                alerts.append(water_quality)
                        else:
                            logger.warning(f"Meersens API error for {city}: {response.status}")
                            
                except Exception as e:
                    logger.error(f"Error fetching Meersens data for {city}: {e}")
                    continue
                    
                # Rate limiting - small delay between requests
                await asyncio.sleep(0.1)
                
        except Exception as e:
            logger.error(f"Error in Meersens API client: {e}")
            
        logger.info(f"Fetched water quality data for {len(alerts)} cities from Meersens")
        return alerts
    
    def _process_water_quality_data(self, data: Dict[str, Any], city: str, state: str) -> Optional[Dict[str, Any]]:
        """Process Meersens water quality data into alert format"""
        try:
            water_index = data.get('water', {}).get('index', {})
            index_value = water_index.get('value', 0)
            index_label = water_index.get('label', 'Unknown')
            
            # Convert Meersens index to our alert system
            if index_value >= 75:  # Poor water quality
                severity = AlertSeverity.HIGH if index_value >= 90 else AlertSeverity.MEDIUM
                return {
                    'city': city,
                    'state': state,
                    'index_value': index_value,
                    'index_label': index_label,
                    'severity': severity,
                    'pollutants': data.get('water', {}).get('pollutants', [])
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Error processing water quality data for {city}: {e}")
            return None

class AlertProcessor:
    """Process and format alerts for the news ticker"""
    
    def __init__(self):
        self.disease_keywords = {
            'cholera': 'Boil water before drinking!',
            'typhoid': 'Ensure water purification!',
            'hepatitis': 'Avoid contaminated water sources!',
            'diarrhea': 'Practice good hygiene!',
            'dysentery': 'Seek immediate medical attention!',
            'gastroenteritis': 'Stay hydrated with safe water!'
        }
    
    def process_waternet_alerts(self, raw_alerts: List[Dict[str, Any]]) -> List[Alert]:
        """Process WaterNet ICMR alerts"""
        processed_alerts = []
        
        for alert_data in raw_alerts:
            try:
                alert = Alert(
                    id=alert_data.get('id', f"wn_{datetime.now().timestamp()}"),
                    title=alert_data.get('title', ''),
                    message=self._format_disease_alert(alert_data),
                    region=alert_data.get('region', 'Northeast India'),
                    severity=AlertSeverity(alert_data.get('severity', 'medium')),
                    alert_type=AlertType.DISEASE_OUTBREAK,
                    timestamp=datetime.fromisoformat(alert_data.get('timestamp', datetime.now().isoformat())),
                    source="WaterNet ICMR",
                    action_required=self._get_action_for_disease(alert_data.get('disease_type', '')),
                    expires_at=datetime.now() + timedelta(hours=24)
                )
                processed_alerts.append(alert)
                
            except Exception as e:
                logger.error(f"Error processing WaterNet alert: {e}")
                continue
        
        return processed_alerts
    
    def process_meersens_alerts(self, raw_alerts: List[Dict[str, Any]]) -> List[Alert]:
        """Process Meersens water quality alerts"""
        processed_alerts = []
        
        for alert_data in raw_alerts:
            try:
                city = alert_data.get('city', '')
                state = alert_data.get('state', '')
                index_value = alert_data.get('index_value', 0)
                
                message = f"Water quality alert in {city}, {state} - Quality index: {index_value}/100"
                action = "Use water purification methods" if index_value >= 90 else "Monitor water quality"
                
                alert = Alert(
                    id=f"meersens_{city}_{datetime.now().timestamp()}",
                    title=f"Water Quality Alert - {city}",
                    message=message,
                    region=f"{city}, {state}",
                    severity=alert_data.get('severity', AlertSeverity.MEDIUM),
                    alert_type=AlertType.WATER_QUALITY,
                    timestamp=datetime.now(),
                    source="Meersens API",
                    action_required=action,
                    expires_at=datetime.now() + timedelta(hours=6)
                )
                processed_alerts.append(alert)
                
            except Exception as e:
                logger.error(f"Error processing Meersens alert: {e}")
                continue
        
        return processed_alerts
    
    def _format_disease_alert(self, alert_data: Dict[str, Any]) -> str:
        """Format disease outbreak alert message"""
        disease = alert_data.get('disease_type', 'waterborne illness').lower()
        location = alert_data.get('location', alert_data.get('region', 'Northeast India'))
        case_count = alert_data.get('case_count', 0)
        trend = alert_data.get('trend', 'stable')
        
        trend_text = {
            'rising': 'cases rising',
            'increasing': 'cases increasing',
            'stable': 'cases reported',
            'declining': 'cases declining'
        }.get(trend, 'cases reported')
        
        if case_count > 0:
            return f"{disease.title()} {trend_text} in {location} ({case_count} cases)"
        else:
            return f"{disease.title()} {trend_text} in {location}"
    
    def _get_action_for_disease(self, disease_type: str) -> str:
        """Get recommended action for disease type"""
        disease_lower = disease_type.lower()
        for disease, action in self.disease_keywords.items():
            if disease in disease_lower:
                return action
        return "Follow health guidelines!"

class NewsTickerService:
    """Main service for managing news ticker alerts"""
    
    def __init__(self):
        self.waternet_client = WaterNetICMRClient()
        self.meersens_client = MeersensClient()
        self.alert_processor = AlertProcessor()
        self.current_alerts: List[Alert] = []
        self.last_update = None
    
    async def fetch_all_alerts(self) -> List[Alert]:
        """Fetch alerts from all sources"""
        all_alerts = []
        
        async with aiohttp.ClientSession() as session:
            # Fetch from WaterNet ICMR
            waternet_data = await self.waternet_client.fetch_surveillance_data(session)
            waternet_alerts = self.alert_processor.process_waternet_alerts(waternet_data)
            all_alerts.extend(waternet_alerts)
            
            # Fetch from Meersens (if API key available)
            if self.meersens_client.api_key:
                meersens_data = await self.meersens_client.fetch_water_quality_data(session)
                meersens_alerts = self.alert_processor.process_meersens_alerts(meersens_data)
                all_alerts.extend(meersens_alerts)
        
        # Sort by severity and timestamp
        all_alerts.sort(key=lambda x: (x.severity.value, x.timestamp), reverse=True)
        
        # Remove expired alerts
        current_time = datetime.now()
        active_alerts = [alert for alert in all_alerts if not alert.expires_at or alert.expires_at > current_time]
        
        self.current_alerts = active_alerts[:10]  # Keep top 10 alerts
        self.last_update = current_time
        
        logger.info(f"Updated alerts: {len(self.current_alerts)} active alerts")
        return self.current_alerts
    
    def get_ticker_messages(self) -> List[Dict[str, Any]]:
        """Get formatted messages for the ticker"""
        messages = []
        
        for alert in self.current_alerts:
            message = {
                'id': alert.id,
                'text': f"{alert.message} – {alert.action_required}",
                'severity': alert.severity.value,
                'region': alert.region,
                'source': alert.source,
                'timestamp': alert.timestamp.isoformat(),
                'type': alert.alert_type.value
            }
            messages.append(message)
        
        return messages
    
    async def start_periodic_updates(self, interval_hours: int = 1):
        """Start periodic alert updates"""
        while True:
            try:
                await self.fetch_all_alerts()
                await asyncio.sleep(interval_hours * 3600)  # Convert hours to seconds
            except Exception as e:
                logger.error(f"Error in periodic update: {e}")
                await asyncio.sleep(300)  # Wait 5 minutes before retry

# Global service instance
news_service = NewsTickerService()

async def get_latest_alerts() -> List[Dict[str, Any]]:
    """Get latest alerts for API endpoint"""
    if not news_service.current_alerts or not news_service.last_update or \
       (datetime.now() - news_service.last_update).total_seconds() > 3600:
        await news_service.fetch_all_alerts()
    
    return news_service.get_ticker_messages()

if __name__ == "__main__":
    # Test the service
    async def test_service():
        alerts = await news_service.fetch_all_alerts()
        print(f"Fetched {len(alerts)} alerts")
        for alert in alerts:
            print(f"- {alert.message} ({alert.severity.value})")
    
    asyncio.run(test_service())

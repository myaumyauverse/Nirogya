"""
SMS Alert Service using TextBee API
Sends alerts to emergency contacts when water quality risk is medium to high
"""

import requests
import logging
import os
from typing import List, Dict, Any
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '.env.sms'))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SMSAlertService:
    def __init__(self):
        # TextBee API configuration from environment variables
        self.base_url = 'https://api.textbee.dev/api/v1'
        self.api_key = os.getenv('TEXTBEE_API_KEY', 'YOUR_API_KEY')
        self.device_id = os.getenv('TEXTBEE_DEVICE_ID', 'YOUR_DEVICE_ID')
        
        # Emergency contact numbers from environment variables
        self.emergency_contacts = [
            os.getenv('EMERGENCY_CONTACT_1', '+917985419891'),
            os.getenv('EMERGENCY_CONTACT_2', '+917008520688'),
            os.getenv('EMERGENCY_CONTACT_3', '+91851282269')
        ]
        
        # Filter out any empty contacts
        self.emergency_contacts = [contact for contact in self.emergency_contacts if contact and contact != '']
        
        self.headers = {
            'x-api-key': self.api_key,
            'Content-Type': 'application/json'
        }
    
    def send_water_quality_alert(self, risk_level: str, risk_score: float, location: str = "", 
                               water_params: Dict[str, float] | None = None) -> Dict[str, Any]:
        """
        Send water quality alert SMS to emergency contacts
        
        Args:
            risk_level: Risk level (Medium, High, Critical)
            risk_score: Combined risk score (0-100)
            location: Location description
            water_params: Water quality parameters
            
        Returns:
            Dict with success status and response details
        """
        try:
            # Only send alerts for Medium, High, or Critical risk levels
            if risk_level.lower() not in ['medium', 'high', 'critical']:
                logger.info(f"No alert sent - Risk level '{risk_level}' is below threshold")
                return {
                    'success': False,
                    'message': f"Risk level '{risk_level}' does not require alert",
                    'sent_to': []
                }
            
            # Create alert message
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            # Risk level emoji mapping
            risk_emojis = {
                'medium': '🟡',
                'high': '🟠', 
                'critical': '🔴'
            }
            
            emoji = risk_emojis.get(risk_level.lower(), '⚠️')
            
            # Construct the alert message
            message = f"""
{emoji} WATER QUALITY ALERT {emoji}

Risk Level: {risk_level.upper()}
Risk Score: {risk_score:.1f}/100
Time: {timestamp}
{f"Location: {location}" if location else ""}

Critical Water Parameters:
"""
            
            # Add specific water parameter violations if available
            if water_params:
                violations = []
                
                # Check for critical violations
                if water_params.get('ph', 7) < 6.5 or water_params.get('ph', 7) > 8.5:
                    violations.append(f"pH: {water_params.get('ph', 'N/A')}")
                
                if water_params.get('dissolved_oxygen', 5) < 5:
                    violations.append(f"Low Oxygen: {water_params.get('dissolved_oxygen', 'N/A')} mg/L")
                
                if water_params.get('fecal_coliform', 0) > 50:
                    violations.append(f"High Fecal Coliform: {water_params.get('fecal_coliform', 'N/A')} CFU/100mL")
                
                if water_params.get('total_coliform', 0) > 500:
                    violations.append(f"High Total Coliform: {water_params.get('total_coliform', 'N/A')} CFU/100mL")
                
                if violations:
                    message += "\n".join(f"• {v}" for v in violations)
                else:
                    message += "Multiple parameters exceeded safe limits"
            else:
                message += "Parameters require immediate attention"
            
            message += f"""

IMMEDIATE ACTIONS REQUIRED:
• Restrict water use from contaminated sources
• Implement emergency water treatment
• Alert local health authorities
• Monitor for disease outbreaks

This is an automated alert from Nirogya Health Monitoring System.
"""
            
            # Send SMS to all emergency contacts
            sent_results = []
            failed_contacts = []
            
            for contact in self.emergency_contacts:
                try:
                    sms_response = self._send_sms(contact, message)
                    if sms_response.get('success', False):
                        sent_results.append({
                            'contact': contact,
                            'status': 'sent',
                            'message_id': sms_response.get('message_id', 'unknown')
                        })
                        logger.info(f"Alert sent successfully to {contact}")
                    else:
                        failed_contacts.append(contact)
                        logger.error(f"Failed to send alert to {contact}: {sms_response.get('error', 'Unknown error')}")
                        
                except Exception as e:
                    failed_contacts.append(contact)
                    logger.error(f"Exception sending SMS to {contact}: {str(e)}")
            
            return {
                'success': len(sent_results) > 0,
                'message': f"Alert sent to {len(sent_results)}/{len(self.emergency_contacts)} contacts",
                'sent_to': sent_results,
                'failed_contacts': failed_contacts,
                'risk_level': risk_level,
                'risk_score': risk_score,
                'timestamp': timestamp
            }
            
        except Exception as e:
            logger.error(f"Error in send_water_quality_alert: {str(e)}")
            return {
                'success': False,
                'message': f"Alert system error: {str(e)}",
                'sent_to': [],
                'failed_contacts': self.emergency_contacts
            }
    
    def _send_sms(self, phone_number: str, message: str) -> Dict[str, Any]:
        """
        Send SMS using TextBee API
        
        Args:
            phone_number: Recipient phone number with country code
            message: SMS message content
            
        Returns:
            Dict with API response
        """
        try:
            url = f'{self.base_url}/gateway/devices/{self.device_id}/send-sms'
            
            payload = {
                'recipients': [phone_number],
                'message': message
            }
            
            response = requests.post(url, json=payload, headers=self.headers, timeout=30)
            
            if response.status_code == 200:
                response_data = response.json()
                return {
                    'success': True,
                    'message_id': response_data.get('messageId', 'unknown'),
                    'response': response_data
                }
            else:
                return {
                    'success': False,
                    'error': f"HTTP {response.status_code}: {response.text}",
                    'status_code': response.status_code
                }
                
        except requests.exceptions.Timeout:
            return {
                'success': False,
                'error': 'SMS API request timed out'
            }
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': f'SMS API request failed: {str(e)}'
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Unexpected error: {str(e)}'
            }
    
    def send_test_alert(self) -> Dict[str, Any]:
        """
        Send a test alert to verify SMS functionality
        
        Returns:
            Dict with test results
        """
        test_message = """
🧪 TEST ALERT - Nirogya Health Monitoring System

This is a test message to verify SMS alert functionality.

If you receive this message, the emergency alert system is working correctly.

Time: """ + datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        sent_results = []
        failed_contacts = []
        
        for contact in self.emergency_contacts:
            try:
                response = self._send_sms(contact, test_message)
                if response.get('success', False):
                    sent_results.append(contact)
                else:
                    failed_contacts.append(contact)
            except Exception as e:
                failed_contacts.append(contact)
                logger.error(f"Test SMS failed for {contact}: {str(e)}")
        
        return {
            'success': len(sent_results) > 0,
            'sent_to': sent_results,
            'failed_contacts': failed_contacts,
            'message': f"Test completed: {len(sent_results)}/{len(self.emergency_contacts)} successful"
        }
    
    def update_emergency_contacts(self, new_contacts: List[str]) -> Dict[str, Any]:
        """
        Update the list of emergency contacts
        
        Args:
            new_contacts: List of phone numbers with country codes
            
        Returns:
            Dict with update status
        """
        try:
            # Validate phone numbers (basic validation)
            valid_contacts = []
            for contact in new_contacts:
                # Remove spaces and special characters except +
                cleaned = ''.join(c for c in contact if c.isdigit() or c == '+')
                if len(cleaned) >= 10:  # Minimum phone number length
                    valid_contacts.append(cleaned)
            
            if valid_contacts:
                self.emergency_contacts = valid_contacts
                logger.info(f"Updated emergency contacts: {valid_contacts}")
                return {
                    'success': True,
                    'message': f"Updated {len(valid_contacts)} emergency contacts",
                    'contacts': valid_contacts
                }
            else:
                return {
                    'success': False,
                    'message': "No valid phone numbers provided",
                    'contacts': []
                }
                
        except Exception as e:
            logger.error(f"Error updating emergency contacts: {str(e)}")
            return {
                'success': False,
                'message': f"Error updating contacts: {str(e)}",
                'contacts': []
            }

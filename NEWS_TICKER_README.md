# 📰 Nirogya Flash News Ticker

A dynamic, real-time alert system that displays health and water quality alerts for Northeast India at the top of the Nirogya website.

## 🎯 Features

### ✨ **Real-Time Data Sources**
- **WaterNet (ICMR)** surveillance platform integration
- **Meersens API** water quality monitoring
- **Region-specific alerts** for Northeast India states
- **Automatic hourly updates**

### 🎨 **Dynamic UI Components**
- **Animated ticker** with smooth transitions
- **Severity-based color coding** (Critical: Red, High: Orange, Medium: Yellow, Low: Blue)
- **Auto-rotation** through multiple alerts (8-second intervals)
- **Manual navigation** controls
- **Hover to pause** functionality
- **Progress bar** for auto-rotation timing

### 📱 **Responsive Design**
- **Mobile-optimized** layout
- **Touch-friendly** controls
- **Accessibility features** with ARIA labels
- **Smooth animations** using Framer Motion

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │  External APIs  │
│                 │    │                  │    │                 │
│ NewsTicker.tsx  │◄──►│ api_server.py    │◄──►│ WaterNet ICMR   │
│                 │    │                  │    │ Meersens API    │
│ - Auto-refresh  │    │ news_ticker_     │    │                 │
│ - Animations    │    │ service.py       │    │ Mock Data       │
│ - User controls │    │                  │    │ (Development)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### 1. **Setup**
```bash
# Run the setup script
python setup_news_ticker.py

# Or manual setup:
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys
```

### 2. **Development Mode (Mock Data)**
```bash
# Start backend
python backend/api_server.py

# Start frontend
cd frontend && npm run dev

# Visit http://localhost:3000 - News ticker will show mock alerts
```

### 3. **Production Mode (Real APIs)**
```bash
# Add API keys to backend/.env
WATERNET_API_KEY=your_key_here
MEERSENS_API_KEY=your_key_here
USE_MOCK_DATA=false

# Restart backend server
```

## 🔧 Configuration

### **Environment Variables** (`backend/.env`)

```bash
# API Keys
WATERNET_API_KEY=your_waternet_api_key
MEERSENS_API_KEY=your_meersens_api_key

# Settings
NEWS_TICKER_UPDATE_INTERVAL=1        # Hours between updates
NEWS_TICKER_MAX_ALERTS=10           # Maximum alerts to display
USE_MOCK_DATA=false                 # Use mock data for development

# Filtering
MIN_ALERT_SEVERITY=low              # Minimum severity to show
ALERT_TYPES=disease_outbreak,water_quality,contamination,advisory
FOCUS_REGIONS=Assam,Manipur,Meghalaya,Tripura,Mizoram,Nagaland,Arunachal Pradesh,Sikkim
```

## 📡 API Endpoints

### **GET /api/news-ticker**
Fetch current alerts for the ticker.

**Response:**
```json
{
  "success": true,
  "alerts": [
    {
      "id": "alert_123",
      "text": "Cholera cases rising in Guwahati – Boil water before drinking!",
      "severity": "high",
      "region": "Guwahati, Assam",
      "source": "WaterNet ICMR",
      "timestamp": "2025-09-08T18:30:00",
      "type": "disease_outbreak"
    }
  ],
  "last_updated": "2025-09-08T18:30:00",
  "next_update": "2025-09-08T19:30:00",
  "total_alerts": 5
}
```

### **GET /api/news-ticker/health**
Check news ticker service health.

## 🎨 Alert Types & Formatting

### **Disease Outbreak Alerts**
- **Format:** `{Disease} cases {trend} in {location} ({count} cases) – {action}!`
- **Example:** `Cholera cases rising in Guwahati (45 cases) – Boil water before drinking!`
- **Source:** WaterNet ICMR
- **Colors:** High/Critical severity

### **Water Quality Alerts**
- **Format:** `Water quality alert in {location} - {issue} (Quality index: {value}/100) – {action}!`
- **Example:** `Water quality alert in Imphal - High bacterial contamination (Quality index: 85/100) – Use water purification tablets!`
- **Source:** Meersens API
- **Colors:** Medium/High severity

### **Contamination Alerts**
- **Format:** `{Contamination type} in {location} – {action}!`
- **Example:** `Industrial discharge detected in Shillong – Avoid water contact!`
- **Source:** Environmental Monitoring
- **Colors:** Medium/High severity

### **Advisory Alerts**
- **Format:** `{Advisory message} in {region} – Stay informed!`
- **Example:** `Monsoon season water quality monitoring intensified in Northeast India – Stay informed!`
- **Source:** Health Department
- **Colors:** Low severity

## 🔑 API Key Setup

### **WaterNet ICMR API**
1. Contact Indian Council of Medical Research (ICMR)
2. Visit: https://www.icmr.gov.in/
3. Request access to WaterNet surveillance platform
4. Add key to `WATERNET_API_KEY` in `.env`

### **Meersens API**
1. Visit: https://www.meersens.com/
2. Sign up for developer account
3. Get API key from dashboard
4. Add key to `MEERSENS_API_KEY` in `.env`

## 🧪 Testing

### **Mock Data Service**
```bash
# Test mock data generation
python backend/mock_news_data.py

# Test API endpoint
curl http://localhost:8001/api/news-ticker

# Test health endpoint
curl http://localhost:8001/api/news-ticker/health
```

### **Frontend Testing**
- **Auto-rotation:** Wait 8 seconds to see alerts change
- **Manual navigation:** Click ‹ › buttons
- **Pause on hover:** Hover over ticker to pause auto-rotation
- **Responsive design:** Test on mobile devices

## 🎛️ Customization

### **Frontend Styling**
Edit `frontend/components/NewsTicker.tsx`:
- **Colors:** Modify severity color schemes
- **Timing:** Change rotation intervals
- **Animations:** Adjust Framer Motion settings
- **Layout:** Modify responsive breakpoints

### **Backend Logic**
Edit `backend/news_ticker_service.py`:
- **Data sources:** Add new API integrations
- **Alert processing:** Modify formatting logic
- **Filtering:** Change alert prioritization
- **Caching:** Implement alert caching

## 🚨 Troubleshooting

### **Common Issues**

1. **No alerts showing:**
   - Check if backend server is running
   - Verify API endpoint: `curl http://localhost:8001/api/news-ticker`
   - Check browser console for errors

2. **Mock data not working:**
   - Ensure `USE_MOCK_DATA=true` in `.env`
   - Test mock service: `python backend/mock_news_data.py`

3. **Real APIs not working:**
   - Verify API keys in `.env`
   - Check API key permissions
   - Review backend logs for API errors

4. **Ticker not updating:**
   - Check hourly update interval
   - Verify network connectivity
   - Check browser cache

### **Debug Mode**
```bash
# Enable detailed logging
LOG_LEVEL=DEBUG
ENABLE_API_LOGGING=true

# Check logs in backend server output
```

## 📈 Performance

- **Update frequency:** 1 hour (configurable)
- **Alert rotation:** 8 seconds per alert
- **API timeout:** 5 seconds per request
- **Caching:** 1 hour alert cache
- **Fallback:** Mock data if APIs unavailable

## 🔒 Security

- **API keys:** Stored in environment variables
- **CORS:** Configured for frontend domain
- **Rate limiting:** Built into external APIs
- **Data validation:** Input sanitization
- **Error handling:** Graceful fallbacks

## 🌟 Future Enhancements

- **Push notifications** for critical alerts
- **Geolocation-based** alert filtering
- **Multi-language support** for regional languages
- **Voice announcements** for accessibility
- **Historical alert** archive
- **Alert subscription** system
- **Social media integration** for alert sharing

---

**📞 Support:** For issues or questions, check the main project documentation or contact the development team.

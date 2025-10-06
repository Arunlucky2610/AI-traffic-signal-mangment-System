# Google Maps API Integration Setup Guide

## 🚀 Quick Setup

### 1. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - **Maps JavaScript API** (for frontend map display)
   - **Places API** (for location search)
   - **Distance Matrix API** (for traffic data)
   - **Geocoding API** (for address conversion)
   - **Roads API** (for traffic analysis)

4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

### 2. Configure API Keys
1. Open `.env` file in your project root
2. Replace `your_google_maps_api_key_here` with your actual API key:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxx
   GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### 3. Secure Your API Key
1. In Google Cloud Console, click on your API key
2. Under **Application restrictions**, select **HTTP referrers**
3. Add your domains:
   ```
   http://localhost:*/*
   https://yourdomain.com/*
   ```

4. Under **API restrictions**, select **Restrict key**
5. Choose the APIs you enabled above

### 4. Start the Services

#### Backend Service (Python Flask)
```bash
# Install dependencies (already done)
pip install -r requirements.txt

# Start the Google Maps backend service
python google_maps_service.py
```
This will start the backend on `http://localhost:5001`

#### Frontend (React + Vite)
```bash
# Start the React development server
npm run dev
```
This will start the frontend on `http://localhost:5173`

### 5. Verify Integration
1. Open your browser to `http://localhost:5173`
2. Navigate to the Google Maps section
3. You should see:
   - ✅ **Google Maps JavaScript API Active** status indicator
   - ✅ Real Google Maps (not OpenStreetMap)
   - ✅ Traffic layers and markers
   - ✅ Backend connection status

## 📡 API Endpoints

Your Python backend provides these endpoints:

- `GET /api/maps/locations` - Get all Telangana locations
- `GET /api/maps/traffic/{location_id}` - Get traffic data for location
- `GET /api/maps/incidents` - Get live traffic incidents
- `GET /api/maps/geocode?address=location` - Geocode an address
- `GET /api/maps/directions?origin=A&destination=B` - Get directions
- `GET /api/health` - Service health check

## 🔧 Features Enabled

### Frontend (React)
- **Real Google Maps**: JavaScript API integration
- **Interactive markers**: Click locations to see details
- **Traffic layers**: Live traffic data overlay
- **Dark theme**: Custom styled maps
- **Real-time updates**: Backend API integration

### Backend (Python)
- **Google Maps API**: Full googlemaps library integration
- **Traffic analysis**: Real-time traffic conditions
- **Places search**: Nearby points of interest
- **Travel times**: Dynamic routing with traffic
- **Geocoding**: Address to coordinates conversion

## 🚨 Troubleshooting

### "Google Maps API not loaded yet"
- Check your API key in `.env`
- Verify APIs are enabled in Google Cloud Console
- Check browser console for errors

### "Backend service not available"
- Make sure `python google_maps_service.py` is running
- Check `http://localhost:5001/api/health` endpoint
- Verify Flask dependencies are installed

### "This page can't load Google Maps correctly"
- Check API key restrictions in Google Cloud Console
- Ensure billing is enabled for your Google Cloud project
- Verify domain restrictions allow localhost

## 💡 Next Steps

1. **Real Traffic Data**: Backend automatically fetches live traffic
2. **Incident Reporting**: Add traffic incident detection
3. **Route Optimization**: Implement smart routing algorithms
4. **Mobile Support**: Add geolocation and mobile optimization

## 📊 Cost Management

Google Maps API usage:
- **Free tier**: 28,000+ map loads per month
- **Pay-as-you-use**: $7 per 1,000 additional requests
- **Optimize**: Cache responses and limit API calls

## 🎯 Telangana Focus

The integration is specifically optimized for:
- **8 Key locations**: HITEC City, Banjara Hills, Secunderabad, etc.
- **Local traffic patterns**: Peak hours and congestion analysis
- **Regional context**: Hyderabad-focused geocoding and search
- **Emergency routing**: Fastest paths during incidents

---

**Ready to use!** Your Google Maps API integration is now complete with both frontend JavaScript API and backend Python service.
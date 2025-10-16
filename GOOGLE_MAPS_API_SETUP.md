# Google Maps API Setup Guide

## 🔑 Getting Your Google Maps API Key

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click "Create Project" or select an existing project
4. Name your project (e.g., "Traffic Management System")
5. Click "Create"

### Step 2: Enable Required APIs
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable these APIs:
   - **Maps JavaScript API** (for frontend maps)
   - **Places API** (for location search)
   - **Directions API** (for routing)
   - **Distance Matrix API** (for travel times)
   - **Geocoding API** (for address conversion)
   - **Roads API** (for traffic data)

### Step 3: Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy your API key (looks like: `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
4. **IMPORTANT**: Click "Restrict Key" and:
   - Add your domain (e.g., `localhost:5173`, `localhost:3000`)
   - Select the APIs you enabled above

### Step 4: Configure Your Project

1. **Update your `.env` file**:
```bash
# Replace with your actual API key
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Backend URLs
VITE_API_URL=http://localhost:5000
VITE_MAPS_API_URL=http://localhost:5001
```

2. **Restart your development server** after updating the `.env` file

### Step 5: Test the Integration
1. Start your React app: `npm run dev`
2. Start the backend service: `python google_maps_service.py`
3. Navigate to the Google Maps section
4. You should see the map loading properly

## 🚨 Common Issues & Solutions

### Issue 1: "This page can't load Google Maps correctly"
- **Cause**: Invalid or missing API key
- **Solution**: Check your API key in `.env` file

### Issue 2: Map loads then goes blank
- **Cause**: API key restrictions or billing not enabled
- **Solution**: 
  1. Check API key restrictions in Google Cloud Console
  2. Enable billing for your Google Cloud project
  3. Ensure all required APIs are enabled

### Issue 3: "RefererNotAllowedMapError"
- **Cause**: Domain not added to API key restrictions
- **Solution**: Add your localhost domain to API key restrictions

### Issue 4: Backend service fails to start
- **Cause**: Missing Python dependencies
- **Solution**: Install requirements: `pip install -r backend/requirements.txt`

## 💰 Billing Information

Google Maps API has a **$200 monthly free tier**. For development and testing, you likely won't exceed this limit. The APIs used in this project are:

- Maps JavaScript API: $7 per 1,000 loads
- Places API: $17 per 1,000 requests  
- Directions API: $5 per 1,000 requests
- Distance Matrix API: $10 per 1,000 requests

**Free tier covers approximately:**
- 28,500 map loads per month
- 11,700 Places API requests per month
- 40,000 Directions API requests per month

## 🔒 Security Best Practices

1. **Restrict your API key** to specific domains and APIs
2. **Monitor usage** in Google Cloud Console
3. **Set up billing alerts** to avoid unexpected charges
4. **Never commit API keys** to public repositories
5. **Use different keys** for development and production

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key in Google Cloud Console
3. Ensure billing is enabled
4. Check API quotas and limits
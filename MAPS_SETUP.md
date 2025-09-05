# Google Maps Integration Setup Guide

## Overview
Your AI Traffic Signal Management System now supports multiple mapping options:

1. **Simulated Traffic Map** - Built-in animated simulation (no API required)
2. **Google Maps** - Real-time traffic data (requires API key)
3. **OpenStreet Map** - Free alternative with simulated traffic (no API required)

## Setting up Google Maps (Real Traffic Data)

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "New Project" or select an existing project
3. Give your project a name (e.g., "Traffic Management System")

### Step 2: Enable Required APIs
Enable these APIs in your Google Cloud Console:
- **Maps JavaScript API** (for map display)
- **Places API** (for location services)
- **Geolocation API** (for user location)

To enable APIs:
1. Go to "APIs & Services" > "Library"
2. Search for each API
3. Click on it and press "Enable"

### Step 3: Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional but recommended) Click "Restrict Key" to add security restrictions

### Step 4: Configure API Key Restrictions (Recommended)
For security, restrict your API key:
1. **Application restrictions**: Select "HTTP referrers"
2. Add your domain: `http://localhost:5173/*` (for development)
3. **API restrictions**: Select "Restrict key" and choose the APIs you enabled

### Step 5: Set Up Billing (Required)
Google Maps requires a billing account:
1. Go to "Billing" in Google Cloud Console
2. Create a billing account
3. Link it to your project
4. Google provides $200 free credits monthly for Maps usage

### Step 6: Add API Key to Your Project
1. Open the `.env` file in your project root
2. Replace `YOUR_API_KEY_HERE` with your actual API key:
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 7: Restart Development Server
```bash
npm run dev
```

## Free Alternative: OpenStreetMap

If you prefer not to use Google Maps, the OpenStreetMap integration provides:
- ✅ No API key required
- ✅ Completely free
- ✅ Global coverage
- ✅ Traffic signal simulation
- ⚠️ Simulated traffic data (not real-time)

## API Key Security Best Practices

### For Development:
```env
# .env file (never commit this file)
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### For Production:
1. Use environment variables
2. Restrict API key to your domain
3. Set up API quotas and monitoring
4. Enable billing alerts

## Troubleshooting

### "API Key Required" Error
- Check that your API key is correctly set in `.env`
- Ensure the Maps JavaScript API is enabled
- Verify billing is set up

### "Requests must be over SSL" Error
- Make sure you're using `https://` in production
- For local development, `http://localhost` should work

### "This API has not been used" Error
- Enable the required APIs in Google Cloud Console
- Wait a few minutes for changes to propagate

### "Quota Exceeded" Error
- Check your API usage in Google Cloud Console
- Increase quotas or add billing if needed

## Cost Information

Google Maps pricing (as of 2024):
- Maps JavaScript API: $7 per 1,000 requests
- Free tier: $200 credit monthly (≈28,500 map loads)
- For most applications, the free tier is sufficient

## Features Comparison

| Feature | Simulated Map | Google Maps | OpenStreetMap |
|---------|---------------|-------------|---------------|
| Cost | Free | Paid (with free tier) | Free |
| API Key | Not required | Required | Not required |
| Real Traffic | ❌ | ✅ | ❌ |
| Global Coverage | ❌ | ✅ | ✅ |
| Emergency Simulation | ✅ | ✅ | ✅ |
| Setup Complexity | Low | Medium | Low |

## Next Steps

1. **For Development**: Use OpenStreetMap for immediate testing
2. **For Production**: Set up Google Maps for real traffic data
3. **For Demo**: Use the simulated map for presentations

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key permissions
3. Ensure all required APIs are enabled
4. Check that billing is properly configured

---

**Note**: The traffic signal management features work with all three mapping options. The choice depends on your specific needs for real-time traffic data vs. cost considerations.

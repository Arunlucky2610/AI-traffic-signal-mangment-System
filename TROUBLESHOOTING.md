# 🗺️ Google Maps Troubleshooting Guide

## Current Issue: Loading Screen → Blank Map

### Quick Diagnosis Steps

1. **Open the debug page**: http://localhost:5173/google-maps-debug.html
2. **Check browser console** (F12 → Console tab) for error messages
3. **Review the debug information** displayed on the debug page

### Common Causes & Solutions

#### 1. 🔑 API Key Restrictions
**Symptom**: "gm_authFailure" or authentication errors
**Solutions**:
- Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- Find your API key
- Click "Edit" → "API restrictions" 
- Ensure these APIs are enabled:
  - Maps JavaScript API
  - Places API (New)
  - Geocoding API
- Under "Application restrictions":
  - Add `localhost:5173` to allowed URLs
  - Add `127.0.0.1:5173` as well

#### 2. 💳 Billing Not Enabled
**Symptom**: Maps load initially but then go blank/gray
**Solution**:
- Go to Google Cloud Console → Billing
- Enable billing for your project
- Google Maps requires billing even for free tier usage

#### 3. 🌐 CORS/Domain Issues
**Symptom**: Script loading errors in console
**Solutions**:
- In API key restrictions, add:
  - `http://localhost:5173/*`
  - `http://127.0.0.1:5173/*`
  - `https://localhost:5173/*` (if using HTTPS)

#### 4. 📊 Quota Exceeded
**Symptom**: "OVER_QUERY_LIMIT" errors
**Solution**:
- Check quotas in Google Cloud Console → APIs & Services → Quotas
- Increase limits or wait for quota reset

#### 5. 🔧 JavaScript Errors
**Symptom**: Console shows JavaScript errors
**Solutions**:
- Clear browser cache and cookies
- Try incognito/private browsing mode
- Disable browser extensions temporarily

### Testing Your API Key

Use this simple test in browser console:
```javascript
fetch(`https://maps.googleapis.com/maps/api/js?key=AIzaSyBMsd9I-opTwbD8Wg0YEnYmoB4WArIqSSs`)
.then(response => {
  console.log('API Response Status:', response.status);
  if (response.status === 200) {
    console.log('✅ API key is working');
  } else {
    console.log('❌ API key issue - Status:', response.status);
  }
})
.catch(error => console.log('❌ Network error:', error));
```

### Manual Verification Steps

1. **Check API Key in Google Cloud Console**:
   - Project: Select your project
   - APIs & Services → Credentials
   - Find your API key: `AIzaSyBMsd9I-opTwbD8Wg0YEnYmoB4WArIqSSs`
   - Verify it's not restricted too strictly

2. **Verify Required APIs are Enabled**:
   - APIs & Services → Library
   - Search and enable: "Maps JavaScript API"
   - Search and enable: "Places API"
   - Search and enable: "Geocoding API"

3. **Check Billing**:
   - Billing → Overview
   - Ensure billing account is linked and active

### Debug Tools Available

1. **Debug Page**: `/google-maps-debug.html` - Shows detailed loading status
2. **Simple Test Component**: `SimpleGoogleMapTest.jsx` - Minimal test case
3. **Enhanced Logging**: Check browser console for detailed logs
4. **Backend Health**: http://localhost:5001/api/health

### If Still Not Working

Try these in order:

1. **Regenerate API Key**:
   - Go to Google Cloud Console
   - Create a new API key
   - Update `.env` file with new key
   - Restart dev server

2. **Use Unrestricted Key Temporarily**:
   - Remove all restrictions from API key
   - Test if it works
   - If yes, add restrictions back gradually

3. **Check Browser Network Tab**:
   - F12 → Network tab
   - Reload page
   - Look for failed requests to googleapis.com
   - Check error details

4. **Try Different Browser**:
   - Test in Chrome, Firefox, Edge
   - Rules out browser-specific issues

### Revert if Needed

If you need to revert all changes:
```bash
# Run this script to restore backup
.\revert-google-api-key.bat
```

### Contact Information

- **Google Cloud Support**: https://cloud.google.com/support
- **Maps API Documentation**: https://developers.google.com/maps/documentation/javascript
- **API Key Best Practices**: https://developers.google.com/maps/api-key-best-practices
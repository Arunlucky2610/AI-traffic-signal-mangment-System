// Google Maps Debug Utility
// Run this in browser console to debug Google Maps issues

function debugGoogleMaps() {
    console.log('🔍 Google Maps Debug Tool Starting...');
    console.log('==========================================');
    
    // 1. Check API Key
    const apiKey = import.meta?.env?.VITE_GOOGLE_MAPS_API_KEY || 
                   window.VITE_GOOGLE_MAPS_API_KEY || 
                   'NOT_FOUND';
    
    console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
    console.log(`📏 API Key Length: ${apiKey.length} characters`);
    
    if (apiKey === 'NOT_FOUND' || apiKey.includes('your_google_maps_api_key_here')) {
        console.error('❌ API Key not properly configured!');
        return false;
    }
    
    // 2. Check if Google Maps API is loaded
    console.log('📜 Checking Google Maps API status...');
    console.log(`window.google exists: ${!!window.google}`);
    console.log(`window.google.maps exists: ${!!(window.google && window.google.maps)}`);
    
    // 3. Check for existing scripts
    const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
    console.log(`📋 Found ${existingScripts.length} Google Maps scripts in DOM`);
    existingScripts.forEach((script, index) => {
        console.log(`   Script ${index + 1}: ${script.src}`);
    });
    
    // 4. Check for DOM elements
    const mapElements = document.querySelectorAll('[id*="map"], [class*="map"]');
    console.log(`🗺️ Found ${mapElements.length} potential map elements`);
    mapElements.forEach((element, index) => {
        console.log(`   Element ${index + 1}: ${element.id || element.className} (${element.tagName})`);
    });
    
    // 5. Test API Key with direct request
    console.log('🧪 Testing API Key with geocoding request...');
    testApiKeyDirect(apiKey);
    
    // 6. Check for authentication errors
    if (window.gm_authFailure) {
        console.log('🔒 Authentication failure handler is set up');
    } else {
        console.log('⚠️ No authentication failure handler found');
    }
    
    // 7. Network and CORS check
    console.log('🌐 Checking network and CORS...');
    fetch('https://maps.googleapis.com/maps/api/js?key=' + apiKey)
        .then(response => {
            console.log(`✅ Network request successful: ${response.status} ${response.statusText}`);
        })
        .catch(error => {
            console.error(`❌ Network request failed: ${error.message}`);
        });
    
    return true;
}

function testApiKeyDirect(apiKey) {
    const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Hyderabad,India&key=${apiKey}`;
    
    // Note: This will likely fail due to CORS, but we can check the network tab
    fetch(testUrl, { mode: 'no-cors' })
        .then(() => {
            console.log('📡 Geocoding test request sent (check network tab for response)');
        })
        .catch(error => {
            console.log('📡 Geocoding test failed (expected due to CORS):', error.message);
            console.log('💡 Check browser network tab for actual API response');
        });
}

function forceReloadGoogleMaps() {
    console.log('🔄 Force reloading Google Maps API...');
    
    // Remove existing scripts
    const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
    scripts.forEach(script => {
        script.remove();
        console.log('🗑️ Removed existing Google Maps script');
    });
    
    // Clear global objects
    if (window.google) {
        delete window.google;
        console.log('🧹 Cleared window.google');
    }
    
    if (window.initMap) {
        delete window.initMap;
        console.log('🧹 Cleared window.initMap');
    }
    
    // Reload after a brief delay
    setTimeout(() => {
        const apiKey = import.meta?.env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBMsd9I-opTwbD8Wg0YEnYmoB4WArIqSSs';
        loadGoogleMapsFromConsole(apiKey);
    }, 1000);
}

function loadGoogleMapsFromConsole(apiKey) {
    console.log('📜 Loading Google Maps API from console...');
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=consoleInitMap`;
    script.async = true;
    
    script.onload = () => {
        console.log('✅ Google Maps script loaded successfully');
    };
    
    script.onerror = (error) => {
        console.error('❌ Failed to load Google Maps script:', error);
    };
    
    window.consoleInitMap = function() {
        console.log('🎉 Google Maps API initialized from console!');
        
        // Try to create a simple map
        try {
            const mapDiv = document.getElementById('map') || document.querySelector('[ref="mapRef"]') || createTestMapDiv();
            
            const map = new google.maps.Map(mapDiv, {
                zoom: 13,
                center: { lat: 17.3850, lng: 78.4867 }
            });
            
            console.log('✅ Test map created successfully!');
            
            const marker = new google.maps.Marker({
                position: { lat: 17.3850, lng: 78.4867 },
                map: map,
                title: 'Test Marker from Console'
            });
            
            console.log('✅ Test marker created successfully!');
            console.log('🎯 Google Maps is working! The issue might be in the React component.');
            
        } catch (error) {
            console.error('❌ Map creation failed:', error);
        }
    };
    
    window.gm_authFailure = function() {
        console.error('❌ Google Maps Authentication Failed!');
        console.log('🔑 Possible fixes:');
        console.log('   1. Check API key restrictions in Google Cloud Console');
        console.log('   2. Add localhost to authorized domains');
        console.log('   3. Enable billing on your Google Cloud project');
        console.log('   4. Verify Maps JavaScript API is enabled');
    };
    
    document.head.appendChild(script);
    console.log('📜 Script added to DOM');
}

function createTestMapDiv() {
    const div = document.createElement('div');
    div.id = 'console-test-map';
    div.style.width = '100%';
    div.style.height = '400px';
    div.style.border = '2px solid red';
    div.style.position = 'fixed';
    div.style.top = '50px';
    div.style.left = '50px';
    div.style.zIndex = '9999';
    div.style.backgroundColor = '#f0f0f0';
    
    document.body.appendChild(div);
    console.log('🗺️ Created test map div');
    return div;
}

// Auto-run debug
console.log('🔧 Google Maps Debug Tool Loaded!');
console.log('Run debugGoogleMaps() to start debugging');
console.log('Run forceReloadGoogleMaps() to force reload the API');

// Export functions to global scope
window.debugGoogleMaps = debugGoogleMaps;
window.forceReloadGoogleMaps = forceReloadGoogleMaps;
window.testApiKeyDirect = testApiKeyDirect;
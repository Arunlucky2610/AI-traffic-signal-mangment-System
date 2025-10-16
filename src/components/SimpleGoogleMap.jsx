import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, MapPin, Navigation, Wifi, ExternalLink, Zap, Loader2 } from 'lucide-react';

const SimpleGoogleMap = ({ emergencyActive, isMonitoring }) => {
  const mapRef = useRef(null);
  const [mapStatus, setMapStatus] = useState('loading');
  const [error, setError] = useState(null);

  // Use environment variable or fallback
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBMsd9I-opTwbD8Wg0YEnYmoB4WArIqSSs';
  
  useEffect(() => {
    // Simple map initialization
    const initMap = () => {
      if (mapRef.current && window.google?.maps) {
        try {
          const map = new window.google.maps.Map(mapRef.current, {
            zoom: 12,
            center: { lat: 17.3850, lng: 78.4867 }, // Hyderabad
            mapTypeId: window.google.maps.MapTypeId.ROADMAP
          });

          // Add a simple marker
          new window.google.maps.Marker({
            position: { lat: 17.3850, lng: 78.4867 },
            map: map,
            title: 'Hyderabad Traffic Center'
          });

          // Add traffic layer
          const trafficLayer = new window.google.maps.TrafficLayer();
          trafficLayer.setMap(map);

          setMapStatus('loaded');
          console.log('✅ Google Maps loaded successfully');
        } catch (err) {
          console.error('❌ Map initialization error:', err);
          setError(err.message);
          setMapStatus('error');
        }
      }
    };

    // Load Google Maps API if not already loaded
    if (!window.google?.maps) {
      console.log('🔄 Loading Google Maps API...');
      
      // Set up global callback
      window.initGoogleMapSimple = () => {
        console.log('✅ Google Maps API callback fired');
        initMap();
      };

      // Create script tag
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initGoogleMapSimple&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onerror = () => {
        console.error('❌ Failed to load Google Maps script');
        setError('Failed to load Google Maps. Check your API key and internet connection.');
        setMapStatus('error');
      };

      document.head.appendChild(script);

      // Cleanup function
      return () => {
        const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
        scripts.forEach(s => s.remove());
        delete window.initGoogleMapSimple;
      };
    } else {
      // Maps API already loaded
      initMap();
    }
  }, [API_KEY]);

  // Loading state
  if (mapStatus === 'loading') {
    return (
      <div className="h-full bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Loading Google Maps</h3>
          <p className="text-gray-300">Initializing traffic monitoring system...</p>
          <div className="mt-4 text-sm text-gray-400">
            <p>API Key: {API_KEY ? '✅ Configured' : '❌ Missing'}</p>
            <p>Location: Hyderabad, India</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (mapStatus === 'error' || error) {
    return (
      <div className="h-full bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-4">Google Maps Error</h3>
          <p className="text-gray-300 mb-6">{error || 'Unknown error occurred'}</p>
          
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6 text-left text-sm">
            <h4 className="text-red-400 font-medium mb-2">Common Solutions:</h4>
            <ul className="text-gray-300 space-y-1 list-disc list-inside">
              <li>Check if API key is valid and active</li>
              <li>Ensure billing is enabled in Google Cloud Console</li>
              <li>Verify Maps JavaScript API is enabled</li>
              <li>Add localhost:5173 to authorized domains</li>
            </ul>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  // Success state - render the map
  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Navigation className="w-6 h-6 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-white">Google Maps - Hyderabad Traffic</h1>
              <p className="text-sm text-gray-300">Real-time traffic monitoring system</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
              <Wifi className="w-4 h-4" />
              <span>Maps Active</span>
            </div>

            {emergencyActive && (
              <div className="flex items-center space-x-1 px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm">
                <Zap className="w-4 h-4 animate-pulse" />
                <span>Emergency Mode</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[calc(100vh-140px)]">
        <div 
          ref={mapRef} 
          className="w-full h-full"
          style={{ minHeight: '400px' }}
        />
        
        {/* Map Status Overlay */}
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-lg text-white px-4 py-2 rounded-lg border border-white/20">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">Hyderabad Traffic Center</span>
          </div>
          <div className="text-xs text-gray-300 mt-1">
            Real-time traffic monitoring
          </div>
        </div>

        <div className="absolute top-4 right-4 bg-green-600/20 text-green-400 border border-green-500/30 backdrop-blur-lg px-3 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm font-medium">Live Traffic Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleGoogleMap;
import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, MapPin, Navigation, Wifi, ExternalLink, Zap, Loader2 } from 'lucide-react';

const WorkingGoogleMap = ({ emergencyActive, isMonitoring }) => {
  const mapRef = useRef(null);
  const [mapStatus, setMapStatus] = useState('loading');
  const [error, setError] = useState(null);

  // Simple working configuration
  const API_KEY = 'AIzaSyBMsd9I-opTwbD8Wg0YEnYmoB4WArIqSSs';
  
  // Hyderabad traffic centers
  const trafficCenters = [
    { lat: 17.3850, lng: 78.4867, name: 'HITEC City', severity: 'high', incidents: 4 },
    { lat: 17.4065, lng: 78.4772, name: 'Banjara Hills', severity: 'medium', incidents: 2 },
    { lat: 17.4399, lng: 78.3489, name: 'Secunderabad Station', severity: 'high', incidents: 3 },
    { lat: 17.3616, lng: 78.4747, name: 'Charminar Area', severity: 'medium', incidents: 2 },
    { lat: 17.4126, lng: 78.4392, name: 'Ameerpet', severity: 'high', incidents: 5 }
  ];

  const [selectedLocation, setSelectedLocation] = useState(0);
  const [incidents] = useState([
    { id: 1, location: 'Outer Ring Road (ORR)', type: 'Heavy Traffic', severity: 'high', time: '3 min ago' },
    { id: 2, location: 'HITEC City - Gachibowli Road', type: 'Minor Accident', severity: 'medium', time: '8 min ago' },
    { id: 3, location: 'Secunderabad - Tank Bund', type: 'Road Work', severity: 'low', time: '15 min ago' }
  ]);

  useEffect(() => {
    let mounted = true;

    const initializeMap = () => {
      if (!mounted || !mapRef.current) return;

      try {
        // Check if Google Maps is available
        if (!window.google || !window.google.maps) {
          console.log('Google Maps not yet available');
          return;
        }

        console.log('✅ Initializing Google Maps...');
        
        const center = trafficCenters[selectedLocation];
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 12,
          center: { lat: center.lat, lng: center.lng },
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          styles: [
            { featureType: 'all', elementType: 'geometry.fill', stylers: [{ color: '#1a1a1a' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d3748' }] },
            { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca3af' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#1e40af' }] }
          ]
        });

        // Add traffic layer
        const trafficLayer = new window.google.maps.TrafficLayer();
        trafficLayer.setMap(map);

        // Add markers for traffic centers
        trafficCenters.forEach((center, index) => {
          const color = center.severity === 'high' ? '#ef4444' : center.severity === 'medium' ? '#f59e0b' : '#22c55e';
          
          new window.google.maps.Marker({
            position: { lat: center.lat, lng: center.lng },
            map: map,
            title: center.name,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="15" cy="15" r="12" fill="${color}" stroke="#fff" stroke-width="2"/>
                  <text x="15" y="19" text-anchor="middle" fill="white" font-size="10" font-family="Arial">${center.incidents}</text>
                </svg>
              `)}`
            }
          });
        });

        setMapStatus('loaded');
        setError(null);
        console.log('✅ Google Maps loaded successfully!');

      } catch (err) {
        console.error('❌ Map initialization error:', err);
        setError(err.message);
        setMapStatus('error');
      }
    };

    const loadGoogleMaps = () => {
      // Check if already loaded
      if (window.google && window.google.maps) {
        console.log('✅ Google Maps API already available');
        initializeMap();
        return;
      }

      console.log('🔄 Loading Google Maps API...');
      
      // Set up callback
      window.initGoogleMapCallback = () => {
        console.log('✅ Google Maps callback executed');
        if (mounted) {
          setTimeout(initializeMap, 100);
        }
      };

      // Authentication error handler
      window.gm_authFailure = () => {
        console.error('❌ Google Maps authentication failed');
        if (mounted) {
          setError('Google Maps authentication failed. API key may have restrictions.');
          setMapStatus('error');
        }
      };

      // Create script element
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initGoogleMapCallback`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log('✅ Google Maps script loaded');
      };

      script.onerror = (error) => {
        console.error('❌ Failed to load Google Maps script:', error);
        if (mounted) {
          setError('Failed to load Google Maps. Check your internet connection.');
          setMapStatus('error');
        }
      };

      document.head.appendChild(script);

      // Timeout fallback
      setTimeout(() => {
        if (mounted && mapStatus === 'loading') {
          console.warn('⏰ Google Maps loading timeout');
          setError('Maps loading timeout. This may be due to API key restrictions or network issues.');
          setMapStatus('error');
        }
      }, 10000);
    };

    loadGoogleMaps();

    return () => {
      mounted = false;
      // Cleanup
      delete window.initGoogleMapCallback;
      delete window.gm_authFailure;
    };
  }, [selectedLocation, mapStatus]);

  const centerOnLocation = (index) => {
    setSelectedLocation(index);
  };

  const openInGoogleMaps = () => {
    const center = trafficCenters[selectedLocation];
    window.open(`https://www.google.com/maps/@${center.lat},${center.lng},15z`, '_blank');
  };

  const retryLoad = () => {
    setMapStatus('loading');
    setError(null);
    // Force reload by removing and re-adding script
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.remove();
    }
    window.location.reload(); // Simple but effective
  };

  // Loading state
  if (mapStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white mb-4">Loading Google Maps</h3>
          <p className="text-gray-300 mb-6">Initializing Hyderabad traffic monitoring system...</p>
          
          <div className="bg-black/30 rounded-lg p-4 mb-6 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-gray-300">API Key: Configured</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                <span className="text-gray-300">Loading Google Maps API...</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="text-gray-300">Location: Hyderabad, India</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={retryLoad}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Force Reload if Stuck
          </button>
        </div>
      </div>
    );
  }

  // Error state
  if (mapStatus === 'error' || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-3">Google Maps Loading Issue</h3>
          <p className="text-gray-300 mb-6">{error || 'Failed to load Google Maps'}</p>
          
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-6 text-left">
            <h4 className="text-yellow-400 font-medium mb-4">💡 Quick Solutions:</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div>
                <strong>1. API Key Setup:</strong>
                <p>• Go to Google Cloud Console → APIs & Services → Credentials</p>
                <p>• Set Application restrictions to "None" (for testing)</p>
                <p>• Enable "Maps JavaScript API"</p>
              </div>
              <div>
                <strong>2. Network Issues:</strong>
                <p>• Check your internet connection</p>
                <p>• Try disabling browser extensions</p>
                <p>• Clear browser cache</p>
              </div>
              <div>
                <strong>3. Billing:</strong>
                <p>• Ensure Google Cloud billing is enabled</p>
                <p>• Check API usage quotas</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 justify-center">
            <button
              onClick={retryLoad}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Retry Loading
            </button>
            <button
              onClick={() => {
                setMapStatus('loading');
                setError(null);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Show Fallback View
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state - show the map
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Navigation className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Hyderabad Traffic Control</h1>
              <p className="text-sm text-gray-300">Real-time Google Maps • Traffic monitoring • Emergency management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={openInGoogleMaps}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm transition-colors hover:bg-blue-600/30"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in Google Maps</span>
            </button>
            
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

      <div className="flex h-[calc(100vh-80px)]">
        {/* Control Panel */}
        <div className="w-80 bg-black/20 backdrop-blur-lg border-r border-white/10 p-4 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Live Incidents
            </h3>
            <div className="space-y-2">
              {incidents.map((incident) => (
                <div key={incident.id} className="bg-black/30 rounded-lg p-3 border-l-4 border-l-orange-500">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                      incident.severity === 'high' ? 'text-red-400' :
                      incident.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">{incident.type}</p>
                      <p className="text-xs text-gray-300">{incident.location}</p>
                      <p className="text-xs text-gray-400 mt-1">{incident.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Traffic Centers
            </h3>
            <div className="space-y-2">
              {trafficCenters.map((center, index) => (
                <div
                  key={index}
                  className={`bg-black/30 rounded-lg p-3 cursor-pointer transition-colors border ${
                    selectedLocation === index ? 'border-blue-500/50 bg-blue-600/10' : 'border-gray-700/50 hover:border-gray-600/50'
                  }`}
                  onClick={() => centerOnLocation(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      center.severity === 'high' ? 'bg-red-400 animate-pulse' :
                      center.severity === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">{center.name}</p>
                      <p className="text-xs text-gray-400">{center.incidents} incidents • {center.severity} traffic</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <div 
            ref={mapRef} 
            className="w-full h-full"
            style={{ minHeight: '500px' }}
          />
          
          {/* Map Overlays */}
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-lg text-white px-4 py-2 rounded-lg border border-white/20">
            <div className="text-sm font-medium flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>{trafficCenters[selectedLocation].name}</span>
            </div>
            <div className="text-xs text-gray-300 mt-1">
              {trafficCenters[selectedLocation].incidents} active incidents
            </div>
          </div>

          <div className={`absolute top-4 right-4 backdrop-blur-lg px-3 py-2 rounded-lg border ${
            trafficCenters[selectedLocation].severity === 'high' ? 'bg-red-600/20 text-red-400 border-red-500/30' :
            trafficCenters[selectedLocation].severity === 'medium' ? 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30' :
            'bg-green-600/20 text-green-400 border-green-500/30'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                trafficCenters[selectedLocation].severity === 'high' ? 'bg-red-400 animate-pulse' :
                trafficCenters[selectedLocation].severity === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
              }`}></div>
              <span className="text-sm font-medium capitalize">
                {trafficCenters[selectedLocation].severity} Traffic
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingGoogleMap;
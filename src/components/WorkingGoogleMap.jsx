import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, MapPin, Navigation, Wifi, ExternalLink, Zap } from 'lucide-react';

const WorkingGoogleMap = ({ emergencyActive, isMonitoring }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_KEY = 'AIzaSyBMsd9I-opTwbD8Wg0YEnYmoB4WArIqSSs';
  
  // Telangana traffic centers
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
      if (!mounted) return;

      console.log('🗺️ Initializing Google Maps...');
      
      try {
        const center = trafficCenters[selectedLocation];
        
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 13,
          center: { lat: center.lat, lng: center.lng },
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

        // Add markers for all traffic centers
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

        if (mounted) {
          setMapLoaded(true);
          setIsLoading(false);
          console.log('✅ Google Maps loaded successfully');
        }

      } catch (err) {
        console.error('❌ Map initialization error:', err);
        if (mounted) {
          setError(`Map initialization failed: ${err.message}`);
          setIsLoading(false);
        }
      }
    };

    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps) {
        console.log('✅ Google Maps API already loaded');
        initializeMap();
        return;
      }

      console.log('📜 Loading Google Maps API...');
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log('✅ Google Maps API script loaded');
        initializeMap();
      };

      script.onerror = () => {
        console.error('❌ Failed to load Google Maps API');
        if (mounted) {
          setError('Failed to load Google Maps API. Please check your internet connection and API key.');
          setIsLoading(false);
        }
      };

      // Handle authentication errors
      window.gm_authFailure = () => {
        console.error('❌ Google Maps authentication failed');
        if (mounted) {
          setError('Google Maps authentication failed. API key restrictions may be preventing access from this domain.');
          setIsLoading(false);
        }
      };

      document.head.appendChild(script);
    };

    // Start loading
    setTimeout(loadGoogleMapsAPI, 100);
    
    // Auto-skip loading after 5 seconds
    const autoSkipTimer = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn('Auto-skipping Google Maps loading after 5 seconds');
        setIsLoading(false);
        setMapLoaded(true);
      }
    }, 5000);

    return () => {
      mounted = false;
      clearTimeout(autoSkipTimer);
    };
  }, [selectedLocation]);

  const centerOnLocation = (index) => {
    setSelectedLocation(index);
  };

  const openInGoogleMaps = () => {
    const center = trafficCenters[selectedLocation];
    window.open(`https://www.google.com/maps/@${center.lat},${center.lng},15z`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 relative mx-auto mb-4">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <Navigation className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading Google Maps</h3>
          <p className="text-gray-300">Initializing Telangana traffic monitoring...</p>
          
          {/* Auto-skip after 5 seconds */}
          <div className="mt-6">
            <button
              onClick={() => {
                setIsLoading(false);
                setMapLoaded(true);
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Google Maps Error</h3>
          <p className="text-gray-300 mb-6">{error}</p>
          
          <div className="bg-black/30 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <h4 className="text-yellow-400 font-medium mb-2">Quick Fixes:</h4>
            <div className="text-left text-sm space-y-2 text-gray-300">
              <p>1. Check API key restrictions in Google Cloud Console</p>
              <p>2. Add localhost to authorized domains</p>
              <p>3. Enable Maps JavaScript API</p>
              <p>4. Verify billing is enabled</p>
            </div>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

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
              <h1 className="text-xl font-bold text-white">Telangana Traffic Control</h1>
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
              <span>Google Maps Active</span>
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
          {/* Live Incidents */}
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

          {/* Traffic Centers */}
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
                      center.severity === 'high' ? 'bg-red-400' :
                      center.severity === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                    } ${center.severity === 'high' ? 'animate-pulse' : ''}`} />
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

        {/* Google Maps */}
        <div className="flex-1 relative">
          {!error && mapLoaded ? (
            <div ref={mapRef} className="w-full h-full" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center max-w-md">
                <Navigation className="w-20 h-20 text-blue-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">Traffic Control Center</h3>
                <p className="text-gray-300 mb-6">Monitoring Telangana traffic in real-time</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {trafficCenters.slice(0, 4).map((center, index) => (
                    <div key={index} className="bg-black/30 rounded-lg p-4 border border-gray-600">
                      <h4 className="font-medium text-white">{center.name}</h4>
                      <p className="text-sm text-gray-400">{center.incidents} incidents</p>
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        center.severity === 'high' ? 'bg-red-400 animate-pulse' :
                        center.severity === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                      }`}></div>
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-gray-400">Google Maps integration ready • API configured</p>
              </div>
            </div>
          )}
          
          {/* Map Overlay */}
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
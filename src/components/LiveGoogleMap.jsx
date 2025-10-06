import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  AlertTriangle,
  Route,
  Settings,
  Layers,
  Zap,
  Clock,
  Car,
  Wifi,
  ExternalLink
} from 'lucide-react';

const LiveGoogleMap = ({ emergencyActive, isMonitoring, signals }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [trafficIncidents, setTrafficIncidents] = useState([]);
  const [showTraffic, setShowTraffic] = useState(true);
  const [mapKey, setMapKey] = useState(0);
  const [backendData, setBackendData] = useState(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [apiKeyStatus, setApiKeyStatus] = useState('checking');
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);

  // Telangana Traffic Centers and Key Locations
  const trafficCenters = [
    { 
      lat: 17.3850, 
      lng: 78.4867, 
      name: 'Hyderabad - HITEC City', 
      severity: 'high', 
      incidents: 4, 
      type: 'IT Hub',
      description: 'Major IT hub with heavy traffic during peak hours',
      mapUrl: 'https://www.google.com/maps/place/HITEC+City,+Hyderabad,+Telangana/@17.4467711,78.3713163,13z'
    },
    { 
      lat: 17.4065, 
      lng: 78.4772, 
      name: 'Banjara Hills', 
      severity: 'medium', 
      incidents: 2, 
      type: 'Commercial',
      description: 'Upscale commercial and residential area',
      mapUrl: 'https://www.google.com/maps/place/Banjara+Hills,+Hyderabad,+Telangana/@17.4065,78.4772,14z'
    },
    { 
      lat: 17.4399, 
      lng: 78.3489, 
      name: 'Secunderabad Station', 
      severity: 'high', 
      incidents: 3, 
      type: 'Transport Hub',
      description: 'Major railway junction with constant traffic',
      mapUrl: 'https://www.google.com/maps/place/Secunderabad+Junction/@17.4399,78.3489,16z'
    },
    { 
      lat: 17.3616, 
      lng: 78.4747, 
      name: 'Charminar Area', 
      severity: 'medium', 
      incidents: 2, 
      type: 'Historic Center',
      description: 'Historic landmark and bustling market area',
      mapUrl: 'https://www.google.com/maps/place/Charminar/@17.3616,78.4747,17z'
    },
    { 
      lat: 17.4126, 
      lng: 78.4392, 
      name: 'Ameerpet', 
      severity: 'high', 
      incidents: 5, 
      type: 'Education Hub',
      description: 'Educational and training institute hub',
      mapUrl: 'https://www.google.com/maps/place/Ameerpet,+Hyderabad,+Telangana/@17.4126,78.4392,15z'
    },
    { 
      lat: 17.5007, 
      lng: 78.3963, 
      name: 'Kompally', 
      severity: 'low', 
      incidents: 1, 
      type: 'Residential',
      description: 'Residential suburb with moderate traffic',
      mapUrl: 'https://www.google.com/maps/place/Kompally,+Hyderabad,+Telangana/@17.5007,78.3963,14z'
    },
    { 
      lat: 17.3753, 
      lng: 78.5733, 
      name: 'LB Nagar', 
      severity: 'medium', 
      incidents: 3, 
      type: 'Suburban',
      description: 'Major suburban center and transport hub',
      mapUrl: 'https://www.google.com/maps/place/LB+Nagar,+Hyderabad,+Telangana/@17.3753,78.5733,14z'
    },
    { 
      lat: 17.4232, 
      lng: 78.3825, 
      name: 'Kukatpally', 
      severity: 'medium', 
      incidents: 2, 
      type: 'Residential',
      description: 'Residential and commercial area',
      mapUrl: 'https://www.google.com/maps/place/Kukatpally,+Hyderabad,+Telangana/@17.4232,78.3825,14z'
    }
  ];

  // Check API key configuration
  const checkApiKey = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'your_google_maps_api_key_here' || apiKey === 'YOUR_API_KEY_HERE') {
      setApiKeyStatus('missing');
      setMapError('Google Maps API key not configured. Please check your .env file.');
      return false;
    }
    setApiKeyStatus('configured');
    return true;
  };

  // Initialize Google Maps JavaScript API
  const initializeGoogleMaps = () => {
    const center = trafficCenters[selectedLocation];
    
    if (!window.google || !window.google.maps) {
      console.log('Google Maps API not loaded yet');
      setMapError('Google Maps API failed to load. Please check your internet connection and API key.');
      return;
    }

    try {
      const mapOptions = {
        zoom: 14,
        center: { lat: center.lat, lng: center.lng },
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry.fill',
            stylers: [{ color: '#1a1a1a' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#2d3748' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca3af' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#1e40af' }]
          }
        ]
      };
      
      if (mapRef.current && !googleMapRef.current) {
        googleMapRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
        
        // Add traffic layer
        const trafficLayer = new window.google.maps.TrafficLayer();
        if (showTraffic) {
          trafficLayer.setMap(googleMapRef.current);
        }
        
        // Add marker for current location
        new window.google.maps.Marker({
          position: { lat: center.lat, lng: center.lng },
          map: googleMapRef.current,
          title: center.name,
          icon: {
            url: 'data:image/svg+xml;base64,' + btoa(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
                <circle cx="20" cy="20" r="8" fill="#FFFFFF"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(40, 40)
          }
        });
        
        setIsGoogleMapsLoaded(true);
        setMapError(null);
      } else if (googleMapRef.current) {
        // Update existing map
        googleMapRef.current.setCenter({ lat: center.lat, lng: center.lng });
      }
    } catch (error) {
      console.error('Google Maps initialization error:', error);
      setMapError(`Failed to initialize Google Maps: ${error.message}`);
      setIsGoogleMapsLoaded(false);
    }
  };

  // Load Google Maps API script
  const loadGoogleMapsAPI = () => {
    if (!checkApiKey()) {
      return;
    }

    if (window.google && window.google.maps) {
      initializeGoogleMaps();
      return;
    }
    
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    // Handle script loading errors
    script.onerror = () => {
      setMapError('Failed to load Google Maps API. Please check your API key and internet connection.');
      setIsGoogleMapsLoaded(false);
    };
    
    window.initMap = () => {
      try {
        initializeGoogleMaps();
      } catch (error) {
        setMapError(`Google Maps initialization failed: ${error.message}`);
        setIsGoogleMapsLoaded(false);
      }
    };
    
    // Handle API key errors
    window.gm_authFailure = () => {
      setMapError('Google Maps API authentication failed. Please check your API key configuration.');
      setApiKeyStatus('invalid');
      setIsGoogleMapsLoaded(false);
    };
    
    document.head.appendChild(script);
  };

  // Center map on specific location
  const centerOnLocation = (index) => {
    setSelectedLocation(index);
    setMapKey(prev => prev + 1);
    
    // Fetch backend data for this location
    fetchBackendData(index);
    
    // Update Google Map if loaded
    if (googleMapRef.current) {
      const center = trafficCenters[index];
      googleMapRef.current.setCenter({ lat: center.lat, lng: center.lng });
      
      // Add new marker
      new window.google.maps.Marker({
        position: { lat: center.lat, lng: center.lng },
        map: googleMapRef.current,
        title: center.name,
        animation: window.google.maps.Animation.DROP
      });
    }
  };

  // Get user location and center map
  const findMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Find closest Telangana location or default to Hyderabad
          centerOnLocation(0); // Default to HITEC City
        },
        () => {
          centerOnLocation(0); // Fallback to HITEC City
        }
      );
    } else {
      centerOnLocation(0);
    }
  };

  // Fetch data from Google Maps backend service
  const fetchBackendData = async (locationId) => {
    try {
      const baseUrl = import.meta.env.VITE_MAPS_API_URL || 'http://localhost:5001';
      const response = await fetch(`${baseUrl}/api/maps/traffic/${locationId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBackendData(data);
          // Update traffic incidents from backend
          const incidentsResponse = await fetch(`${baseUrl}/api/maps/incidents`);
          if (incidentsResponse.ok) {
            const incidentsData = await incidentsResponse.json();
            if (incidentsData.success) {
              setTrafficIncidents(incidentsData.incidents);
            }
          }
        }
      }
    } catch (error) {
      console.log('Backend service not available, using fallback data');
      // Keep existing simulated data as fallback
    }
  };

  // Open external Google Maps
  const openInGoogleMaps = () => {
    const center = trafficCenters[selectedLocation];
    window.open(center.mapUrl, '_blank');
  };

  // Simulate live traffic incidents in Telangana
  useEffect(() => {
    const updateIncidents = () => {
      const incidents = [
        { id: 1, location: 'Outer Ring Road (ORR)', type: 'Heavy Traffic', severity: 'high', time: `${Math.floor(Math.random() * 5) + 1} min ago` },
        { id: 2, location: 'HITEC City - Gachibowli Road', type: 'Minor Accident', severity: 'medium', time: `${Math.floor(Math.random() * 10) + 1} min ago` },
        { id: 3, location: 'Secunderabad - Tank Bund', type: 'Road Work', severity: 'low', time: `${Math.floor(Math.random() * 15) + 1} min ago` },
        { id: 4, location: 'Ameerpet - SR Nagar', type: 'Vehicle Breakdown', severity: 'medium', time: `${Math.floor(Math.random() * 8) + 1} min ago` },
        { id: 5, location: 'Banjara Hills Road No. 1', type: 'Traffic Signal Issue', severity: 'high', time: `${Math.floor(Math.random() * 3) + 1} min ago` }
      ];
      setTrafficIncidents(incidents);
    };

    updateIncidents();
    const interval = setInterval(updateIncidents, 8000);
    return () => clearInterval(interval);
  }, []);

  // Initialize Google Maps and backend data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      loadGoogleMapsAPI();
      fetchBackendData(selectedLocation);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Check API key on component mount
  useEffect(() => {
    checkApiKey();
  }, []);

  // Update map when selected location changes
  useEffect(() => {
    if (isGoogleMapsLoaded) {
      initializeGoogleMaps();
    }
  }, [selectedLocation, isGoogleMapsLoaded]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <motion.div 
        className="bg-black/30 backdrop-blur-lg border-b border-white/10 p-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Navigation className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Telangana Google Maps API</h1>
              <p className="text-sm text-gray-300">Google Maps JavaScript API • Real-time traffic • Backend integration</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* External Maps Button */}
            <motion.button
              onClick={openInGoogleMaps}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm transition-colors hover:bg-blue-600/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-4 h-4" />
              <span>External Map</span>
            </motion.button>
            
            {/* Connection Status */}
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
              apiKeyStatus === 'missing' ? 'bg-yellow-600/20 text-yellow-400' :
              apiKeyStatus === 'invalid' ? 'bg-red-600/20 text-red-400' :
              isGoogleMapsLoaded ? 'bg-green-600/20 text-green-400' : 'bg-blue-600/20 text-blue-400'
            }`}>
              <Wifi className="w-4 h-4" />
              <span>
                {apiKeyStatus === 'missing' ? 'API Key Required' :
                 apiKeyStatus === 'invalid' ? 'Invalid API Key' :
                 isGoogleMapsLoaded ? 'Google Maps Active' : 
                 mapError ? 'Connection Failed' : 'Loading Google Maps...'}
              </span>
            </div>

            {/* Emergency Status */}
            {emergencyActive && (
              <div className="flex items-center space-x-1 px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm">
                <Zap className="w-4 h-4 animate-pulse" />
                <span>Emergency Mode</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Control Panel */}
        <motion.div 
          className="w-80 bg-black/20 backdrop-blur-lg border-r border-white/10 p-4 overflow-y-auto"
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Quick Controls */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Map Controls
            </h3>
            <div className="space-y-3">
              <motion.button
                onClick={findMyLocation}
                className="w-full flex items-center space-x-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-4 py-3 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MapPin className="w-4 h-4" />
                <span>Find My Location</span>
              </motion.button>
              
              <motion.button
                onClick={() => centerOnLocation(0)}
                className="w-full flex items-center space-x-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 px-4 py-3 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Route className="w-4 h-4" />
                <span>Center on Hyderabad</span>
              </motion.button>

              <motion.button
                onClick={openInGoogleMaps}
                className="w-full flex items-center space-x-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 px-4 py-3 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open External Maps</span>
              </motion.button>
            </div>
          </div>

          {/* Live Traffic Incidents */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Live Incidents
            </h3>
            <div className="space-y-2">
              <AnimatePresence>
                {trafficIncidents.map((incident) => (
                  <motion.div
                    key={incident.id}
                    className="bg-black/30 rounded-lg p-3 border-l-4 border-l-orange-500"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                        incident.severity === 'high' ? 'text-red-400' :
                        incident.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">{incident.type}</p>
                        <p className="text-xs text-gray-300">{incident.location}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">{incident.time}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Telangana Locations */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Telangana Locations
            </h3>
            <div className="space-y-2">
              {trafficCenters.map((center, index) => (
                <motion.div
                  key={index}
                  className={`bg-black/30 rounded-lg p-3 cursor-pointer hover:bg-black/40 transition-colors border ${
                    selectedLocation === index ? 'border-blue-500/50' : 'border-gray-700/50 hover:border-gray-600/50'
                  }`}
                  onClick={() => centerOnLocation(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                      center.severity === 'high' ? 'bg-red-400' :
                      center.severity === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                    } ${center.severity === 'high' ? 'animate-pulse' : ''}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{center.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-300 capitalize">{center.severity} traffic</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">{center.type}</span>
                      </div>
                    </div>
                    <Car className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Google Maps Container */}
        <div className="flex-1 relative">
          {!isLoaded ? (
            <motion.div 
              className="flex items-center justify-center h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 relative mx-auto mb-4">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <Navigation className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Loading Interactive Maps</h3>
                <p className="text-gray-300">Preparing Telangana map view...</p>
              </div>
            </motion.div>
          ) : mapError ? (
            <motion.div 
              className="flex items-center justify-center h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center max-w-md mx-auto p-8">
                <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Google Maps Configuration Required</h3>
                <p className="text-gray-300 mb-6">{mapError}</p>
                
                {apiKeyStatus === 'missing' && (
                  <div className="bg-black/30 border border-yellow-500/30 rounded-lg p-4 mb-4">
                    <h4 className="text-yellow-400 font-medium mb-2">📋 Quick Setup Steps:</h4>
                    <div className="text-left text-sm space-y-2">
                      <p className="text-gray-300">1. Get a Google Maps API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Cloud Console</a></p>
                      <p className="text-gray-300">2. Enable Maps JavaScript API, Places API, and Directions API</p>
                      <p className="text-gray-300">3. Update your .env file:</p>
                      <div className="bg-black/50 p-2 rounded mt-2 font-mono text-xs">
                        <span className="text-green-400">VITE_GOOGLE_MAPS_API_KEY</span>=<span className="text-blue-300">your_api_key_here</span>
                      </div>
                      <p className="text-gray-300">4. Restart your development server</p>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col space-y-3">
                  <motion.button
                    onClick={() => window.open('https://console.cloud.google.com/', '_blank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Google Maps API Key
                  </motion.button>
                  
                  <motion.button
                    onClick={() => window.location.reload()}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reload Page
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="w-full h-full relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Google Maps JavaScript API Container */}
              <div
                ref={mapRef}
                className="w-full h-full rounded-lg"
                style={{
                  background: '#1a1a1a',
                  border: 'none'
                }}
              >
                {!isGoogleMapsLoaded && !mapError && (
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="text-center">
                      <div className="w-12 h-12 relative mx-auto mb-3">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-white text-sm">Loading Google Maps API...</p>
                      <p className="text-gray-400 text-xs mt-1">Initializing interactive map</p>
                    </div>
                  </div>
                )}
                
                {!isGoogleMapsLoaded && apiKeyStatus === 'missing' && (
                  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20">
                    <div className="text-center max-w-lg mx-auto p-8">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <MapPin className="w-10 h-10 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4">Interactive Map Demo</h3>
                      <p className="text-gray-300 mb-6">
                        This is a preview of the {trafficCenters[selectedLocation].name} traffic monitoring area.
                      </p>
                      
                      <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Location:</p>
                            <p className="text-white font-medium">{trafficCenters[selectedLocation].name}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Area Type:</p>
                            <p className="text-white font-medium">{trafficCenters[selectedLocation].type}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Traffic Status:</p>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                trafficCenters[selectedLocation].severity === 'high' ? 'bg-red-400 animate-pulse' :
                                trafficCenters[selectedLocation].severity === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                              }`}></div>
                              <span className="text-white font-medium capitalize">{trafficCenters[selectedLocation].severity}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-400">Coordinates:</p>
                            <p className="text-white font-medium text-xs">
                              {trafficCenters[selectedLocation].lat.toFixed(4)}, {trafficCenters[selectedLocation].lng.toFixed(4)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-400 mb-4">
                        🗺️ To enable full interactive maps, configure your Google Maps API key in the .env file
                      </div>
                      
                      <motion.button
                        onClick={() => window.open(trafficCenters[selectedLocation].mapUrl, '_blank')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 flex items-center space-x-2 mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span>View in Google Maps</span>
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Map Overlay Controls */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-lg text-white px-4 py-2 rounded-lg border border-white/20">
                <div className="text-sm font-medium flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>{trafficCenters[selectedLocation].name}</span>
                </div>
                <div className="text-xs text-gray-300 mt-1">
                  {trafficCenters[selectedLocation].description}
                </div>
                {backendData && (
                  <div className="text-xs text-blue-300 mt-1 flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Live API data • {backendData.traffic?.delay_minutes || 0} min delay</span>
                  </div>
                )}
              </div>

              {/* Traffic Status Indicator */}
              <div className={`absolute top-4 right-4 backdrop-blur-lg px-3 py-2 rounded-lg border ${
                (backendData?.traffic?.severity || trafficCenters[selectedLocation].severity) === 'high' ? 'bg-red-600/20 text-red-400 border-red-500/30' :
                (backendData?.traffic?.severity || trafficCenters[selectedLocation].severity) === 'medium' ? 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30' :
                'bg-green-600/20 text-green-400 border-green-500/30'
              }`}>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    (backendData?.traffic?.severity || trafficCenters[selectedLocation].severity) === 'high' ? 'bg-red-400 animate-pulse' :
                    (backendData?.traffic?.severity || trafficCenters[selectedLocation].severity) === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                  }`}></div>
                  <span className="text-sm font-medium capitalize">
                    {backendData?.traffic?.severity || trafficCenters[selectedLocation].severity} Traffic
                  </span>
                  {backendData?.traffic?.simulated && (
                    <span className="text-xs opacity-60">(Simulated)</span>
                  )}
                </div>
              </div>

              {/* Google Maps API Status */}
              <div className="absolute bottom-4 left-4 bg-blue-600/20 backdrop-blur-lg text-blue-400 px-4 py-2 rounded-lg border border-blue-500/30">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isGoogleMapsLoaded ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                  <span className="text-sm font-medium">
                    {isGoogleMapsLoaded ? 'Google Maps API Active' : 'Loading Google Maps...'}
                  </span>
                </div>
                {backendData && (
                  <div className="text-xs mt-1 opacity-75">
                    Backend: {backendData.success ? '✓ Connected' : '✗ Offline'}
                  </div>
                )}
              </div>

              {/* External Link Button */}
              <div className="absolute bottom-4 right-4">
                <motion.button
                  onClick={openInGoogleMaps}
                  className="bg-black/70 backdrop-blur-lg text-white px-4 py-2 rounded-lg border border-white/20 hover:bg-black/80 transition-colors flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">Open in Full Maps</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveGoogleMap;
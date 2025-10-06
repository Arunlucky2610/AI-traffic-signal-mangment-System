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

  // Open external Google Maps
  const openInGoogleMaps = (location) => {
    window.open(location.mapUrl, '_blank');
  };

  // Open Hyderabad in Google Maps
  const openHyderabadMaps = () => {
    window.open('https://www.google.com/maps/place/Hyderabad,+Telangana/@17.3850,78.4867,11z', '_blank');
  };

  // Get user location and open in maps
  const findMyLocationMaps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          window.open(`https://www.google.com/maps/@${lat},${lng},15z`, '_blank');
        },
        () => {
          // Fallback to Hyderabad
          openHyderabadMaps();
        }
      );
    } else {
      openHyderabadMaps();
    }
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

  // Initialize loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get background image for selected location
  const getLocationImage = () => {
    const location = trafficCenters[selectedLocation];
    // Using a static image service that works reliably
    return `https://source.unsplash.com/1200x800/?hyderabad,${location.type.toLowerCase().replace(' ', '-')},india`;
  };

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
              <h1 className="text-xl font-bold text-white">Telangana Interactive Maps</h1>
              <p className="text-sm text-gray-300">Click locations to open in Google Maps • Live traffic incidents</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Open All Maps Button */}
            <motion.button
              onClick={openHyderabadMaps}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm transition-colors hover:bg-blue-600/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Maps</span>
            </motion.button>
            
            {/* Connection Status */}
            <div className="flex items-center space-x-1 px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
              <Wifi className="w-4 h-4" />
              <span>Interactive</span>
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
                onClick={findMyLocationMaps}
                className="w-full flex items-center space-x-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-4 py-3 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MapPin className="w-4 h-4" />
                <span>Find My Location</span>
                <ExternalLink className="w-3 h-3 ml-auto" />
              </motion.button>
              
              <motion.button
                onClick={openHyderabadMaps}
                className="w-full flex items-center space-x-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 px-4 py-3 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Route className="w-4 h-4" />
                <span>Open Hyderabad Maps</span>
                <ExternalLink className="w-3 h-3 ml-auto" />
              </motion.button>

              <motion.button
                onClick={() => window.open('https://www.google.com/maps/search/traffic+near+hyderabad', '_blank')}
                className="w-full flex items-center space-x-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 px-4 py-3 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Layers className="w-4 h-4" />
                <span>Live Traffic Maps</span>
                <ExternalLink className="w-3 h-3 ml-auto" />
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
                  onClick={() => {
                    setSelectedLocation(index);
                    openInGoogleMaps(center);
                  }}
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
                    <ExternalLink className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Map Display Area */}
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
                <p className="text-gray-300">Preparing Telangana locations...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="w-full h-full relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Location Display */}
              <div
                className="w-full h-full bg-cover bg-center relative"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${getLocationImage()})`
                }}
              >
                {/* Location Info Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="bg-black/70 backdrop-blur-lg rounded-xl p-8 max-w-md mx-4 text-center border border-white/20"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      trafficCenters[selectedLocation].severity === 'high' ? 'bg-red-500/20 text-red-400' :
                      trafficCenters[selectedLocation].severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                      'bg-green-500/20 text-green-400'
                    }`}>
                      <MapPin className="w-8 h-8" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {trafficCenters[selectedLocation].name}
                    </h2>
                    
                    <p className="text-gray-300 mb-4">
                      {trafficCenters[selectedLocation].description}
                    </p>
                    
                    <div className="flex items-center justify-center space-x-4 mb-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Traffic Level</div>
                        <div className={`text-lg font-semibold capitalize ${
                          trafficCenters[selectedLocation].severity === 'high' ? 'text-red-400' :
                          trafficCenters[selectedLocation].severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {trafficCenters[selectedLocation].severity}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Type</div>
                        <div className="text-lg font-semibold text-blue-400">
                          {trafficCenters[selectedLocation].type}
                        </div>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={() => openInGoogleMaps(trafficCenters[selectedLocation])}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                </div>
              </div>

              {/* Status Overlays */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-lg text-white px-4 py-2 rounded-lg">
                <div className="text-sm font-medium">📍 {trafficCenters[selectedLocation].name}</div>
              </div>

              <div className="absolute top-4 right-4 bg-green-600/20 backdrop-blur-lg text-green-400 px-3 py-2 rounded-lg border border-green-500/30">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Interactive Ready</span>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-lg text-white px-4 py-3 rounded-lg border border-gray-700/50">
                <div className="text-sm space-y-2">
                  <div className="font-semibold mb-2">🚦 Traffic Status</div>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <span>Heavy</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <span>Moderate</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span>Clear</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 bg-blue-600/20 backdrop-blur-lg text-blue-400 px-3 py-2 rounded-lg border border-blue-500/30">
                <div className="text-sm text-center">
                  <div className="font-medium">Telangana State</div>
                  <div className="text-xs opacity-75">Click locations to explore</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveGoogleMap;
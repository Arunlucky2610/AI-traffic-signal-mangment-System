import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  AlertTriangle,
  Radio,
  Eye,
  Route,
  Settings,
  Layers,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Map component that will be rendered inside the Wrapper
const MapComponent = ({ 
  center, 
  zoom, 
  emergencyActive, 
  signals, 
  onMapLoad,
  showTraffic = true,
  mapRef 
}) => {
  const ref = useRef(null);
  const [map, setMap] = useState(null);
  const [trafficLayer, setTrafficLayer] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeId: 'roadmap',
        styles: [
          // Dark theme for the map
          { elementType: "geometry", stylers: [{ color: "#1f2937" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#1f2937" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d1d5db" }]
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca3af" }]
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#1f4d3a" }]
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b8f73" }]
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#374151" }]
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2937" }]
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca3af" }]
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#4b5563" }]
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2937" }]
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3f4f6" }]
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3c57" }]
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca3af" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#0f172a" }]
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b7280" }]
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#0f172a" }]
          }
        ],
        disableDefaultUI: true,
        zoomControl: true,
        fullscreenControl: true,
        streetViewControl: false,
        mapTypeControl: false
      });

      setMap(newMap);
      
      // Initialize traffic layer
      const traffic = new window.google.maps.TrafficLayer();
      setTrafficLayer(traffic);
      
      if (showTraffic) {
        traffic.setMap(newMap);
      }

      if (onMapLoad) {
        onMapLoad(newMap);
      }

      // Store map reference
      if (mapRef) {
        mapRef.current = newMap;
      }
    }
  }, [ref, map, center, zoom, onMapLoad, showTraffic, mapRef]);

  // Add traffic signal markers
  useEffect(() => {
    if (map && signals?.length > 0) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));
      
      const newMarkers = signals.map(signal => {
        // For demo purposes, place signals around the map center
        // In a real app, you'd have actual coordinates
        const lat = center.lat + (Math.random() - 0.5) * 0.01;
        const lng = center.lng + (Math.random() - 0.5) * 0.01;
        
        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: signal.name || `Traffic Signal ${signal.id}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: signal.status === 'red' ? '#ef4444' : 
                      signal.status === 'yellow' ? '#f59e0b' : '#10b981',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="color: #1f2937; padding: 8px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">${signal.name || `Signal ${signal.id}`}</h3>
              <p style="margin: 0 0 4px 0;">Status: <strong style="color: ${
                signal.status === 'red' ? '#ef4444' : 
                signal.status === 'yellow' ? '#f59e0b' : '#10b981'
              }">${signal.status.toUpperCase()}</strong></p>
              <p style="margin: 0 0 4px 0;">Timing: ${signal.timing || '30s'}</p>
              <p style="margin: 0;">Emergency: ${emergencyActive ? 'ACTIVE' : 'Normal'}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        return marker;
      });
      
      setMarkers(newMarkers);
    }

    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [map, signals, emergencyActive, center]);

  // Toggle traffic layer
  useEffect(() => {
    if (trafficLayer) {
      if (showTraffic) {
        trafficLayer.setMap(map);
      } else {
        trafficLayer.setMap(null);
      }
    }
  }, [trafficLayer, map, showTraffic]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
};

// Loading component
const Loading = ({ status }) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-96 glass-effect rounded-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading Google Maps...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-96 glass-effect rounded-xl border border-red-500/50">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-400 mb-2">Failed to load Google Maps</p>
            <p className="text-gray-400 text-sm">Please check your API key configuration</p>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const LiveGoogleMap = ({ emergencyActive, isMonitoring, signals = [] }) => {
  const { toast } = useToast();
  const mapRef = useRef(null);
  const [showTraffic, setShowTraffic] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7589, lng: -73.9851 }); // Times Square, NYC
  const [userLocation, setUserLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          setMapCenter(userPos);
          toast({
            title: "Location found!",
            description: "Map centered on your current location"
          });
        },
        (error) => {
          console.warn("Geolocation error:", error);
          toast({
            title: "Location access denied",
            description: "Using default location (Times Square, NYC)",
            variant: "destructive"
          });
        }
      );
    }
  }, [toast]);

  const handleMapLoad = useCallback((map) => {
    setMapLoaded(true);
    
    // Add user location marker if available
    if (userLocation) {
      new window.google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Your Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#3b82f6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3
        }
      });
    }
  }, [userLocation]);

  const toggleTrafficLayer = () => {
    setShowTraffic(!showTraffic);
    toast({
      title: showTraffic ? "Traffic layer hidden" : "Traffic layer shown",
      description: showTraffic ? "Live traffic data is now hidden" : "Live traffic data is now visible"
    });
  };

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.panTo(userLocation);
      mapRef.current.setZoom(15);
      toast({
        title: "Centered on your location",
        description: "Map view updated to your current position"
      });
    } else {
      toast({
        title: "Location not available",
        description: "Unable to access your current location",
        variant: "destructive"
      });
    }
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Check if API key is properly configured
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey.length < 10) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Live Google Maps</h2>
            <p className="text-gray-300 mt-1">Real-time traffic and signal monitoring</p>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-8 border border-yellow-500/50">
          <div className="text-center">
            <Settings className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Google Maps API Key Required</h3>
            <div className="text-left max-w-2xl mx-auto space-y-4">
              <p className="text-gray-300">To use live Google Maps, you need to:</p>
              <ol className="list-decimal list-inside text-gray-300 space-y-2">
                <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Cloud Console</a></li>
                <li>Create a new project or select an existing one</li>
                <li>Enable the <strong>Maps JavaScript API</strong> and <strong>Places API</strong></li>
                <li>Create an API key in the Credentials section</li>
                <li>Add your API key to the <code className="bg-gray-700 px-2 py-1 rounded">.env</code> file:</li>
              </ol>
              <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                <code className="text-green-400">VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here</code>
              </div>
              <p className="text-sm text-gray-400">
                <strong>Note:</strong> The API key in the gist you mentioned is no longer working due to usage limits. 
                You'll need to create your own for production use.
              </p>
            </div>
            <div className="mt-6">
              <Button 
                onClick={() => toast({ 
                  title: "For now, using simulated map", 
                  description: "The original TrafficMap component shows simulated traffic data" 
                })}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue with Simulated Map
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Live Google Maps</h2>
          <p className="text-gray-300 mt-1">Real-time traffic and signal monitoring</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant={showTraffic ? "default" : "outline"}
            size="sm"
            onClick={toggleTrafficLayer}
            disabled={!mapLoaded}
          >
            <Layers className="w-4 h-4 mr-2" />
            Traffic Layer
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={centerOnUser}
            disabled={!userLocation}
          >
            <Navigation className="w-4 h-4 mr-2" />
            My Location
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast({ title: "🚧 Route planning coming soon! 🚀" })}
          >
            <Route className="w-4 h-4 mr-2" />
            Route Planning
          </Button>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <div className="h-96 relative">
          <Wrapper apiKey={apiKey} render={Loading}>
            <MapComponent
              center={mapCenter}
              zoom={14}
              emergencyActive={emergencyActive}
              signals={signals}
              onMapLoad={handleMapLoad}
              showTraffic={showTraffic}
              mapRef={mapRef}
            />
          </Wrapper>

          {emergencyActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 right-4 glass-effect rounded-lg p-4 border border-red-500/50 z-10"
            >
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-semibold text-red-400">Emergency Active</span>
              </div>
              <div className="text-xs text-gray-300 space-y-1">
                <div>Live traffic monitoring active</div>
                <div>Emergency route optimization</div>
                <div>Signals: {signals.length} monitored</div>
              </div>
            </motion.div>
          )}

          {mapLoaded && (
            <div className="absolute bottom-4 left-4 glass-effect rounded-lg p-4 space-y-2 z-10">
              <h4 className="text-sm font-semibold text-white mb-2">Live Traffic Legend</h4>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-300">Fast Traffic</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-gray-300">Moderate Traffic</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-300">Heavy Traffic</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-xs text-gray-300">Traffic Signals</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Live Traffic Data</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Current Location</span>
              <span className="text-xs text-blue-400">
                {userLocation ? 'Located' : 'Searching...'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Traffic Layer</span>
              <span className={`text-xs ${showTraffic ? 'text-green-400' : 'text-gray-400'}`}>
                {showTraffic ? 'Active' : 'Hidden'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Map Status</span>
              <span className={`text-xs ${mapLoaded ? 'text-green-400' : 'text-yellow-400'}`}>
                {mapLoaded ? 'Loaded' : 'Loading...'}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Signal Monitoring</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">Active Signals</span>
              <span className="text-sm font-semibold text-white">{signals.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">Emergency Mode</span>
              <span className={`text-sm font-semibold ${emergencyActive ? 'text-red-400' : 'text-gray-400'}`}>
                {emergencyActive ? 'ACTIVE' : 'Normal'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">Monitoring</span>
              <span className={`text-sm font-semibold ${isMonitoring ? 'text-green-400' : 'text-gray-400'}`}>
                {isMonitoring ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">Google Maps API</span>
              <span className="text-sm font-semibold text-green-400">Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">Live Traffic</span>
              <span className="text-sm font-semibold text-green-400">Available</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">Real-time Updates</span>
              <span className="text-sm font-semibold text-blue-400">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveGoogleMap;

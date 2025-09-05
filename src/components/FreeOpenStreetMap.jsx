import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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
  Zap,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import L from 'leaflet';
import './MapStyles.css';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom traffic signal icon
const createTrafficSignalIcon = (status) => {
  const color = status === 'red' ? '#ef4444' : 
               status === 'yellow' ? '#f59e0b' : '#10b981';
  
  return L.divIcon({
    html: `
      <div style="
        width: 20px; 
        height: 20px; 
        background-color: ${color}; 
        border: 2px solid white; 
        border-radius: 50%; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 6px; 
          height: 6px; 
          background-color: white; 
          border-radius: 50%;
        "></div>
      </div>
    `,
    className: 'traffic-signal-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Component to handle map events and updates
const MapController = ({ center, emergencyActive }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);

  useEffect(() => {
    if (emergencyActive) {
      // Add emergency styling or effects here
      console.log('Emergency mode activated on map');
    }
  }, [emergencyActive]);

  return null;
};

const FreeOpenStreetMap = ({ emergencyActive, isMonitoring, signals = [] }) => {
  const { toast } = useToast();
  const [mapCenter, setMapCenter] = useState([40.7589, -73.9851]); // Times Square, NYC
  const [userLocation, setUserLocation] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [simulatedTrafficSignals, setSimulatedTrafficSignals] = useState([]);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = [position.coords.latitude, position.coords.longitude];
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

  // Create simulated traffic signals around the map center
  useEffect(() => {
    if (mapCenter) {
      const simulatedSignals = [
        {
          id: 1,
          name: 'Main St & 1st Ave',
          position: [mapCenter[0] + 0.002, mapCenter[1] - 0.003],
          status: 'red',
          timing: '45s'
        },
        {
          id: 2,
          name: 'Oak St & 2nd Ave', 
          position: [mapCenter[0] - 0.001, mapCenter[1] + 0.002],
          status: 'green',
          timing: '30s'
        },
        {
          id: 3,
          name: 'Pine St & 3rd Ave',
          position: [mapCenter[0] + 0.003, mapCenter[1] + 0.001],
          status: 'yellow',
          timing: '15s'
        },
        {
          id: 4,
          name: 'Elm St & Main St',
          position: [mapCenter[0] - 0.002, mapCenter[1] - 0.001],
          status: emergencyActive ? 'green' : 'red',
          timing: '35s'
        },
        {
          id: 5,
          name: 'Broadway & 5th Ave',
          position: [mapCenter[0] + 0.001, mapCenter[1] - 0.002],
          status: emergencyActive ? 'green' : 'yellow',
          timing: '25s'
        }
      ];
      
      setSimulatedTrafficSignals(simulatedSignals);
    }
  }, [mapCenter, emergencyActive]);

  const centerOnUser = () => {
    if (userLocation) {
      setMapCenter(userLocation);
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

  const handleMapReady = () => {
    setTimeout(() => {
      setMapReady(true);
      toast({
        title: "Map loaded successfully!",
        description: "OpenStreetMap with live traffic simulation"
      });
    }, 500); // Small delay to ensure map is fully rendered
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Live OpenStreet Map</h2>
          <p className="text-gray-300 mt-1">Free alternative with simulated traffic monitoring</p>
        </div>
        <div className="flex items-center space-x-4">
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
            onClick={() => toast({ 
              title: "Traffic simulation active", 
              description: "Showing simulated traffic signals and emergency routes" 
            })}
          >
            <Layers className="w-4 h-4 mr-2" />
            Traffic Simulation
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
        <div className="map-container">
          {!mapReady && (
            <div className="map-loading">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p>Loading Map...</p>
              </div>
            </div>
          )}
          <MapContainer
            center={mapCenter}
            zoom={15}
            style={{ height: '100%', width: '100%', position: mapReady ? 'relative' : 'absolute', zIndex: mapReady ? 1 : -1 }}
            whenCreated={handleMapReady}
            className="leaflet-container"
            scrollWheelZoom={true}
            doubleClickZoom={true}
            dragging={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
              minZoom={3}
            />
            
            <MapController center={{ lat: mapCenter[0], lng: mapCenter[1] }} emergencyActive={emergencyActive} />
            
            {/* User location marker */}
            {userLocation && (
              <Marker position={userLocation}>
                <Popup>
                  <div className="text-center">
                    <strong>Your Location</strong>
                    <br />
                    <span className="text-blue-600">Current Position</span>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Traffic signal markers */}
            {simulatedTrafficSignals.map((signal) => (
              <Marker 
                key={signal.id} 
                position={signal.position}
                icon={createTrafficSignalIcon(signal.status)}
              >
                <Popup>
                  <div className="text-center min-w-[200px]">
                    <h3 className="font-bold text-gray-800 mb-2">{signal.name}</h3>
                    <div className="space-y-1">
                      <p>Status: <span style={{ 
                        color: signal.status === 'red' ? '#ef4444' : 
                               signal.status === 'yellow' ? '#f59e0b' : '#10b981',
                        fontWeight: 'bold'
                      }}>{signal.status.toUpperCase()}</span></p>
                      <p>Timing: {signal.timing}</p>
                      <p>Emergency: {emergencyActive ? 'ACTIVE' : 'Normal'}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {emergencyActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 right-4 glass-effect rounded-lg p-4 border border-red-500/50 z-[1000]"
            >
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-semibold text-red-400">Emergency Active</span>
              </div>
              <div className="text-xs text-gray-300 space-y-1">
                <div>Emergency corridor activated</div>
                <div>Signals optimized for clearance</div>
                <div>Route: {simulatedTrafficSignals.length} signals coordinated</div>
              </div>
            </motion.div>
          )}

          {mapReady && (
            <div className="absolute bottom-4 left-4 glass-effect rounded-lg p-4 space-y-2 z-[1000]">
              <h4 className="text-sm font-semibold text-white mb-2">Traffic Signal Legend</h4>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                <span className="text-xs text-gray-300">Red Signal</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full border border-white"></div>
                <span className="text-xs text-gray-300">Yellow Signal</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                <span className="text-xs text-gray-300">Green Signal</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                <span className="text-xs text-gray-300">Your Location</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Map Features</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Map Provider</span>
              <span className="text-xs text-green-400">OpenStreetMap</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Cost</span>
              <span className="text-xs text-green-400">FREE</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">API Key Required</span>
              <span className="text-xs text-green-400">No</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Traffic Simulation</span>
              <span className="text-xs text-blue-400">Active</span>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Signal Monitoring</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">Active Signals</span>
              <span className="text-sm font-semibold text-white">{simulatedTrafficSignals.length}</span>
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
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">Location</span>
              <span className="text-sm font-semibold text-blue-400">
                {userLocation ? 'Found' : 'Searching...'}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Live Updates</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">Map Status</span>
              <span className="text-sm font-semibold text-green-400">
                {mapReady ? 'Ready' : 'Loading...'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">Real-time Data</span>
              <span className="text-sm font-semibold text-blue-400">Simulated</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">Response Time</span>
              <span className="text-sm font-semibold text-green-400">&lt; 1s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">Coverage</span>
              <span className="text-sm font-semibold text-blue-400">Global</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6 border border-blue-500/50">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-400 mb-2">Free OpenStreetMap Integration</h3>
            <p className="text-gray-300 mb-3">
              This implementation uses OpenStreetMap (OSM), a free and open-source mapping platform that doesn't require any API keys. 
              It provides excellent global coverage and is completely free to use.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-white mb-2">✅ Advantages:</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• No API key required</li>
                  <li>• Completely free</li>
                  <li>• Global coverage</li>
                  <li>• Open source</li>
                  <li>• Regular updates</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">📝 Note:</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• Traffic data is simulated</li>
                  <li>• For real traffic data, use Google Maps</li>
                  <li>• Signal positions are demo locations</li>
                  <li>• Perfect for development & testing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeOpenStreetMap;

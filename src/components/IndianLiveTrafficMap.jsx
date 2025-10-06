import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  Car, 
  Truck, 
  AlertTriangle, 
  Eye, 
  Settings,
  Play,
  Pause,
  Globe,
  Radar,
  RefreshCw
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Major Indian cities with coordinates and real-time data simulation
const INDIAN_CITIES = {
  mumbai: { 
    lat: 19.0760, lng: 72.8777, 
    name: 'Mumbai', state: 'Maharashtra', 
    population: '12.5M', traffic: 'Heavy' 
  },
  delhi: { 
    lat: 28.6139, lng: 77.2090, 
    name: 'New Delhi', state: 'Delhi', 
    population: '11.0M', traffic: 'Extreme' 
  },
  bangalore: { 
    lat: 12.9716, lng: 77.5946, 
    name: 'Bangalore', state: 'Karnataka', 
    population: '8.4M', traffic: 'Heavy' 
  },
  hyderabad: { 
    lat: 17.3850, lng: 78.4867, 
    name: 'Hyderabad', state: 'Telangana', 
    population: '6.9M', traffic: 'Moderate' 
  },
  chennai: { 
    lat: 13.0827, lng: 80.2707, 
    name: 'Chennai', state: 'Tamil Nadu', 
    population: '7.0M', traffic: 'Heavy' 
  },
  kolkata: { 
    lat: 22.5726, lng: 88.3639, 
    name: 'Kolkata', state: 'West Bengal', 
    population: '4.5M', traffic: 'Moderate' 
  },
  pune: { 
    lat: 18.5204, lng: 73.8567, 
    name: 'Pune', state: 'Maharashtra', 
    population: '3.1M', traffic: 'Moderate' 
  },
  ahmedabad: { 
    lat: 23.0225, lng: 72.5714, 
    name: 'Ahmedabad', state: 'Gujarat', 
    population: '5.6M', traffic: 'Moderate' 
  },
  jaipur: { 
    lat: 26.9124, lng: 75.7873, 
    name: 'Jaipur', state: 'Rajasthan', 
    population: '3.1M', traffic: 'Light' 
  },
  lucknow: { 
    lat: 26.8467, lng: 80.9462, 
    name: 'Lucknow', state: 'Uttar Pradesh', 
    population: '2.8M', traffic: 'Light' 
  }
};

// Animated Vehicle Marker Component for 2D Map
const AnimatedVehicleMarker = ({ position, type, isEmergency, onMap }) => {
  const vehicleEmoji = type === 'truck' ? '🚛' : type === 'bus' ? '🚌' : '🚗';
  const color = isEmergency ? '#ff0000' : type === 'truck' ? '#0066cc' : type === 'bus' ? '#ff9900' : '#00cc66';
  
  if (!onMap) return null;

  return (
    <Marker
      position={position}
      icon={L.divIcon({
        className: 'animated-vehicle',
        html: `
          <div style="
            background: ${color}; 
            width: 24px; 
            height: 24px; 
            border-radius: 50%; 
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ${isEmergency ? 'animation: pulse 1s infinite;' : ''}
          ">
            ${vehicleEmoji}
          </div>
          <style>
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.2); }
              100% { transform: scale(1); }
            }
          </style>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })}
    />
  );
};

// Custom marker icons
const createCustomIcon = (color, isEmergency = false, trafficLevel = 'normal') => {
  const size = trafficLevel === 'heavy' ? 25 : trafficLevel === 'extreme' ? 30 : 20;
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color}; 
        width: ${size}px; 
        height: ${size}px; 
        border-radius: 50%; 
        border: 3px solid white;
        box-shadow: 0 2px 15px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        ${isEmergency ? 'animation: pulse 1s infinite;' : ''}
      ">
        🚗
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
          50% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
        }
      </style>
    `,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};

// Real Map Tile Layer Configurations
const MAP_LAYERS = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, DigitalGlobe, GeoEye, Earthstar Geographics',
    name: 'Satellite'
  },
  streets: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    name: 'Streets'
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>',
    name: 'Terrain'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    name: 'Dark Mode'
  },
  traffic: {
    url: 'https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=YOUR_API_KEY',
    attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    name: 'Traffic Optimized'
  }
};

// Indian Metro and Transit Lines Data
const INDIAN_TRANSIT_LINES = {
  delhi: [
    { name: 'Red Line', coordinates: [[28.7041, 77.1025], [28.6139, 77.2090]], color: '#dc2626' },
    { name: 'Blue Line', coordinates: [[28.7041, 77.1025], [28.5355, 77.3910]], color: '#2563eb' },
    { name: 'Yellow Line', coordinates: [[28.6692, 77.4538], [28.6139, 77.2090]], color: '#eab308' },
    { name: 'Green Line', coordinates: [[28.6139, 77.2090], [28.4595, 77.0266]], color: '#059669' }
  ],
  mumbai: [
    { name: 'Western Line', coordinates: [[19.0760, 72.8777], [19.2183, 72.9781]], color: '#dc2626' },
    { name: 'Central Line', coordinates: [[19.0760, 72.8777], [19.0830, 73.1484]], color: '#2563eb' },
    { name: 'Harbour Line', coordinates: [[19.0760, 72.8777], [18.9750, 72.8258]], color: '#059669' }
  ],
  bangalore: [
    { name: 'Purple Line', coordinates: [[12.9716, 77.5946], [13.0827, 77.6510]], color: '#7c3aed' },
    { name: 'Green Line', coordinates: [[12.9716, 77.5946], [13.0173, 77.5385]], color: '#059669' }
  ]
};

// Major Indian Highways and Expressways
const INDIAN_HIGHWAYS = {
  'NH-44': { 
    coordinates: [
      [28.7041, 77.1025], // Delhi
      [26.9124, 75.7873], // Jaipur
      [23.0225, 72.5714], // Ahmedabad
      [19.0760, 72.8777], // Mumbai
      [15.3173, 75.7139], // Belgaum
      [12.9716, 77.5946]  // Bangalore
    ],
    color: '#f59e0b',
    name: 'Golden Quadrilateral (NH-44)',
    type: 'expressway'
  },
  'NH-48': {
    coordinates: [
      [28.7041, 77.1025], // Delhi
      [28.4595, 77.0266], // Gurgaon
      [27.5706, 76.6187], // Alwar
      [26.9124, 75.7873]  // Jaipur
    ],
    color: '#06b6d4',
    name: 'Delhi-Jaipur Expressway',
    type: 'highway'
  },
  'Eastern-Corridor': {
    coordinates: [
      [28.7041, 77.1025], // Delhi
      [26.8467, 80.9462], // Lucknow
      [25.3176, 82.9739], // Varanasi
      [22.5726, 88.3639]  // Kolkata
    ],
    color: '#84cc16',
    name: 'Eastern Dedicated Freight Corridor',
    type: 'freight'
  }
};

// Weather overlay simulation
const generateWeatherData = (city) => {
  return {
    temperature: 25 + Math.random() * 15,
    humidity: 40 + Math.random() * 40,
    windSpeed: Math.random() * 20,
    condition: ['Clear', 'Cloudy', 'Rain', 'Fog'][Math.floor(Math.random() * 4)],
    visibility: 5 + Math.random() * 10
  };
};

// AI Traffic Prediction Zones
const generateAIPredictionZones = (cityCoords) => {
  const zones = [];
  for (let i = 0; i < 5; i++) {
    zones.push({
      center: [cityCoords.lat + (Math.random() - 0.5) * 0.1, cityCoords.lng + (Math.random() - 0.5) * 0.1],
      radius: 500 + Math.random() * 1500,
      congestionPrediction: Math.random() * 100,
      optimizedTiming: Math.floor(Math.random() * 120) + 30
    });
  }
  return zones;
};

// Main Indian Live Traffic Map Component
const IndianLiveTrafficMap = ({ emergencyActive = false, isMonitoring = true }) => {
  const [selectedCity, setSelectedCity] = useState('delhi');
  const [showTrafficFlow, setShowTrafficFlow] = useState(true);
  const [showMovingVehicles, setShowMovingVehicles] = useState(true);
  const [realTimeData, setRealTimeData] = useState({});
  const [movingVehicles, setMovingVehicles] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mapLayer, setMapLayer] = useState('satellite');
  const [showWeather, setShowWeather] = useState(false);
  const [showTrafficHeatmap, setShowTrafficHeatmap] = useState(true);
  const [showTransitLines, setShowTransitLines] = useState(false);
  const [showHighways, setShowHighways] = useState(true);
  const [aiMode, setAiMode] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // Simulate real-time traffic data
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      const newData = {};
      Object.keys(INDIAN_CITIES).forEach(cityKey => {
        const city = INDIAN_CITIES[cityKey];
        newData[cityKey] = {
          vehicles: Math.floor(Math.random() * 2000) + 500,
          avgSpeed: Math.floor(Math.random() * 50) + 15,
          congestion: emergencyActive ? 'LOW' : ['LOW', 'MEDIUM', 'HIGH', 'EXTREME'][Math.floor(Math.random() * 4)],
          emergencyVehicles: emergencyActive ? Math.floor(Math.random() * 5) + 1 : 0,
          signalStatus: emergencyActive ? 'GREEN CORRIDOR' : ['NORMAL', 'OPTIMIZED', 'MANUAL'][Math.floor(Math.random() * 3)]
        };
      });
      setRealTimeData(newData);
    }, 2000);

    return () => clearInterval(interval);
  }, [emergencyActive, isPlaying]);

  // Moving vehicles simulation
  useEffect(() => {
    if (isPlaying && showMovingVehicles) {
      const interval = setInterval(() => {
        const cityBounds = INDIAN_CITIES[selectedCity];
        const newVehicles = [];
        
        for (let i = 0; i < 15; i++) {
          newVehicles.push({
            id: `vehicle_${i}_${Date.now()}`,
            lat: cityBounds.lat + (Math.random() - 0.5) * 0.2,
            lng: cityBounds.lng + (Math.random() - 0.5) * 0.2,
            type: ['car', 'bus', 'truck', 'emergency'][Math.floor(Math.random() * 4)],
            direction: Math.random() * 360,
            speed: 20 + Math.random() * 60,
            isEmergency: emergencyActive && Math.random() < 0.3
          });
        }
        
        setMovingVehicles(newVehicles);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [selectedCity, isPlaying, showMovingVehicles, emergencyActive]);

  const currentCity = INDIAN_CITIES[selectedCity];
  const mapCenter = [currentCity.lat, currentCity.lng];

  // Generate animated traffic routes
  const trafficRoutes = useMemo(() => {
    const routes = [];
    const cities = Object.values(INDIAN_CITIES);
    
    for (let i = 0; i < cities.length - 1; i++) {
      routes.push({
        positions: [
          [cities[i].lat, cities[i].lng],
          [cities[i + 1].lat, cities[i + 1].lng]
        ],
        color: emergencyActive ? '#ff0000' : '#0066cc',
        weight: emergencyActive ? 6 : 4,
        opacity: showTrafficFlow ? 0.8 : 0.3
      });
    }
    return routes;
  }, [emergencyActive, showTrafficFlow]);

  return (
    <div className="w-full h-full relative bg-slate-900">
      {/* Control Panel */}
      <motion.div 
        className="absolute top-4 left-4 z-20 glass-effect p-4 rounded-lg space-y-4 min-w-[300px]"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-bold text-white">🇮🇳 Indian Traffic Network</h3>
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1 rounded-lg text-sm transition-all ${
              isPlaying ? 'bg-red-500/30 text-red-300' : 'bg-green-500/30 text-green-300'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>

        {/* Map Layer Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Map Layer:</label>
          <select
            value={mapLayer}
            onChange={(e) => setMapLayer(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm bg-white/10 text-white border border-white/20 focus:border-blue-400"
          >
            {Object.entries(MAP_LAYERS).map(([key, layer]) => (
              <option key={key} value={key} className="bg-gray-800 text-white">
                {layer.name}
              </option>
            ))}
          </select>
        </div>

        {/* Advanced Features */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Advanced Features:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowMovingVehicles(!showMovingVehicles)}
              className={`px-2 py-1 rounded text-xs transition-all ${
                showMovingVehicles 
                  ? 'bg-green-500/30 text-green-300 border border-green-400' 
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              🚗 Vehicles
            </button>
            <button
              onClick={() => setShowWeather(!showWeather)}
              className={`px-2 py-1 rounded text-xs transition-all ${
                showWeather 
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-400' 
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              🌤️ Weather
            </button>
            <button
              onClick={() => setShowTrafficHeatmap(!showTrafficHeatmap)}
              className={`px-2 py-1 rounded text-xs transition-all ${
                showTrafficHeatmap 
                  ? 'bg-red-500/30 text-red-300 border border-red-400' 
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              🔥 Heatmap
            </button>
            <button
              onClick={() => setShowTransitLines(!showTransitLines)}
              className={`px-2 py-1 rounded text-xs transition-all ${
                showTransitLines 
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-400' 
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              🚇 Transit
            </button>
            <button
              onClick={() => setShowHighways(!showHighways)}
              className={`px-2 py-1 rounded text-xs transition-all ${
                showHighways 
                  ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-400' 
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              🛣️ Highways
            </button>
            <button
              onClick={() => setAiMode(!aiMode)}
              className={`px-2 py-1 rounded text-xs transition-all ${
                aiMode 
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400' 
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              🤖 AI Mode
            </button>
            <button
              onClick={() => {
                setDemoMode(!demoMode);
                if (!demoMode) {
                  // Enable all features for demo
                  setShowMovingVehicles(true);
                  setShowWeather(true);
                  setShowTrafficHeatmap(true);
                  setShowTransitLines(true);
                  setShowHighways(true);
                  setAiMode(true);
                  setMapLayer('satellite');
                }
              }}
              className={`px-2 py-1 rounded text-xs transition-all ${
                demoMode 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border border-pink-400 animate-pulse' 
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              🚀 Demo Mode
            </button>
          </div>
        </div>

        {/* City Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Focus City:</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm"
          >
            {Object.entries(INDIAN_CITIES).map(([key, city]) => (
              <option key={key} value={key} className="bg-gray-800">
                {city.name}, {city.state}
              </option>
            ))}
          </select>
        </div>

        {/* Traffic Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white">Traffic Flow</span>
            <button
              onClick={() => setShowTrafficFlow(!showTrafficFlow)}
              className={`w-10 h-6 rounded-full transition-all ${
                showTrafficFlow ? 'bg-green-500' : 'bg-gray-500'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-all transform ${
                showTrafficFlow ? 'translate-x-5' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Status Panel */}
      <motion.div 
        className="absolute top-4 right-4 z-20 glass-effect p-4 rounded-lg space-y-3 min-w-[250px]"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-2">
          <Radar className={`w-5 h-5 ${isMonitoring && isPlaying ? 'text-green-400' : 'text-red-400'}`} />
          <span className="text-sm text-white">
            System {isMonitoring && isPlaying ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
        
        {emergencyActive && (
          <motion.div 
            className="flex items-center space-x-2 text-red-400 bg-red-500/20 p-2 rounded"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-bold">NATIONAL EMERGENCY</span>
          </motion.div>
        )}

        {realTimeData[selectedCity] && (
          <div className="text-sm space-y-2 bg-black/20 p-3 rounded">
            <div className="text-white font-semibold border-b border-white/20 pb-1">
              📍 {INDIAN_CITIES[selectedCity].name}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-blue-300">
                🚗 {realTimeData[selectedCity].vehicles} vehicles
              </div>
              <div className="text-green-300">
                ⚡ {realTimeData[selectedCity].avgSpeed} km/h
              </div>
              <div className={`font-semibold ${
                realTimeData[selectedCity].congestion === 'EXTREME' ? 'text-red-400' :
                realTimeData[selectedCity].congestion === 'HIGH' ? 'text-orange-400' :
                realTimeData[selectedCity].congestion === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'
              }`}>
                🚦 {realTimeData[selectedCity].congestion}
              </div>
              <div className="text-purple-300">
                🚨 {realTimeData[selectedCity].emergencyVehicles} Emergency
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Map Container */}
      <div className="w-full h-full">
        <MapContainer
          center={mapCenter}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url={MAP_LAYERS[mapLayer].url}
            attribution={MAP_LAYERS[mapLayer].attribution}
          />            {/* City markers */}
            {Object.entries(INDIAN_CITIES).map(([key, city]) => {
              const cityData = realTimeData[key];
              const trafficLevel = cityData?.congestion === 'EXTREME' ? 'extreme' : 
                                 cityData?.congestion === 'HIGH' ? 'heavy' : 'normal';
              
              return (
                <Marker
                  key={key}
                  position={[city.lat, city.lng]}
                  icon={createCustomIcon(
                    emergencyActive ? '#ff0000' : 
                    trafficLevel === 'extreme' ? '#dc2626' :
                    trafficLevel === 'heavy' ? '#ea580c' : '#0066cc',
                    emergencyActive,
                    trafficLevel
                  )}
                  eventHandlers={{
                    click: () => setSelectedCity(key)
                  }}
                >
                  <Popup>
                    <div className="p-3">
                      <h3 className="font-bold text-lg">{city.name}</h3>
                      <p className="text-sm text-gray-600">{city.state} • {city.population}</p>
                      {cityData && (
                        <div className="mt-2 space-y-1 text-sm">
                          <div>🚗 {cityData.vehicles} vehicles</div>
                          <div>⚡ {cityData.avgSpeed} km/h average</div>
                          <div>🚦 {cityData.congestion} congestion</div>
                          <div>🚨 {cityData.emergencyVehicles} emergency vehicles</div>
                          <div className="mt-2 text-xs bg-gray-100 p-1 rounded">
                            Status: {cityData.signalStatus}
                          </div>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Moving Vehicles */}
            {showMovingVehicles && movingVehicles.map(vehicle => (
              <AnimatedVehicleMarker
                key={vehicle.id}
                position={[vehicle.lat, vehicle.lng]}
                type={vehicle.type}
                isEmergency={vehicle.isEmergency}
                onMap={true}
              />
            ))}

            {/* Moving Vehicles */}
            {showMovingVehicles && movingVehicles.map((vehicle) => (
              <AnimatedVehicleMarker
                key={vehicle.id}
                position={[vehicle.lat, vehicle.lng]}
                type={vehicle.type}
                isEmergency={vehicle.isEmergency}
                onMap={true}
              />
            ))}

            {/* Traffic Density Heatmap */}
            {showTrafficHeatmap && Object.entries(INDIAN_CITIES).map(([key, city]) => {
              const cityData = realTimeData[key];
              const intensity = cityData ? cityData.congestion === 'EXTREME' ? 0.8 : 
                               cityData.congestion === 'HIGH' ? 0.6 : 0.3 : 0.2;
              return (
                <Circle
                  key={`heatmap_${key}`}
                  center={[city.lat, city.lng]}
                  radius={15000}
                  pathOptions={{
                    fillColor: emergencyActive ? '#ff0000' : intensity > 0.7 ? '#dc2626' : intensity > 0.5 ? '#ea580c' : '#22c55e',
                    fillOpacity: intensity * 0.4,
                    color: 'transparent',
                    weight: 0
                  }}
                />
              );
            })}

            {/* Weather Overlay */}
            {showWeather && Object.entries(INDIAN_CITIES).map(([key, city]) => {
              const weather = generateWeatherData(city);
              return (
                <Marker
                  key={`weather_${key}`}
                  position={[city.lat + 0.05, city.lng + 0.05]}
                  icon={L.divIcon({
                    className: 'weather-marker',
                    html: `
                      <div style="
                        background: rgba(0,0,0,0.8); 
                        color: white; 
                        padding: 4px 8px; 
                        border-radius: 4px; 
                        font-size: 10px;
                        border: 1px solid #0066cc;
                      ">
                        ${weather.condition} ${Math.round(weather.temperature)}°C<br/>
                        💨 ${Math.round(weather.windSpeed)}km/h
                      </div>
                    `,
                    iconSize: [80, 30],
                    iconAnchor: [40, 15]
                  })}
                />
              );
            })}

            {/* Transit Lines */}
            {showTransitLines && INDIAN_TRANSIT_LINES[selectedCity]?.map((line, index) => (
              <Polyline
                key={`transit_${index}`}
                positions={line.coordinates}
                color={line.color}
                weight={4}
                opacity={0.8}
                dashArray="10, 10"
              />
            ))}

            {/* Major Indian Highways */}
            {showHighways && Object.entries(INDIAN_HIGHWAYS).map(([key, highway]) => (
              <Polyline
                key={`highway_${key}`}
                positions={highway.coordinates}
                color={highway.color}
                weight={highway.type === 'expressway' ? 8 : 6}
                opacity={0.9}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-bold text-sm">🛣️ {highway.name}</h4>
                    <p className="text-xs">Type: {highway.type}</p>
                    <p className="text-xs text-green-600">Smart Corridor Technology Active</p>
                  </div>
                </Popup>
              </Polyline>
            ))}

            {/* AI Prediction Zones */}
            {aiMode && generateAIPredictionZones(INDIAN_CITIES[selectedCity]).map((zone, index) => (
              <Circle
                key={`ai_zone_${index}`}
                center={zone.center}
                radius={zone.radius}
                pathOptions={{
                  fillColor: '#00ffff',
                  fillOpacity: 0.1,
                  color: '#00ffff',
                  weight: 2,
                  opacity: 0.6,
                  dashArray: "5, 5"
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-bold text-sm">🤖 AI Prediction Zone</h4>
                    <p className="text-xs">Congestion Prediction: {Math.round(zone.congestionPrediction)}%</p>
                    <p className="text-xs">Optimized Signal Timing: {zone.optimizedTiming}s</p>
                    <p className="text-xs text-green-600">ML Algorithm: Active</p>
                  </div>
                </Popup>
              </Circle>
            ))}

            {/* Traffic routes */}
            {showTrafficFlow && trafficRoutes.map((route, index) => (
              <Polyline
                key={index}
                positions={route.positions}
                color={route.color}
                weight={route.weight}
                opacity={route.opacity}
                dashArray={emergencyActive ? "15, 10" : undefined}
              />
            ))}

            {/* Current city highlight */}
            <Circle
              center={mapCenter}
              radius={100000}
              pathOptions={{
                fillColor: emergencyActive ? '#ff0000' : '#0066cc',
                fillOpacity: 0.1,
                color: emergencyActive ? '#ff0000' : '#0066cc',
                opacity: 0.6,
                weight: 3
              }}
            />
        </MapContainer>
      </div>

      {/* Enhanced Legend */}
      <motion.div 
        className="absolute bottom-4 left-4 z-20 glass-effect p-3 rounded-lg max-h-96 overflow-y-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
          <span className="mr-2">🇮🇳</span>
          Advanced Traffic System
        </h4>
        <div className="space-y-1 text-xs">
          <div className="font-medium text-blue-300 mb-1">Traffic Density:</div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Light Traffic</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Moderate Traffic</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Heavy Traffic</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded animate-pulse"></div>
            <span>Emergency Route</span>
          </div>
          
          {showMovingVehicles && (
            <>
              <div className="font-medium text-green-300 mb-1 mt-2">Vehicles:</div>
              <div className="flex items-center space-x-2">
                <span>🚗</span><span>Cars</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🚌</span><span>Buses</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🚛</span><span>Trucks</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🚨</span><span>Emergency</span>
              </div>
            </>
          )}
          
          {showTransitLines && (
            <>
              <div className="font-medium text-purple-300 mb-1 mt-2">Transit Lines:</div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-1 bg-red-500"></div>
                <span>Metro Red Line</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-1 bg-blue-500"></div>
                <span>Metro Blue Line</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-1 bg-yellow-500"></div>
                <span>Metro Yellow Line</span>
              </div>
            </>
          )}
          
          {showHighways && (
            <>
              <div className="font-medium text-yellow-300 mb-1 mt-2">Smart Highways:</div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-2 bg-yellow-500 rounded"></div>
                <span>Golden Quadrilateral</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-2 bg-cyan-500 rounded"></div>
                <span>Eastern Corridor</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🛣️</span><span>Smart Technology</span>
              </div>
            </>
          )}
          
          {aiMode && (
            <>
              <div className="font-medium text-cyan-300 mb-1 mt-2">AI Features:</div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-cyan-400 rounded border-dashed"></div>
                <span>Prediction Zone</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🤖</span><span>ML Algorithm</span>
              </div>
            </>
          )}
          
          {showWeather && (
            <>
              <div className="font-medium text-blue-300 mb-1 mt-2">Weather:</div>
              <div className="flex items-center space-x-2">
                <span>🌤️</span><span>Live Conditions</span>
              </div>
            </>
          )}
          
          <div className="font-medium text-gray-300 mb-1 mt-2">Map: {MAP_LAYERS[mapLayer].name}</div>
        </div>
      </motion.div>

      {/* Real-Time Stats Panel */}
      <motion.div 
        className="absolute top-4 right-4 z-20 glass-effect p-3 rounded-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
          <span className="mr-2">📊</span>
          Live Analytics
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-300">Current City:</span>
            <span className="text-white font-medium">{INDIAN_CITIES[selectedCity].name}</span>
          </div>
          {realTimeData[selectedCity] && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-300">Vehicles:</span>
                <span className="text-green-400">{realTimeData[selectedCity].vehicles}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Avg Speed:</span>
                <span className="text-blue-400">{realTimeData[selectedCity].avgSpeed} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Congestion:</span>
                <span className={`font-medium ${
                  realTimeData[selectedCity].congestion === 'EXTREME' ? 'text-red-400' :
                  realTimeData[selectedCity].congestion === 'HIGH' ? 'text-orange-400' :
                  realTimeData[selectedCity].congestion === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {realTimeData[selectedCity].congestion}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Emergency:</span>
                <span className="text-red-400">{realTimeData[selectedCity].emergencyVehicles} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Signal Status:</span>
                <span className="text-cyan-400">{realTimeData[selectedCity].signalStatus}</span>
              </div>
            </>
          )}
          {aiMode && (
            <>
              <hr className="border-gray-600 my-2"/>
              <div className="text-cyan-300 font-medium">AI Optimization:</div>
              <div className="flex justify-between">
                <span className="text-gray-300">ML Predictions:</span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Signal Timing:</span>
                <span className="text-yellow-400">Optimized</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Efficiency:</span>
                <span className="text-green-400">+{Math.floor(Math.random() * 30) + 15}%</span>
              </div>
            </>
          )}
          {showWeather && (
            <>
              <hr className="border-gray-600 my-2"/>
              <div className="text-blue-300 font-medium">Weather Impact:</div>
              {(() => {
                const weather = generateWeatherData(INDIAN_CITIES[selectedCity]);
                return (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Condition:</span>
                      <span className="text-white">{weather.condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Visibility:</span>
                      <span className="text-green-400">{Math.round(weather.visibility)}km</span>
                    </div>
                  </>
                );
              })()}
            </>
          )}
        </div>
      </motion.div>

      {/* Revert Button */}
      <motion.div 
        className="absolute bottom-4 right-4 z-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <button
          onClick={() => {
            if (window.confirm('This will revert to the original traffic map. Continue?')) {
              // This will be handled by the parent component
              window.dispatchEvent(new CustomEvent('revert-to-original'));
            }
          }}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-all flex items-center space-x-2 border border-red-500/30"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Revert</span>
        </button>
      </motion.div>
    </div>
  );
};

export default IndianLiveTrafficMap;
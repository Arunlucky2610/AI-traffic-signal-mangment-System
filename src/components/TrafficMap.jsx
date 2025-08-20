
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  Car, 
  AlertTriangle,
  Radio,
  Zap,
  Eye,
  Route
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const TrafficMap = ({ emergencyActive, isMonitoring, signals = [] }) => {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState([]);
  const [intersections, setIntersections] = useState([]);
  const [emergencyRoute, setEmergencyRoute] = useState([]);

  useEffect(() => {
    const initialIntersections = [
      { id: 1, x: 20, y: 30, status: 'normal', name: 'Main St & 1st Ave' },
      { id: 2, x: 40, y: 30, status: 'normal', name: 'Main St & 2nd Ave' },
      { id: 3, x: 60, y: 30, status: 'normal', name: 'Main St & 3rd Ave' },
      { id: 4, x: 80, y: 30, status: 'normal', name: 'Main St & 4th Ave' },
      { id: 5, x: 20, y: 50, status: 'normal', name: 'Oak St & 1st Ave' },
      { id: 6, x: 40, y: 50, status: 'normal', name: 'Oak St & 2nd Ave' },
      { id: 7, x: 60, y: 50, status: 'normal', name: 'Oak St & 3rd Ave' },
      { id: 8, x: 80, y: 50, status: 'normal', name: 'Oak St & 4th Ave' },
      { id: 9, x: 20, y: 70, status: 'normal', name: 'Pine St & 1st Ave' },
      { id: 10, x: 40, y: 70, status: 'normal', name: 'Pine St & 2nd Ave' },
      { id: 11, x: 60, y: 70, status: 'normal', name: 'Pine St & 3rd Ave' },
      { id: 12, x: 80, y: 70, status: 'normal', name: 'Pine St & 4th Ave' }
    ];
    setIntersections(initialIntersections);
  }, []);

  useEffect(() => {
    let interval;
    if (isMonitoring) {
      interval = setInterval(() => {
        setVehicles(prev => {
          const newVehicles = [];
          for (let i = 0; i < 8; i++) {
            const x = Math.max(5, Math.min(95, Math.random() * 90 + 5));
            const y = Math.max(10, Math.min(90, Math.random() * 80 + 10));
            newVehicles.push({
              id: `regular-${i}`,
              x,
              y,
              type: 'regular',
              speed: Math.random() * 3 + 1
            });
          }
          if (emergencyActive) {
            // Emergency vehicle can move freely (or clamp if needed)
            const x = Math.max(5, Math.min(95, 15 + (Date.now() / 100) % 70));
            const y = 30; // already within bounds
            newVehicles.push({
              id: 'emergency-1',
              x,
              y,
              type: 'emergency',
              speed: 5
            });
          }
          return newVehicles;
        });
      }, 1000);
    } else {
      setVehicles([]);
    }

    return () => clearInterval(interval);
  }, [emergencyActive, isMonitoring]);

  useEffect(() => {
    if (emergencyActive) {
      setIntersections(prev => prev.map(intersection => {
        if ([1, 2, 3, 4].includes(intersection.id)) {
          return { ...intersection, status: 'emergency' };
        }
        return { ...intersection, status: 'normal' };
      }));
      
      setEmergencyRoute([
        { x: 15, y: 30 },
        { x: 85, y: 30 }
      ]);
    } else {
      setIntersections(prev => prev.map(intersection => ({
        ...intersection,
        status: 'normal'
      })));
      setEmergencyRoute([]);
    }
  }, [emergencyActive]);

  const getIntersectionColor = (status) => {
    switch (status) {
      case 'emergency': return 'bg-red-500 border-red-400 shadow-lg shadow-red-500/50';
      case 'warning': return 'bg-yellow-500 border-yellow-400 shadow-lg shadow-yellow-500/50';
      default: return 'bg-gray-600 border-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Live Traffic Map</h2>
          <p className="text-gray-300 mt-1">Real-time vehicle tracking and intersection monitoring</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
          >
            <Eye className="w-4 h-4 mr-2" />
            Toggle View
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
          >
            <Route className="w-4 h-4 mr-2" />
            Route Planning
          </Button>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <div className="map-container h-96 relative">
          <svg className="absolute inset-0 w-full h-full">
            <line x1="10%" y1="30%" x2="90%" y2="30%" stroke="#4B5563" strokeWidth="4" />
            <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#4B5563" strokeWidth="4" />
            <line x1="10%" y1="70%" x2="90%" y2="70%" stroke="#4B5563" strokeWidth="4" />
            
            <line x1="20%" y1="20%" x2="20%" y2="80%" stroke="#4B5563" strokeWidth="4" />
            <line x1="40%" y1="20%" x2="40%" y2="80%" stroke="#4B5563" strokeWidth="4" />
            <line x1="60%" y1="20%" x2="60%" y2="80%" stroke="#4B5563" strokeWidth="4" />
            <line x1="80%" y1="20%" x2="80%" y2="80%" stroke="#4B5563" strokeWidth="4" />
            
            {emergencyActive && (
              <motion.line
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                x1="10%" y1="30%" x2="90%" y2="30%" 
                stroke="#EF4444" 
                strokeWidth="8" 
                strokeOpacity="0.3"
                className="emergency-pulse"
              />
            )}
          </svg>

          {intersections.map((intersection) => (
            <motion.div
              key={intersection.id}
              className={`intersection-node ${getIntersectionColor(intersection.status)}`}
              style={{ left: `${intersection.x}%`, top: `${intersection.y}%`, position: 'absolute', width: '32px', height: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              whileHover={{ scale: 1.2 }}
              title={intersection.name}
            >
              {/* Find the signal for this intersection by name or id */}
              {(() => {
                const signal = signals.find(s => s.name === intersection.name || s.id === intersection.id);
                const status = signal ? signal.status : 'red';
                return (
                  <svg width="18" height="28" viewBox="0 0 18 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="14" height="24" rx="4" fill="#222" stroke="#555" strokeWidth="2" />
                    {/* Red light */}
                    <circle cx="9" cy="8" r="4" fill={status === 'red' ? '#f87171' : '#222'} stroke="#fff" strokeWidth="1" />
                    {/* Yellow light */}
                    <circle cx="9" cy="14" r="4" fill={status === 'yellow' ? '#fde047' : '#222'} stroke="#fff" strokeWidth="1" />
                    {/* Green light */}
                    <circle cx="9" cy="20" r="4" fill={status === 'green' ? '#4ade80' : '#222'} stroke="#fff" strokeWidth="1" />
                  </svg>
                );
              })()}
              <Radio className="w-3 h-3 text-white mt-1" />
            </motion.div>
          ))}

          {vehicles.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              className={`vehicle-marker ${vehicle.type === 'emergency' ? 'emergency-vehicle' : 'regular-vehicle'}`}
              style={{ left: `${vehicle.x}%`, top: `${vehicle.y}%`, position: 'absolute', width: '24px', height: '24px' }}
              animate={{ 
                x: vehicle.type === 'emergency' ? [0, 10, 0] : 0,
                y: vehicle.type === 'emergency' ? [0, 2, 0] : 0
              }}
              transition={{ 
                duration: 2, 
                repeat: vehicle.type === 'emergency' ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              {vehicle.type === 'emergency' ? (
                // Ambulance toy SVG
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="8" width="20" height="8" rx="3" fill="#fff" stroke="#EF4444" strokeWidth="2" />
                  <rect x="7" y="6" width="10" height="4" rx="2" fill="#EF4444" stroke="#fff" strokeWidth="1" />
                  <rect x="10.5" y="3" width="3" height="2" rx="1" fill="#3B82F6" />
                  <rect x="13" y="11" width="3" height="2" rx="1" fill="#EF4444" />
                  <rect x="8" y="11" width="3" height="2" rx="1" fill="#EF4444" />
                  <rect x="11" y="13" width="2" height="2" rx="1" fill="#3B82F6" />
                  <rect x="11" y="9" width="2" height="2" rx="1" fill="#3B82F6" />
                  <circle cx="7" cy="18" r="2" fill="#fff" stroke="#EF4444" strokeWidth="1" />
                  <circle cx="17" cy="18" r="2" fill="#fff" stroke="#EF4444" strokeWidth="1" />
                  <rect x="4" y="10" width="2" height="2" rx="1" fill="#3B82F6" />
                  <rect x="18" y="10" width="2" height="2" rx="1" fill="#3B82F6" />
                  <rect x="11" y="11" width="2" height="2" rx="1" fill="#fff" />
                  <rect x="12" y="12" width="1" height="1" rx="0.5" fill="#EF4444" />
                  <rect x="11" y="12" width="1" height="1" rx="0.5" fill="#EF4444" />
                  <rect x="12" y="11" width="1" height="1" rx="0.5" fill="#EF4444" />
                  <rect x="11" y="11" width="1" height="1" rx="0.5" fill="#EF4444" />
                </svg>
              ) : (
                // Regular vehicle toy SVG
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="10" width="18" height="6" rx="3" fill="#3B82F6" stroke="#fff" strokeWidth="1.5" />
                  <rect x="8" y="8" width="8" height="4" rx="2" fill="#fff" stroke="#3B82F6" strokeWidth="1" />
                  <circle cx="8" cy="18" r="2" fill="#fff" stroke="#3B82F6" strokeWidth="1" />
                  <circle cx="16" cy="18" r="2" fill="#fff" stroke="#3B82F6" strokeWidth="1" />
                </svg>
              )}
            </motion.div>
          ))}

          <div className="absolute bottom-4 left-4 glass-effect rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-semibold text-white mb-2">Legend</h4>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full emergency-vehicle"></div>
              <span className="text-xs text-gray-300">Emergency Vehicle</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-xs text-gray-300">Regular Vehicle</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-300">Emergency Signal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
              <span className="text-xs text-gray-300">Normal Signal</span>
            </div>
          </div>

          {emergencyActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 right-4 glass-effect rounded-lg p-4 border border-red-500/50"
            >
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-semibold text-red-400">Emergency Active</span>
              </div>
              <div className="text-xs text-gray-300 space-y-1">
                <div>Route: Main Street Corridor</div>
                <div>ETA: 2 minutes</div>
                <div>Signals: 4 optimized</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Traffic Flow</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Main Street</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-xs text-green-400">Good</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Oak Street</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-xs text-yellow-400">Moderate</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Pine Street</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-xs text-green-400">Excellent</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Active Signals</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Intersection 1</span>
              <div className="flex space-x-1">
                <div className="traffic-light red"></div>
                <div className="traffic-light"></div>
                <div className="traffic-light"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Intersection 2</span>
              <div className="flex space-x-1">
                <div className="traffic-light"></div>
                <div className="traffic-light yellow"></div>
                <div className="traffic-light"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Intersection 3</span>
              <div className="flex space-x-1">
                <div className="traffic-light"></div>
                <div className="traffic-light"></div>
                <div className="traffic-light green"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Detection Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">Vehicles Tracked</span>
              <span className="text-sm font-semibold text-white">{vehicles.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">Emergency Active</span>
              <span className={`text-sm font-semibold ${emergencyActive ? 'text-red-400' : 'text-gray-400'}`}>
                {emergencyActive ? 'YES' : 'NO'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">AI Confidence</span>
              <span className="text-sm font-semibold text-green-400">98.7%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">Response Time</span>
              <span className="text-sm font-semibold text-blue-400">2.3s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficMap;

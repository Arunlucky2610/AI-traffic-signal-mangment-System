import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Truck, 
  Bike, 
  Ambulance,
  Play,
  Pause,
  RotateCcw,
  Settings,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const SmartTrafficSimulation = ({ emergencyActive, onVehicleCountChange }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [vehicleStats, setVehicleStats] = useState({
    cars: 0,
    trucks: 0,
    bikes: 0,
    emergency: 0,
    totalWaitTime: 0,
    averageSpeed: 0
  });
  
  const simulationRef = useRef(null);
  const animationRef = useRef();

  // Vehicle types with different behaviors
  const vehicleTypes = [
    { type: 'car', icon: Car, color: '#60a5fa', speed: 1, size: 20, priority: 1 },
    { type: 'truck', icon: Truck, color: '#fbbf24', speed: 0.7, size: 28, priority: 1 },
    { type: 'bike', icon: Bike, color: '#34d399', speed: 1.5, size: 16, priority: 2 },
    { type: 'emergency', icon: Ambulance, color: '#ef4444', speed: 2, size: 24, priority: 10 }
  ];

  // Traffic lanes configuration
  const lanes = [
    // North-South lanes
    { id: 'ns1', direction: 'south', x: 180, y: 0, width: 40, height: 400 },
    { id: 'ns2', direction: 'north', x: 240, y: 0, width: 40, height: 400 },
    // East-West lanes
    { id: 'ew1', direction: 'east', x: 0, y: 180, width: 400, height: 40 },
    { id: 'ew2', direction: 'west', x: 0, y: 240, width: 400, height: 40 }
  ];

  // Generate new vehicle
  const generateVehicle = () => {
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    const vehicleType = emergencyActive && Math.random() < 0.3 
      ? vehicleTypes[3] // Emergency vehicle
      : vehicleTypes[Math.floor(Math.random() * 3)]; // Regular vehicles

    let startX, startY, targetX, targetY;

    switch (lane.direction) {
      case 'south':
        startX = lane.x + lane.width / 2;
        startY = -vehicleType.size;
        targetX = startX;
        targetY = 400 + vehicleType.size;
        break;
      case 'north':
        startX = lane.x + lane.width / 2;
        startY = 400 + vehicleType.size;
        targetX = startX;
        targetY = -vehicleType.size;
        break;
      case 'east':
        startX = -vehicleType.size;
        startY = lane.y + lane.height / 2;
        targetX = 400 + vehicleType.size;
        targetY = startY;
        break;
      case 'west':
        startX = 400 + vehicleType.size;
        startY = lane.y + lane.height / 2;
        targetX = -vehicleType.size;
        targetY = startY;
        break;
    }

    return {
      id: Date.now() + Math.random(),
      type: vehicleType.type,
      icon: vehicleType.icon,
      color: vehicleType.color,
      size: vehicleType.size,
      speed: vehicleType.speed,
      priority: vehicleType.priority,
      x: startX,
      y: startY,
      targetX,
      targetY,
      lane: lane.id,
      direction: lane.direction,
      waitTime: 0,
      isWaiting: false,
      distanceTraveled: 0
    };
  };

  // Update vehicle positions
  const updateVehicles = () => {
    setVehicles(prevVehicles => {
      const updated = prevVehicles.map(vehicle => {
        const dx = vehicle.targetX - vehicle.x;
        const dy = vehicle.targetY - vehicle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5) {
          return null; // Remove vehicle
        }

        // Check for intersection and traffic light logic
        const inIntersection = (
          vehicle.x > 160 && vehicle.x < 280 &&
          vehicle.y > 160 && vehicle.y < 280
        );

        let actualSpeed = vehicle.speed * simulationSpeed;

        // Emergency vehicles get priority
        if (emergencyActive && vehicle.type === 'emergency') {
          actualSpeed *= 1.5;
        } else if (inIntersection && !emergencyActive) {
          // Simulate traffic light delay
          if (Math.random() < 0.3) {
            actualSpeed *= 0.3;
            vehicle.waitTime += 1;
            vehicle.isWaiting = true;
          } else {
            vehicle.isWaiting = false;
          }
        }

        const moveX = (dx / distance) * actualSpeed;
        const moveY = (dy / distance) * actualSpeed;

        return {
          ...vehicle,
          x: vehicle.x + moveX,
          y: vehicle.y + moveY,
          distanceTraveled: vehicle.distanceTraveled + Math.sqrt(moveX * moveX + moveY * moveY)
        };
      }).filter(Boolean);

      // Add new vehicles randomly
      if (Math.random() < 0.02 * simulationSpeed && updated.length < 20) {
        updated.push(generateVehicle());
      }

      return updated;
    });
  };

  // Calculate statistics
  useEffect(() => {
    const stats = vehicles.reduce((acc, vehicle) => {
      acc[vehicle.type === 'emergency' ? 'emergency' : vehicle.type]++;
      acc.totalWaitTime += vehicle.waitTime;
      return acc;
    }, { cars: 0, trucks: 0, bikes: 0, emergency: 0, totalWaitTime: 0 });

    stats.averageSpeed = vehicles.length > 0 
      ? vehicles.reduce((sum, v) => sum + v.speed, 0) / vehicles.length 
      : 0;

    setVehicleStats(stats);
    onVehicleCountChange?.(vehicles.length);
  }, [vehicles, onVehicleCountChange]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      if (isPlaying) {
        updateVehicles();
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, simulationSpeed, emergencyActive]);

  const resetSimulation = () => {
    setVehicles([]);
    setVehicleStats({ cars: 0, trucks: 0, bikes: 0, emergency: 0, totalWaitTime: 0, averageSpeed: 0 });
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            variant={isPlaying ? "destructive" : "default"}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Play
              </>
            )}
          </Button>
          
          <Button onClick={resetSimulation} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Speed:</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={simulationSpeed}
              onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
              className="w-20"
            />
            <span className="text-white font-mono">{simulationSpeed}x</span>
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-gray-400">Active:</span>
            <span className="text-white font-semibold">{vehicles.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400">Avg Speed:</span>
            <span className="text-white font-semibold">{vehicleStats.averageSpeed.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Simulation Canvas */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="relative w-full" style={{ height: '400px' }}>
          <svg
            ref={simulationRef}
            width="400"
            height="400"
            className="border border-gray-600 rounded-lg bg-gray-900"
            viewBox="0 0 400 400"
          >
            {/* Road lanes */}
            {lanes.map(lane => (
              <rect
                key={lane.id}
                x={lane.x}
                y={lane.y}
                width={lane.width}
                height={lane.height}
                fill="#374151"
                stroke="#4b5563"
                strokeWidth="1"
              />
            ))}

            {/* Intersection */}
            <rect
              x="160"
              y="160"
              width="120"
              height="120"
              fill={emergencyActive ? "#7f1d1d" : "#1f2937"}
              stroke="#4b5563"
              strokeWidth="2"
            />

            {/* Traffic lights */}
            <circle cx="170" cy="170" r="8" fill={emergencyActive ? "#ef4444" : "#22c55e"} />
            <circle cx="270" cy="170" r="8" fill={emergencyActive ? "#ef4444" : "#22c55e"} />
            <circle cx="170" cy="270" r="8" fill={emergencyActive ? "#ef4444" : "#22c55e"} />
            <circle cx="270" cy="270" r="8" fill={emergencyActive ? "#ef4444" : "#22c55e"} />

            {/* Vehicles */}
            <AnimatePresence>
              {vehicles.map(vehicle => {
                const IconComponent = vehicle.icon;
                return (
                  <motion.g
                    key={vehicle.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: vehicle.isWaiting ? 0.8 : 1,
                      x: vehicle.x,
                      y: vehicle.y
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r={vehicle.size / 2}
                      fill={vehicle.color}
                      opacity={vehicle.type === 'emergency' ? 0.9 : 0.7}
                      stroke={vehicle.isWaiting ? "#fbbf24" : "transparent"}
                      strokeWidth="2"
                    />
                    {vehicle.type === 'emergency' && (
                      <circle
                        cx="0"
                        cy="0"
                        r={vehicle.size / 2 + 3}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                        opacity="0.6"
                      >
                        <animate
                          attributeName="r"
                          values={`${vehicle.size / 2 + 3};${vehicle.size / 2 + 8};${vehicle.size / 2 + 3}`}
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </motion.g>
                );
              })}
            </AnimatePresence>

            {/* Emergency indicator */}
            {emergencyActive && (
              <text
                x="220"
                y="230"
                textAnchor="middle"
                fill="#ef4444"
                fontSize="14"
                fontWeight="bold"
              >
                EMERGENCY MODE
              </text>
            )}
          </svg>
        </div>
      </div>

      {/* Vehicle Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Car className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-semibold">Cars</span>
          </div>
          <span className="text-2xl font-bold text-white">{vehicleStats.cars}</span>
        </div>

        <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Trucks</span>
          </div>
          <span className="text-2xl font-bold text-white">{vehicleStats.trucks}</span>
        </div>

        <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bike className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-semibold">Bikes</span>
          </div>
          <span className="text-2xl font-bold text-white">{vehicleStats.bikes}</span>
        </div>

        <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Ambulance className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-semibold">Emergency</span>
          </div>
          <span className="text-2xl font-bold text-white">{vehicleStats.emergency}</span>
        </div>
      </div>
    </div>
  );
};

export default SmartTrafficSimulation;

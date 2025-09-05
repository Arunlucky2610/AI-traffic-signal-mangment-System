import React, { useState, useEffect } from 'react';
import { Camera, Play, Pause, AlertTriangle, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CameraFeed = ({ onEmergencyDetected }) => {
  const [isActive, setIsActive] = useState(true);
  const [detectedVehicles, setDetectedVehicles] = useState([]);

  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      // Simulate emergency vehicle detection
      if (Math.random() < 0.15) {
        const emergency = {
          id: Date.now(),
          type: 'ambulance',
          confidence: Math.floor(Math.random() * 20) + 80,
          direction: ['north', 'south', 'east', 'west'][Math.floor(Math.random() * 4)]
        };
        onEmergencyDetected?.(emergency);
        setDetectedVehicles(prev => [...prev.slice(-4), emergency]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive, onEmergencyDetected]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Live Camera Feed
        </h3>
        <Button
          onClick={() => setIsActive(!isActive)}
          variant={isActive ? "default" : "outline"}
          size="sm"
        >
          {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>

      {/* Simulated Camera View */}
      <div className="relative bg-gray-900 rounded-lg h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
          {/* Road simulation */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-700">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-yellow-400 border-dashed"></div>
          </div>
          
          {/* Vehicle indicators */}
          {detectedVehicles.map((vehicle, idx) => (
            <div
              key={vehicle.id}
              className={`absolute bottom-16 animate-pulse ${
                vehicle.type === 'ambulance' ? 'text-red-500' : 'text-blue-500'
              }`}
              style={{ left: `${20 + idx * 15}%` }}
            >
              <Car className="h-6 w-6" />
            </div>
          ))}
        </div>
        
        {/* Detection overlay */}
        <div className="absolute top-2 left-2 right-2">
          <div className="text-green-400 text-xs font-mono">
            {isActive ? 'LIVE • AI DETECTION ACTIVE' : 'PAUSED'}
          </div>
        </div>
      </div>

      {/* Detection Results */}
      <div className="mt-4 space-y-2">
        {detectedVehicles.slice(-3).map((vehicle) => (
          <div key={vehicle.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Emergency Vehicle Detected</span>
            </div>
            <span className="text-xs text-gray-600">{vehicle.confidence}% confidence</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CameraFeed;

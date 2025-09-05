import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSnow, 
  Wind, 
  Thermometer,
  Droplets,
  Eye,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const WeatherAdaptiveControl = ({ onWeatherChange }) => {
  const [weatherData, setWeatherData] = useState({
    temperature: 22,
    humidity: 65,
    windSpeed: 12,
    visibility: 95,
    condition: 'clear',
    precipitation: 0,
    roadConditions: 'dry'
  });

  const [signalAdjustments, setSignalAdjustments] = useState({
    yellowTime: 0,
    redTime: 0,
    pedestrianTime: 0,
    emergencyResponse: 0
  });

  const [isAdaptiveMode, setIsAdaptiveMode] = useState(true);
  const { toast } = useToast();

  const weatherConditions = [
    { 
      id: 'clear', 
      name: 'Clear', 
      icon: Sun, 
      color: '#fbbf24',
      adjustments: { yellowTime: 0, redTime: 0, pedestrianTime: 0, emergencyResponse: 0 }
    },
    { 
      id: 'cloudy', 
      name: 'Cloudy', 
      icon: Cloud, 
      color: '#6b7280',
      adjustments: { yellowTime: 0.5, redTime: 0, pedestrianTime: 2, emergencyResponse: 5 }
    },
    { 
      id: 'rain', 
      name: 'Rain', 
      icon: CloudRain, 
      color: '#3b82f6',
      adjustments: { yellowTime: 1.5, redTime: 2, pedestrianTime: 5, emergencyResponse: 15 }
    },
    { 
      id: 'heavy_rain', 
      name: 'Heavy Rain', 
      icon: CloudRain, 
      color: '#1d4ed8',
      adjustments: { yellowTime: 3, redTime: 5, pedestrianTime: 8, emergencyResponse: 25 }
    },
    { 
      id: 'snow', 
      name: 'Snow', 
      icon: CloudSnow, 
      color: '#e5e7eb',
      adjustments: { yellowTime: 4, redTime: 8, pedestrianTime: 12, emergencyResponse: 30 }
    }
  ];

  // Simulate weather data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate changing weather conditions
      const conditions = ['clear', 'cloudy', 'rain', 'heavy_rain', 'snow'];
      const newCondition = Math.random() < 0.1 
        ? conditions[Math.floor(Math.random() * conditions.length)]
        : weatherData.condition;

      const newWeatherData = {
        temperature: 15 + Math.random() * 20,
        humidity: 40 + Math.random() * 40,
        windSpeed: Math.random() * 25,
        visibility: newCondition === 'clear' ? 95 + Math.random() * 5 :
                   newCondition === 'rain' ? 70 + Math.random() * 20 :
                   newCondition === 'heavy_rain' ? 40 + Math.random() * 30 :
                   newCondition === 'snow' ? 30 + Math.random() * 40 : 80 + Math.random() * 15,
        condition: newCondition,
        precipitation: newCondition.includes('rain') ? Math.random() * 10 :
                      newCondition === 'snow' ? Math.random() * 5 : 0,
        roadConditions: newCondition === 'clear' ? 'dry' :
                       newCondition.includes('rain') ? 'wet' :
                       newCondition === 'snow' ? 'icy' : 'damp'
      };

      setWeatherData(newWeatherData);
      onWeatherChange?.(newWeatherData);

      // Calculate signal adjustments based on weather
      if (isAdaptiveMode) {
        const condition = weatherConditions.find(w => w.id === newCondition);
        if (condition) {
          setSignalAdjustments(condition.adjustments);
          
          // Alert for severe weather
          if (newCondition === 'heavy_rain' || newCondition === 'snow') {
            toast({
              title: `⚠️ Severe Weather Alert`,
              description: `${condition.name} detected. Signal timings adjusted automatically.`,
              variant: "destructive"
            });
          }
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [weatherData.condition, isAdaptiveMode, onWeatherChange, toast]);

  const getCurrentWeatherIcon = () => {
    const condition = weatherConditions.find(w => w.id === weatherData.condition);
    return condition ? condition.icon : Sun;
  };

  const getCurrentWeatherColor = () => {
    const condition = weatherConditions.find(w => w.id === weatherData.condition);
    return condition ? condition.color : '#fbbf24';
  };

  const getRoadConditionColor = () => {
    switch (weatherData.roadConditions) {
      case 'dry': return '#22c55e';
      case 'damp': return '#fbbf24';
      case 'wet': return '#3b82f6';
      case 'icy': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getVisibilityStatus = () => {
    if (weatherData.visibility >= 90) return { status: 'Excellent', color: '#22c55e' };
    if (weatherData.visibility >= 70) return { status: 'Good', color: '#fbbf24' };
    if (weatherData.visibility >= 50) return { status: 'Poor', color: '#f97316' };
    return { status: 'Critical', color: '#ef4444' };
  };

  const WeatherIcon = getCurrentWeatherIcon();
  const visibilityStatus = getVisibilityStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <WeatherIcon className="w-6 h-6" style={{ color: getCurrentWeatherColor() }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Weather-Adaptive Control</h2>
            <p className="text-gray-400">Automatic signal adjustment based on weather conditions</p>
          </div>
        </div>
        <Button
          onClick={() => setIsAdaptiveMode(!isAdaptiveMode)}
          variant={isAdaptiveMode ? "default" : "outline"}
          className={isAdaptiveMode ? "bg-green-600 hover:bg-green-700" : ""}
        >
          <Settings className="w-4 h-4 mr-2" />
          {isAdaptiveMode ? 'Adaptive ON' : 'Adaptive OFF'}
        </Button>
      </div>

      {/* Current Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Overview */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Current Conditions</h3>
            <div className="flex items-center gap-2">
              <WeatherIcon className="w-8 h-8" style={{ color: getCurrentWeatherColor() }} />
              <span className="text-lg font-semibold text-white capitalize">
                {weatherData.condition.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="w-5 h-5 text-orange-400" />
                <span className="text-gray-400">Temperature</span>
              </div>
              <span className="text-2xl font-bold text-white">
                {weatherData.temperature.toFixed(1)}°C
              </span>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">Humidity</span>
              </div>
              <span className="text-2xl font-bold text-white">
                {weatherData.humidity.toFixed(0)}%
              </span>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Wind Speed</span>
              </div>
              <span className="text-2xl font-bold text-white">
                {weatherData.windSpeed.toFixed(1)} km/h
              </span>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5" style={{ color: visibilityStatus.color }} />
                <span className="text-gray-400">Visibility</span>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-bold text-white">
                  {weatherData.visibility.toFixed(0)}%
                </span>
                <div className="text-sm" style={{ color: visibilityStatus.color }}>
                  {visibilityStatus.status}
                </div>
              </div>
            </div>
          </div>

          {weatherData.precipitation > 0 && (
            <div className="mt-4 bg-blue-900/30 border border-blue-500 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-semibold">
                  Precipitation: {weatherData.precipitation.toFixed(1)}mm/h
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Road Conditions & Adjustments */}
        <div className="space-y-4">
          {/* Road Conditions */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-bold text-white mb-4">Road Conditions</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Current Status:</span>
              <span 
                className="text-lg font-bold uppercase"
                style={{ color: getRoadConditionColor() }}
              >
                {weatherData.roadConditions}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mt-3">
              <div 
                className="h-3 rounded-full transition-all duration-300"
                style={{ 
                  backgroundColor: getRoadConditionColor(),
                  width: `${weatherData.roadConditions === 'dry' ? 100 : 
                          weatherData.roadConditions === 'damp' ? 75 :
                          weatherData.roadConditions === 'wet' ? 50 : 25}%`
                }}
              ></div>
            </div>
          </motion.div>

          {/* Signal Adjustments */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Signal Adjustments</h3>
              {!isAdaptiveMode && (
                <span className="text-orange-400 text-sm">Manual Mode</span>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Yellow Light Extension:</span>
                <span className="text-yellow-400 font-semibold">
                  +{signalAdjustments.yellowTime.toFixed(1)}s
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Red Light Extension:</span>
                <span className="text-red-400 font-semibold">
                  +{signalAdjustments.redTime.toFixed(1)}s
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Pedestrian Time:</span>
                <span className="text-blue-400 font-semibold">
                  +{signalAdjustments.pedestrianTime.toFixed(1)}s
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Emergency Response:</span>
                <span className="text-purple-400 font-semibold">
                  +{signalAdjustments.emergencyResponse.toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Weather Impact Analysis */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Weather Impact Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-gray-300 mb-3">Traffic Impact</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Speed Reduction:</span>
                <span className="text-orange-400">
                  {weatherData.condition === 'clear' ? '0%' :
                   weatherData.condition === 'rain' ? '15%' :
                   weatherData.condition === 'heavy_rain' ? '30%' :
                   weatherData.condition === 'snow' ? '45%' : '10%'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Accident Risk:</span>
                <span className={
                  weatherData.condition === 'clear' ? 'text-green-400' :
                  weatherData.condition.includes('rain') ? 'text-orange-400' :
                  weatherData.condition === 'snow' ? 'text-red-400' : 'text-yellow-400'
                }>
                  {weatherData.condition === 'clear' ? 'Low' :
                   weatherData.condition === 'rain' ? 'Medium' :
                   weatherData.condition === 'heavy_rain' ? 'High' :
                   weatherData.condition === 'snow' ? 'Very High' : 'Low-Medium'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Stopping Distance:</span>
                <span className="text-blue-400">
                  {weatherData.condition === 'clear' ? '+0%' :
                   weatherData.condition === 'rain' ? '+25%' :
                   weatherData.condition === 'heavy_rain' ? '+50%' :
                   weatherData.condition === 'snow' ? '+100%' : '+10%'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-300 mb-3">System Response</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {isAdaptiveMode ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                ) : (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
                <span className="text-gray-400">
                  Adaptive Control: {isAdaptiveMode ? 'Active' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-400">Weather Monitoring: Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-400">Signal Optimization: Real-time</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-300 mb-3">Recommendations</h4>
            <div className="space-y-2 text-sm text-gray-400">
              {weatherData.condition === 'clear' && (
                <p>• Standard signal timing optimal</p>
              )}
              {weatherData.condition === 'rain' && (
                <>
                  <p>• Extended yellow phases active</p>
                  <p>• Increased pedestrian crossing time</p>
                </>
              )}
              {weatherData.condition === 'heavy_rain' && (
                <>
                  <p>• Severe weather protocols engaged</p>
                  <p>• Emergency response time increased</p>
                  <p>• Consider alternate routes</p>
                </>
              )}
              {weatherData.condition === 'snow' && (
                <>
                  <p>• Maximum safety protocols active</p>
                  <p>• All signal extensions applied</p>
                  <p>• Monitor for ice formation</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Severe Weather Alert */}
      {(weatherData.condition === 'heavy_rain' || weatherData.condition === 'snow') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/30 border border-red-500 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <div>
              <h4 className="text-red-400 font-semibold">Severe Weather Alert</h4>
              <p className="text-gray-300 text-sm">
                {weatherData.condition === 'heavy_rain' 
                  ? 'Heavy rainfall detected. Reduced visibility and increased stopping distances.' 
                  : 'Snow conditions detected. Extreme caution advised, icy roads possible.'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WeatherAdaptiveControl;

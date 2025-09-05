import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer } from 'lucide-react';

const WeatherIntegration = ({ onWeatherChange }) => {
  const [weather, setWeather] = useState({
    condition: 'clear',
    temperature: 22,
    humidity: 65,
    windSpeed: 8,
    visibility: 10
  });

  const weatherConditions = [
    { id: 'clear', icon: Sun, label: 'Clear', signalDelay: 0 },
    { id: 'cloudy', icon: Cloud, label: 'Cloudy', signalDelay: 2 },
    { id: 'rain', icon: CloudRain, label: 'Rain', signalDelay: 5 },
    { id: 'fog', icon: Wind, label: 'Fog', signalDelay: 8 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const conditions = ['clear', 'cloudy', 'rain', 'fog'];
      const newCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const newWeather = {
        condition: newCondition,
        temperature: Math.floor(Math.random() * 20) + 15,
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 15) + 5,
        visibility: newCondition === 'fog' ? Math.floor(Math.random() * 3) + 1 : 
                   newCondition === 'rain' ? Math.floor(Math.random() * 5) + 3 : 10
      };
      setWeather(newWeather);
      onWeatherChange?.(newWeather);
    }, 10000);

    return () => clearInterval(interval);
  }, [onWeatherChange]);

  const currentCondition = weatherConditions.find(w => w.id === weather.condition);
  const IconComponent = currentCondition?.icon || Sun;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <IconComponent className="h-5 w-5" />
        Weather Conditions
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <IconComponent className="h-8 w-8 mx-auto mb-2 text-blue-600" />
          <div className="text-sm font-medium">{currentCondition?.label}</div>
          <div className="text-xs text-gray-600">
            +{currentCondition?.signalDelay}s delay
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-orange-500" />
            <span className="text-sm">{weather.temperature}°C</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{weather.windSpeed} km/h</span>
          </div>
          <div className="text-xs text-gray-600">
            Visibility: {weather.visibility}km
          </div>
        </div>
      </div>

      {weather.condition !== 'clear' && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-sm font-medium text-yellow-800">
            Weather Alert: Signal timing adjusted for {currentCondition?.label.toLowerCase()} conditions
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherIntegration;

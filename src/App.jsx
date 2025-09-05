
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  AlertTriangle, 
  Car, 
  MapPin, 
  Settings, 
  Shield, 
  Navigation,
  Radio,
  Eye,
  BarChart3,
  Camera,
  Brain,
  Cloud,
  Zap
} from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import Dashboard from '@/components/Dashboard.jsx';
import TrafficMap from '@/components/TrafficMap.jsx';
import LiveGoogleMap from '@/components/LiveGoogleMap.jsx';
import WorkingMapAlternative from '@/components/WorkingMapAlternative.jsx';
import EmergencyDetection from '@/components/EmergencyDetection.jsx';
import SignalControl from '@/components/signal-control/SignalControl.jsx';
import Analytics from '@/components/analytics/Analytics.jsx';
import AdminPanel from '@/components/AdminPanel.jsx';
import Sidebar from '@/components/layout/Sidebar.jsx';
import CameraFeed from '@/components/CameraFeed.jsx';
import WeatherIntegration from '@/components/WeatherIntegration.jsx';
import CameraEmergencyDetection from '@/components/CameraEmergencyDetection.jsx';
import MLTrafficAnalytics from '@/components/MLTrafficAnalytics.jsx';
import SmartTrafficSimulation from '@/components/SmartTrafficSimulation.jsx';
import WeatherAdaptiveControl from '@/components/WeatherAdaptiveControl.jsx';
import { getInitialSignals } from '@/lib/signal-logic';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [connectedIntersections, setConnectedIntersections] = useState(12);
  const [detectedVehicles, setDetectedVehicles] = useState(0);
  const [signals, setSignals] = useState(getInitialSignals());
  const [controlMode, setControlMode] = useState('automatic');
  const [mapType, setMapType] = useState('simulated'); // 'simulated' or 'live'
  const [weather, setWeather] = useState({ condition: 'clear' });
  const [emergencyDetections, setEmergencyDetections] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    let interval;
    if (isMonitoring) {
      interval = setInterval(() => {
        setDetectedVehicles(prev => Math.floor(Math.random() * 50) + 20);
        
        if (Math.random() < 0.1 && !emergencyActive) {
          setEmergencyActive(true);
          toast({
            title: "🚨 Emergency Vehicle Detected",
            description: "Activating green corridor protocol",
            className: "border-red-500 bg-red-500/10"
          });
          
          setTimeout(() => setEmergencyActive(false), 8000);
        }
      }, 3000);
    } else {
      setDetectedVehicles(0);
      setEmergencyActive(false);
    }

    return () => clearInterval(interval);
  }, [isMonitoring, toast, emergencyActive]);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'map', label: 'Traffic Map', icon: MapPin },
    { id: 'smart-simulation', label: 'Smart Simulation', icon: Zap },
    { id: 'live-map', label: 'Google Maps', icon: Navigation },
    { id: 'free-map', label: 'OpenStreet Map', icon: MapPin },
    { id: 'detection', label: 'AI Detection', icon: Eye },
    { id: 'camera-detection', label: 'Camera AI', icon: Camera },
    { id: 'signals', label: 'Signal Control', icon: Radio },
    { id: 'weather-control', label: 'Weather Control', icon: Cloud },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ml-analytics', label: 'ML Analytics', icon: Brain },
    { id: 'admin', label: 'Admin Panel', icon: Settings }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <Dashboard 
              emergencyActive={emergencyActive} 
              isMonitoring={isMonitoring}
              connectedIntersections={connectedIntersections}
              detectedVehicles={detectedVehicles}
              signals={signals}
              weather={weather}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CameraFeed 
                onEmergencyDetected={(emergency) => {
                  setEmergencyDetections(prev => [...prev, emergency]);
                  setEmergencyActive(true);
                  toast({
                    title: "🚨 Emergency Vehicle Detected",
                    description: `${emergency.type} detected via AI camera with ${emergency.confidence}% confidence`,
                  });
                }}
              />
              <WeatherIntegration 
                onWeatherChange={(newWeather) => {
                  setWeather(newWeather);
                  if (newWeather.condition !== 'clear') {
                    toast({
                      title: "🌦️ Weather Alert",
                      description: `Signal timing adjusted for ${newWeather.condition} conditions`,
                    });
                  }
                }}
              />
            </div>
          </div>
        );
      case 'map':
        return <TrafficMap emergencyActive={emergencyActive} isMonitoring={isMonitoring} signals={signals} />;
      case 'smart-simulation':
        return <SmartTrafficSimulation emergencyActive={emergencyActive} onVehicleCountChange={setDetectedVehicles} />;
      case 'live-map':
        return <LiveGoogleMap emergencyActive={emergencyActive} isMonitoring={isMonitoring} signals={signals} />;
      case 'free-map':
        return <WorkingMapAlternative emergencyActive={emergencyActive} isMonitoring={isMonitoring} signals={signals} />;
      case 'detection':
        return <EmergencyDetection isMonitoring={isMonitoring} />;
      case 'camera-detection':
        return <CameraEmergencyDetection onEmergencyDetected={(detection) => {
          setEmergencyActive(true);
          toast({
            title: `🚨 ${detection.type.toUpperCase()} DETECTED`,
            description: `AI Camera Detection - Confidence: ${(detection.confidence * 100).toFixed(1)}%`,
            className: "border-red-500 bg-red-500/10"
          });
          setTimeout(() => setEmergencyActive(false), 10000);
        }} />;
      case 'signals':
        return <SignalControl emergencyActive={emergencyActive} isMonitoring={isMonitoring} signals={signals} setSignals={setSignals} controlMode={controlMode} setControlMode={setControlMode} />;
      case 'weather-control':
        return <WeatherAdaptiveControl onWeatherChange={(weather) => {
          // Update system based on weather conditions
          if (weather.condition === 'heavy_rain' || weather.condition === 'snow') {
            setControlMode('weather-adaptive');
          }
        }} />;
      case 'analytics':
        return <Analytics />;
      case 'ml-analytics':
        return <MLTrafficAnalytics />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard emergencyActive={emergencyActive} isMonitoring={isMonitoring}/>;
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Emergency Traffic Clearance System</title>
        <meta name="description" content="Intelligent traffic management system for emergency vehicle clearance with real-time AI detection and automated signal control" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <header className="glass-effect border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Emergency Traffic AI</h1>
                    <p className="text-sm text-gray-300">Smart Corridor Management</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className={`status-indicator ${isMonitoring ? 'status-active' : 'status-error'}`}></div>
                    <span className="text-sm text-gray-300">System {isMonitoring ? 'Active' : 'Paused'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">{connectedIntersections} Intersections</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Car className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">{detectedVehicles} Vehicles</span>
                  </div>
                </div>

                {emergencyActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="emergency-pulse bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-semibold">EMERGENCY ACTIVE</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          <Sidebar 
            navigationItems={navigationItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isMonitoring={isMonitoring}
            setIsMonitoring={setIsMonitoring}
          />

          <main className="flex-1 p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderActiveComponent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        <Toaster />
      </div>
    </>
  );
}

export default App;

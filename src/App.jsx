
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
  BarChart3
} from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import Dashboard from '@/components/Dashboard.jsx';
import TrafficMap from '@/components/TrafficMap.jsx';
import EmergencyDetection from '@/components/EmergencyDetection.jsx';
import SignalControl from '@/components/signal-control/SignalControl.jsx';
import Analytics from '@/components/analytics/Analytics.jsx';
import AdminPanel from '@/components/AdminPanel.jsx';
import Sidebar from '@/components/layout/Sidebar.jsx';
import { getInitialSignals } from '@/lib/signal-logic';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [connectedIntersections, setConnectedIntersections] = useState(12);
  const [detectedVehicles, setDetectedVehicles] = useState(0);
  const [signals, setSignals] = useState(getInitialSignals());
  const [controlMode, setControlMode] = useState('automatic');
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
    { id: 'map', label: 'Live Map', icon: MapPin },
    { id: 'detection', label: 'AI Detection', icon: Eye },
    { id: 'signals', label: 'Signal Control', icon: Radio },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'admin', label: 'Admin Panel', icon: Settings }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard emergencyActive={emergencyActive} isMonitoring={isMonitoring} />;
      case 'map':
        return <TrafficMap emergencyActive={emergencyActive} isMonitoring={isMonitoring} signals={signals} />;
      case 'detection':
        return <EmergencyDetection isMonitoring={isMonitoring} />;
      case 'signals':
        return <SignalControl emergencyActive={emergencyActive} isMonitoring={isMonitoring} signals={signals} setSignals={setSignals} controlMode={controlMode} setControlMode={setControlMode} />;
      case 'analytics':
        return <Analytics />;
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

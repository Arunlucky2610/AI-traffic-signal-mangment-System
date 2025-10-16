import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  AlertTriangle, 
  MapPin, 
  Settings, 
  Navigation,
  Radio,
  BarChart3
} from 'lucide-react';
import Dashboard from './components/Dashboard.jsx';
import TrafficMap from './components/TrafficMap.jsx';
import LiveGoogleMap from './components/LiveGoogleMap.jsx';
import WorkingMapAlternative from './components/WorkingMapAlternative.jsx';
import EmergencyDetection from './components/EmergencyDetection.jsx';
import SignalControl from './components/signal-control/SignalControl.jsx';
import Analytics from './components/analytics/Analytics.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import { getInitialSignals } from './lib/signal-logic.js';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [connectedIntersections, setConnectedIntersections] = useState(12);
  const [detectedVehicles, setDetectedVehicles] = useState(0);
  const [signals, setSignals] = useState(getInitialSignals());
  const [controlMode, setControlMode] = useState('automatic');

  useEffect(() => {
    let interval;
    if (isMonitoring) {
      interval = setInterval(() => {
        setDetectedVehicles(prev => Math.floor(Math.random() * 50) + 20);
        
        if (Math.random() < 0.1 && !emergencyActive) {
          setEmergencyActive(true);
          setTimeout(() => setEmergencyActive(false), 8000);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring, emergencyActive]);

  const navigationTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'map', label: 'Traffic Map', icon: MapPin },
    { id: 'live-map', label: 'Live Google Map', icon: Navigation },
    { id: 'free-map', label: 'Free Map', icon: MapPin },
    { id: 'detection', label: 'Emergency Detection', icon: AlertTriangle },
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
      case 'live-map':
        return <LiveGoogleMap emergencyActive={emergencyActive} isMonitoring={isMonitoring} signals={signals} />;
      case 'free-map':
        return <WorkingMapAlternative emergencyActive={emergencyActive} isMonitoring={isMonitoring} signals={signals} />;
      case 'detection':
        return <EmergencyDetection isMonitoring={isMonitoring} />;
      case 'signals':
        return <SignalControl emergencyActive={emergencyActive} isMonitoring={isMonitoring} signals={signals} setSignals={setSignals} controlMode={controlMode} setControlMode={setControlMode} />;
      case 'analytics':
        return <Analytics emergencyActive={emergencyActive} signals={signals} detectedVehicles={detectedVehicles} />;
      case 'admin':
        return <AdminPanel isMonitoring={isMonitoring} setIsMonitoring={setIsMonitoring} connectedIntersections={connectedIntersections} controlMode={controlMode} setControlMode={setControlMode} />;
      default:
        return <Dashboard emergencyActive={emergencyActive} isMonitoring={isMonitoring} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Helmet>
        <title>AI Traffic Signal Management System</title>
        <meta name="description" content="Intelligent traffic management with emergency vehicle detection" />
      </Helmet>

      <div className="flex h-screen">
        <Sidebar 
          navigationTabs={navigationTabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          emergencyActive={emergencyActive}
          isMonitoring={isMonitoring}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {renderActiveComponent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

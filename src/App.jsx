
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  AlertTriangle, 
  Car, 
  Settings, 
  Shield,
  Navigation,
  Radio,
  Eye,
  BarChart3
} from 'lucide-react';
import { Toaster } from './components/ui/toaster.jsx';
import { useToast } from './components/ui/use-toast.js';
import Dashboard from './components/Dashboard.jsx';
import WorkingGoogleMap from './components/WorkingGoogleMap.jsx';
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
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { toast } = useToast();

  // Scroll handler for navbar hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        // Always show navbar when at top
        setIsNavbarVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Hide navbar when scrolling down (after 100px)
        setIsNavbarVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Show navbar when scrolling up
        setIsNavbarVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
    { id: 'maps', label: 'Google Maps', icon: Navigation },
    { id: 'detection', label: 'AI Detection', icon: Eye },
    { id: 'signals', label: 'Signal Control', icon: Radio },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'admin', label: 'Admin Panel', icon: Settings }
  ];

  const handleResetSignals = () => {
    setSignals(getInitialSignals());
    setEmergencyActive(false);
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard emergencyActive={emergencyActive} isMonitoring={isMonitoring} />;
      case 'maps':
        return <WorkingGoogleMap emergencyActive={emergencyActive} isMonitoring={isMonitoring} />;
      case 'detection':
        return <EmergencyDetection isMonitoring={isMonitoring} />;
      case 'signals':
        return <SignalControl 
          emergencyActive={emergencyActive} 
          setEmergencyActive={setEmergencyActive}
          isMonitoring={isMonitoring} 
          setIsMonitoring={setIsMonitoring}
          signals={signals} 
          setSignals={setSignals} 
          controlMode={controlMode} 
          setControlMode={setControlMode} 
        />;
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
        <header className={`bg-slate-900/95 border-b border-white/10 fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
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

        <div className="flex pt-20">
          <Sidebar 
            navigationItems={navigationItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isMonitoring={isMonitoring}
            setIsMonitoring={setIsMonitoring}
            onResetSignals={handleResetSignals}
            signals={signals}
            setSignals={setSignals}
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

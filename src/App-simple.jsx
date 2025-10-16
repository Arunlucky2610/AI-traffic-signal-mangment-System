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

// Import only safe components first
import Dashboard from '@/components/Dashboard.jsx';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [connectedIntersections, setConnectedIntersections] = useState(12);
  const [detectedVehicles, setDetectedVehicles] = useState(0);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            emergencyActive={emergencyActive} 
            isMonitoring={isMonitoring}
            connectedIntersections={connectedIntersections}
            detectedVehicles={detectedVehicles}
          />
        );
      default:
        return <div className="text-white">Component loading...</div>;
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
                    <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-red-500'}`}></div>
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
          {/* Simple Sidebar */}
          <aside className="w-64 glass-effect border-r border-white/10 min-h-screen p-4">
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                  activeTab === 'dashboard' ? 'bg-blue-500/20 text-blue-300' : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            </nav>
          </aside>

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
      </div>
    </>
  );
}

export default App;
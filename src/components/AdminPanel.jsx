import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Users, 
  Shield, 
  Database,
  Bell,
  Key,
  Monitor,
  Wifi,
  HardDrive,
  Cpu,
  Activity,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AdminPanel = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('system');
  const [systemSettings, setSystemSettings] = useState({
    autoOptimization: true,
    emergencyPriority: 'high',
    detectionSensitivity: 85,
    responseTimeout: 30,
    backupEnabled: true,
    maintenanceMode: false
  });

  const [systemHealth, setSystemHealth] = useState({
    cpu: 67,
    memory: 45,
    storage: 23,
    network: 98,
    database: 92
  });

  const adminSections = [
    { id: 'system', label: 'System Settings', icon: Settings },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'monitoring', label: 'Monitoring', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved successfully!",
      description: "System configuration has been updated"
    });
  };

  const handleSystemAction = (action) => {
    toast({ 
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" 
    });
  };

  const getHealthColor = (value) => {
    if (value >= 80) return 'text-green-400 bg-green-500/10';
    if (value >= 60) return 'text-yellow-400 bg-yellow-500/10';
    return 'text-red-400 bg-red-500/10';
  };

  const getHealthStatus = (value) => {
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Good';
    return 'Needs Attention';
  };

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Core System Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Auto Optimization
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSystemSettings(prev => ({ ...prev, autoOptimization: !prev.autoOptimization }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    systemSettings.autoOptimization ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      systemSettings.autoOptimization ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-300">
                  {systemSettings.autoOptimization ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Emergency Priority Level
              </label>
              <select
                value={systemSettings.emergencyPriority}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, emergencyPriority: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Detection Sensitivity: {systemSettings.detectionSensitivity}%
              </label>
              <input
                type="range"
                min="50"
                max="100"
                value={systemSettings.detectionSensitivity}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, detectionSensitivity: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Response Timeout (seconds)
              </label>
              <input
                type="number"
                min="10"
                max="120"
                value={systemSettings.responseTimeout}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, responseTimeout: parseInt(e.target.value) }))}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Backup System
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSystemSettings(prev => ({ ...prev, backupEnabled: !prev.backupEnabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    systemSettings.backupEnabled ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      systemSettings.backupEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-300">
                  {systemSettings.backupEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Maintenance Mode
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSystemSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    systemSettings.maintenanceMode ? 'bg-yellow-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      systemSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-300">
                  {systemSettings.maintenanceMode ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSaveSettings}>
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSystemHealth = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(systemHealth).map(([key, value]) => {
        const icons = {
          cpu: Cpu,
          memory: HardDrive,
          storage: Database,
          network: Wifi,
          database: Activity
        };
        const Icon = icons[key];
        
        return (
          <div key={key} className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg ${getHealthColor(value)} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold capitalize">{key}</h4>
                  <p className="text-sm text-gray-400">{getHealthStatus(value)}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{value}%</div>
              </div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${value}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'system':
        return renderSystemSettings();
      case 'monitoring':
        return renderSystemHealth();
      default:
        return (
          <div className="glass-effect rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Feature Coming Soon</h3>
            <p className="text-gray-300 mb-4">This admin section is under development</p>
            <Button 
              variant="outline"
              onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
            >
              Request Implementation
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Admin Panel</h2>
          <p className="text-gray-300 mt-1">System configuration and management</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleSystemAction('backup')}
          >
            <Database className="w-4 h-4 mr-2" />
            Backup System
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleSystemAction('restart')}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Restart Services
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold">System Status</h4>
              <p className="text-green-400 text-sm">Operational</p>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold">Active Users</h4>
              <p className="text-blue-400 text-sm">3 Administrators</p>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold">Alerts</h4>
              <p className="text-yellow-400 text-sm">2 Warnings</p>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold">Uptime</h4>
              <p className="text-purple-400 text-sm">99.8%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Admin Navigation */}
        <nav className="w-64 glass-effect rounded-xl p-6 mr-6">
          <div className="space-y-2">
            {adminSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Admin Content */}
        <div className="flex-1">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
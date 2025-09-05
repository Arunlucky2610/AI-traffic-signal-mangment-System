import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Radio, 
  Zap, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SignalControl = ({ emergencyActive }) => {
  const { toast } = useToast();
  const [signals, setSignals] = useState([]);
  const [controlMode, setControlMode] = useState('automatic');
  const [systemStats, setSystemStats] = useState({
    totalSignals: 12,
    activeSignals: 12,
    averageResponseTime: 2.3,
    optimizationRate: 94.2
  });

  useEffect(() => {
    // Initialize traffic signals
    const initialSignals = [
      { id: 1, name: 'Main St & 1st Ave', status: 'green', mode: 'auto', timing: 45, emergency: false },
      { id: 2, name: 'Main St & 2nd Ave', status: 'red', mode: 'auto', timing: 30, emergency: false },
      { id: 3, name: 'Main St & 3rd Ave', status: 'yellow', mode: 'auto', timing: 5, emergency: false },
      { id: 4, name: 'Main St & 4th Ave', status: 'green', mode: 'auto', timing: 35, emergency: false },
      { id: 5, name: 'Oak St & 1st Ave', status: 'red', mode: 'auto', timing: 25, emergency: false },
      { id: 6, name: 'Oak St & 2nd Ave', status: 'green', mode: 'auto', timing: 40, emergency: false },
      { id: 7, name: 'Oak St & 3rd Ave', status: 'red', mode: 'auto', timing: 20, emergency: false },
      { id: 8, name: 'Oak St & 4th Ave', status: 'yellow', mode: 'auto', timing: 8, emergency: false },
      { id: 9, name: 'Pine St & 1st Ave', status: 'green', mode: 'auto', timing: 50, emergency: false },
      { id: 10, name: 'Pine St & 2nd Ave', status: 'red', mode: 'auto', timing: 15, emergency: false },
      { id: 11, name: 'Pine St & 3rd Ave', status: 'green', mode: 'auto', timing: 42, emergency: false },
      { id: 12, name: 'Pine St & 4th Ave', status: 'red', mode: 'auto', timing: 28, emergency: false }
    ];
    setSignals(initialSignals);
  }, []);

  // Update signals based on emergency status
  useEffect(() => {
    if (emergencyActive) {
      setSignals(prev => prev.map(signal => {
        if ([1, 2, 3, 4].includes(signal.id)) {
          return { 
            ...signal, 
            status: 'green', 
            mode: 'emergency', 
            timing: 120, 
            emergency: true 
          };
        }
        return { 
          ...signal, 
          status: 'red', 
          mode: 'emergency', 
          timing: 120, 
          emergency: false 
        };
      }));
    } else {
      setSignals(prev => prev.map(signal => ({
        ...signal,
        mode: 'auto',
        emergency: false,
        timing: Math.floor(Math.random() * 40) + 20
      })));
    }
  }, [emergencyActive]);

  // Simulate signal timing updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSignals(prev => prev.map(signal => {
        if (signal.mode === 'emergency') return signal;
        
        let newTiming = signal.timing - 1;
        let newStatus = signal.status;
        
        if (newTiming <= 0) {
          switch (signal.status) {
            case 'green':
              newStatus = 'yellow';
              newTiming = 5;
              break;
            case 'yellow':
              newStatus = 'red';
              newTiming = Math.floor(Math.random() * 40) + 20;
              break;
            case 'red':
              newStatus = 'green';
              newTiming = Math.floor(Math.random() * 40) + 30;
              break;
          }
        }
        
        return { ...signal, status: newStatus, timing: newTiming };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getSignalColor = (status) => {
    switch (status) {
      case 'green': return 'bg-green-500 shadow-lg shadow-green-500/50';
      case 'yellow': return 'bg-yellow-500 shadow-lg shadow-yellow-500/50';
      case 'red': return 'bg-red-500 shadow-lg shadow-red-500/50';
      default: return 'bg-gray-500';
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'emergency': return 'text-red-400 bg-red-500/10';
      case 'manual': return 'text-blue-400 bg-blue-500/10';
      case 'auto': return 'text-green-400 bg-green-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const handleSignalControl = (signalId, action) => {
    toast({ 
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Signal Control Center</h2>
          <p className="text-gray-300 mt-1">Real-time traffic signal management and optimization</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant={controlMode === 'automatic' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setControlMode('automatic')}
          >
            <Activity className="w-4 h-4 mr-2" />
            Auto Mode
          </Button>
          <Button 
            variant={controlMode === 'manual' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setControlMode('manual')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Manual Mode
          </Button>
        </div>
      </div>

      {/* Emergency Alert */}
      {emergencyActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="emergency-pulse glass-effect border-red-500/50 rounded-xl p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-400">Emergency Override Active</h3>
              <p className="text-gray-300">All signals on Main Street corridor optimized for emergency vehicle passage</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-400">4 SIGNALS</div>
              <div className="text-sm text-gray-400">Under Emergency Control</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Radio className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-400 font-medium">100%</div>
              <div className="text-xs text-gray-400">operational</div>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-300">Active Signals</h3>
            <div className="text-2xl font-bold text-white">{systemStats.activeSignals}/{systemStats.totalSignals}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-right">
              <div className="text-sm text-green-400 font-medium">-0.2s</div>
              <div className="text-xs text-gray-400">vs target</div>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-300">Response Time</h3>
            <div className="text-2xl font-bold text-white">{systemStats.averageResponseTime}s</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-400 font-medium">+2.1%</div>
              <div className="text-xs text-gray-400">this week</div>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-300">Optimization Rate</h3>
            <div className="text-2xl font-bold text-white">{systemStats.optimizationRate}%</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <div className="text-right">
              <div className="text-sm text-orange-400 font-medium">-15%</div>
              <div className="text-xs text-gray-400">wait time</div>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-300">Avg Wait Time</h3>
            <div className="text-2xl font-bold text-white">32s</div>
          </div>
        </div>
      </div>

      {/* Signal Grid */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Traffic Signal Status</h3>
          <div className="flex items-center space-x-4">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleSignalControl('all', 'optimize')}
            >
              <Zap className="w-4 h-4 mr-2" />
              Optimize All
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleSignalControl('all', 'reset')}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {signals.map((signal) => (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: signal.id * 0.05 }}
              className={`glass-effect rounded-lg p-4 hover:bg-white/15 transition-all duration-300 ${
                signal.emergency ? 'border border-red-500/50' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-white">{signal.name}</h4>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getModeColor(signal.mode)}`}>
                  {signal.mode}
                </div>
              </div>

              {/* Traffic Light Display */}
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gray-800 rounded-lg p-3 flex flex-col space-y-2">
                  <div className={`w-6 h-6 rounded-full border-2 border-gray-600 ${
                    signal.status === 'red' ? getSignalColor('red') : 'bg-gray-700'
                  }`}></div>
                  <div className={`w-6 h-6 rounded-full border-2 border-gray-600 ${
                    signal.status === 'yellow' ? getSignalColor('yellow') : 'bg-gray-700'
                  }`}></div>
                  <div className={`w-6 h-6 rounded-full border-2 border-gray-600 ${
                    signal.status === 'green' ? getSignalColor('green') : 'bg-gray-700'
                  }`}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Current Status</span>
                  <span className={`font-medium capitalize ${
                    signal.status === 'green' ? 'text-green-400' :
                    signal.status === 'yellow' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {signal.status}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Time Remaining</span>
                  <span className="text-white font-medium">{signal.timing}s</span>
                </div>
                
                {signal.mode !== 'emergency' && (
                  <div className="flex space-x-1 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs"
                      onClick={() => handleSignalControl(signal.id, 'manual')}
                    >
                      Manual
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs"
                      onClick={() => handleSignalControl(signal.id, 'optimize')}
                    >
                      Optimize
                    </Button>
                  </div>
                )}
                
                {signal.emergency && (
                  <div className="mt-3 p-2 bg-red-500/10 rounded border border-red-500/30">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      <span className="text-xs text-red-400 font-medium">Emergency Override</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              className="h-16 flex flex-col items-center justify-center space-y-1"
              onClick={() => handleSignalControl('all', 'emergency')}
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="text-xs">Emergency Mode</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center space-y-1"
              onClick={() => handleSignalControl('all', 'optimize')}
            >
              <Zap className="w-5 h-5" />
              <span className="text-xs">Optimize Flow</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center space-y-1"
              onClick={() => handleSignalControl('all', 'pause')}
            >
              <Pause className="w-5 h-5" />
              <span className="text-xs">Pause System</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center space-y-1"
              onClick={() => handleSignalControl('all', 'reset')}
            >
              <RotateCcw className="w-5 h-5" />
              <span className="text-xs">Reset All</span>
            </Button>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Signal Communication</span>
              <div className="flex items-center space-x-2">
                <div className="status-indicator status-active"></div>
                <span className="text-green-400 text-sm">Excellent</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Network Latency</span>
              <span className="text-blue-400 text-sm">12ms avg</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Power Status</span>
              <div className="flex items-center space-x-2">
                <div className="status-indicator status-active"></div>
                <span className="text-green-400 text-sm">Stable</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Backup Systems</span>
              <div className="flex items-center space-x-2">
                <div className="status-indicator status-active"></div>
                <span className="text-green-400 text-sm">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalControl;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  AlertTriangle, 
  Car, 
  Clock, 
  TrendingUp, 
  Zap,
  MapPin,
  Shield,
  Radio,
  Eye
} from 'lucide-react';

const Dashboard = ({ emergencyActive, isMonitoring }) => {
  const [metrics, setMetrics] = useState({
    activeEmergencies: 0,
    averageResponseTime: 45,
    signalsControlled: 12,
    vehiclesDetected: 247,
    corridorsActive: 0,
    systemUptime: 99.8
  });

  const [recentEvents, setRecentEvents] = useState([
    { id: 1, type: 'emergency', message: 'Ambulance detected at Main St & 5th Ave', time: '2 min ago', status: 'active' },
    { id: 2, type: 'signal', message: 'Traffic signal optimized at Central Plaza', time: '5 min ago', status: 'completed' },
    { id: 3, type: 'detection', message: 'Fire truck approaching Elm Street intersection', time: '8 min ago', status: 'completed' },
    { id: 4, type: 'system', message: 'AI model updated with new detection patterns', time: '15 min ago', status: 'info' }
  ]);

  useEffect(() => {
    let interval;
    if (isMonitoring) {
      interval = setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          vehiclesDetected: prev.vehiclesDetected + Math.floor(Math.random() * 5),
          averageResponseTime: Math.max(30, prev.averageResponseTime + (Math.random() - 0.5) * 10),
          activeEmergencies: emergencyActive ? Math.max(1, prev.activeEmergencies) : 0,
          corridorsActive: emergencyActive ? Math.max(1, prev.corridorsActive) : 0
        }));
      }, 2000);
    } else {
        setMetrics(prev => ({ ...prev, vehiclesDetected: 0, activeEmergencies: 0, corridorsActive: 0 }));
    }

    return () => clearInterval(interval);
  }, [emergencyActive, isMonitoring]);

  const metricCards = [
    {
      title: 'Active Emergencies',
      value: metrics.activeEmergencies,
      icon: AlertTriangle,
      color: metrics.activeEmergencies > 0 ? 'text-red-400' : 'text-gray-400',
      bgColor: metrics.activeEmergencies > 0 ? 'bg-red-500/10' : 'bg-gray-500/10',
      change: emergencyActive ? '+1' : '0'
    },
    {
      title: 'Avg Response Time',
      value: `${Math.round(metrics.averageResponseTime)}s`,
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      change: '-12%'
    },
    {
      title: 'Signals Controlled',
      value: metrics.signalsControlled,
      icon: Radio,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      change: '+2'
    },
    {
      title: 'Vehicles Detected',
      value: metrics.vehiclesDetected,
      icon: Car,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      change: '+15'
    },
    {
      title: 'Active Corridors',
      value: metrics.corridorsActive,
      icon: MapPin,
      color: metrics.corridorsActive > 0 ? 'text-orange-400' : 'text-gray-400',
      bgColor: metrics.corridorsActive > 0 ? 'bg-orange-500/10' : 'bg-gray-500/10',
      change: emergencyActive ? '+1' : '0'
    },
    {
      title: 'System Uptime',
      value: `${metrics.systemUptime}%`,
      icon: Activity,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      change: '+0.1%'
    }
  ];

  const getEventIcon = (type) => {
    switch (type) {
      case 'emergency': return AlertTriangle;
      case 'signal': return Radio;
      case 'detection': return Eye;
      case 'system': return Activity;
      default: return Activity;
    }
  };

  const getEventColor = (status) => {
    switch (status) {
      case 'active': return 'text-red-400 bg-red-500/10';
      case 'completed': return 'text-green-400 bg-green-500/10';
      case 'info': return 'text-blue-400 bg-blue-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">System Dashboard</h2>
          <p className="text-gray-300 mt-1">Real-time monitoring and control center</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`status-indicator ${isMonitoring ? 'status-active' : 'status-error'}`}></div>
          <span className="text-sm text-gray-300">{isMonitoring ? 'All systems operational' : 'System paused'}</span>
        </div>
      </div>

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
              <h3 className="text-xl font-bold text-red-400">Emergency Vehicle Detected</h3>
              <p className="text-gray-300">Green corridor activated - optimizing traffic signals</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-400">ACTIVE</div>
              <div className="text-sm text-gray-400">Priority Route Engaged</div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="metric-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-400 font-medium">{metric.change}</div>
                  <div className="text-xs text-gray-400">vs last hour</div>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-300">{metric.title}</h3>
                <div className="text-2xl font-bold text-white">{metric.value}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Recent Events</h3>
          <div className="space-y-4">
            {recentEvents.map((event) => {
              const Icon = getEventIcon(event.type);
              return (
                <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getEventColor(event.status)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{event.message}</p>
                    <p className="text-gray-400 text-xs mt-1">{event.time}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getEventColor(event.status)}`}>
                    {event.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">System Performance</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">AI Detection Accuracy</span>
                <span className="text-green-400 font-medium">98.7%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '98.7%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Signal Response Time</span>
                <span className="text-blue-400 font-medium">2.3s avg</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Network Connectivity</span>
                <span className="text-green-400 font-medium">100%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">CPU Usage</span>
                <span className="text-yellow-400 font-medium">{isMonitoring ? '67%' : '12%'}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: isMonitoring ? '67%' : '12%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


import React from 'react';
import { Radio, Zap, Clock, CheckCircle } from 'lucide-react';

const SignalStats = ({ isMonitoring }) => {
  const systemStats = {
    totalSignals: 12,
    activeSignals: 12,
    averageResponseTime: 2.3,
    optimizationRate: 94.2
  };

  const stats = [
    { title: 'Active Signals', value: `${systemStats.activeSignals}/${systemStats.totalSignals}`, change: '100%', changeColor: 'text-blue-400', icon: Radio, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { title: 'Response Time', value: `${systemStats.averageResponseTime}s`, change: '-0.2s', changeColor: 'text-green-400', icon: Zap, color: 'text-green-400', bgColor: 'bg-green-500/10' },
    { title: 'Optimization Rate', value: `${systemStats.optimizationRate}%`, change: '+2.1%', changeColor: 'text-purple-400', icon: CheckCircle, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
    { title: 'Avg Wait Time', value: '32s', change: '-15%', changeColor: 'text-orange-400', icon: Clock, color: 'text-orange-400', bgColor: 'bg-orange-500/10' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-right">
                <div className={`text-sm ${stat.changeColor} font-medium`}>{isMonitoring ? stat.change : '-'}</div>
                <div className="text-xs text-gray-400">{isMonitoring ? 'vs target' : 'paused'}</div>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-300">{stat.title}</h3>
              <div className="text-2xl font-bold text-white">{isMonitoring ? stat.value : 'N/A'}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SignalStats;

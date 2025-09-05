import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  Car
} from 'lucide-react';

const PerformanceMetrics = ({ analyticsData }) => {
  const metrics = [
    {
      title: 'Emergency Responses',
      value: analyticsData.emergencyResponses,
      change: '+12%',
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10'
    },
    {
      title: 'Avg Response Time',
      value: `${analyticsData.averageResponseTime}s`,
      change: '-8%',
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Traffic Flow Improvement',
      value: `${analyticsData.trafficFlowImprovement}%`,
      change: '+5.2%',
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Fuel Savings',
      value: `${analyticsData.fuelSavings}%`,
      change: '+3.1%',
      icon: Car,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
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
                <div className="text-xs text-gray-400">vs last period</div>
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
  );
};

export default PerformanceMetrics;
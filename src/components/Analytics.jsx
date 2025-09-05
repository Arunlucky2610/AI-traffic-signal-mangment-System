import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  Car,
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Analytics = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('24h');
  const [analyticsData, setAnalyticsData] = useState({
    emergencyResponses: 23,
    averageResponseTime: 45,
    trafficFlowImprovement: 18.5,
    fuelSavings: 12.3,
    emergencySuccessRate: 98.7
  });

  const [chartData, setChartData] = useState([]);
  const [emergencyTrends, setEmergencyTrends] = useState([]);

  useEffect(() => {
    // Generate mock chart data
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const mockChartData = hours.map(hour => ({
      hour: `${hour}:00`,
      emergencies: Math.floor(Math.random() * 5) + 1,
      responseTime: Math.floor(Math.random() * 30) + 30,
      trafficFlow: Math.floor(Math.random() * 100) + 50
    }));
    setChartData(mockChartData);

    // Generate emergency trends
    const trends = [
      { type: 'Ambulance', count: 12, change: '+15%', color: 'text-red-400' },
      { type: 'Fire Truck', count: 7, change: '-8%', color: 'text-orange-400' },
      { type: 'Police', count: 4, change: '+25%', color: 'text-blue-400' }
    ];
    setEmergencyTrends(trends);
  }, [timeRange]);

  const timeRanges = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  const performanceMetrics = [
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

  const handleExportData = () => {
    toast({ 
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" 
    });
  };

  const handleRefreshData = () => {
    toast({ 
      title: "Data refreshed successfully!",
      description: "Analytics updated with latest information"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">System Analytics</h2>
          <p className="text-gray-300 mt-1">Performance insights and traffic optimization metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                size="sm"
                variant={timeRange === range.value ? 'default' : 'outline'}
                onClick={() => setTimeRange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </div>
          <Button size="sm" variant="outline" onClick={handleRefreshData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" variant="outline" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => {
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Chart */}
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Response Time Trends</h3>
            <Button size="sm" variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="h-64 relative">
            <svg className="w-full h-full">
              {/* Chart Grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="1" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Chart Line */}
              <polyline
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                points={chartData.map((point, index) => 
                  `${(index / (chartData.length - 1)) * 100}%,${100 - (point.responseTime / 80) * 100}%`
                ).join(' ')}
              />
              
              {/* Data Points */}
              {chartData.map((point, index) => (
                <circle
                  key={index}
                  cx={`${(index / (chartData.length - 1)) * 100}%`}
                  cy={`${100 - (point.responseTime / 80) * 100}%`}
                  r="4"
                  fill="#3B82F6"
                  className="hover:r-6 transition-all cursor-pointer"
                />
              ))}
            </svg>
            
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 -ml-8">
              <span>80s</span>
              <span>60s</span>
              <span>40s</span>
              <span>20s</span>
              <span>0s</span>
            </div>
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-400 -mb-6">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>
        </div>

        {/* Emergency Types Distribution */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Emergency Vehicle Types</h3>
          
          <div className="space-y-4">
            {emergencyTrends.map((trend, index) => (
              <motion.div
                key={trend.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 glass-effect rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    trend.type === 'Ambulance' ? 'bg-red-500' :
                    trend.type === 'Fire Truck' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}></div>
                  <span className="text-white font-medium">{trend.type}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-white">{trend.count}</span>
                  <span className={`text-sm font-medium ${trend.color}`}>{trend.change}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pie Chart Visualization */}
          <div className="mt-6 flex justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="12"
                  strokeDasharray="75 25"
                  strokeDashoffset="0"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="12"
                  strokeDasharray="30 70"
                  strokeDashoffset="-75"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="12"
                  strokeDasharray="17 83"
                  strokeDashoffset="-105"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Flow Analysis */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Traffic Flow Impact</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Before AI System</span>
                <span className="text-red-400">65% efficiency</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">After AI System</span>
                <span className="text-green-400">83% efficiency</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '83%' }}></div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">+18%</div>
                <div className="text-sm text-gray-300">Overall Improvement</div>
              </div>
            </div>
          </div>
        </div>

        {/* Peak Hours Analysis */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Peak Emergency Hours</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded bg-red-500/10">
              <span className="text-gray-300">08:00 - 10:00</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-700 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-red-400 text-sm">High</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded bg-orange-500/10">
              <span className="text-gray-300">17:00 - 19:00</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-700 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <span className="text-orange-400 text-sm">Medium</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded bg-green-500/10">
              <span className="text-gray-300">02:00 - 06:00</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-green-400 text-sm">Low</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Efficiency */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">System Efficiency</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">98.7%</div>
              <div className="text-sm text-gray-300">Success Rate</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Successful Clearances</span>
                <span className="text-green-400">227/230</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">False Positives</span>
                <span className="text-yellow-400">2</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">System Downtime</span>
                <span className="text-blue-400">0.2%</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center justify-center space-x-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm">System Operating Optimally</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
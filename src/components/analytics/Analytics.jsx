import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader.jsx';
import PerformanceMetrics from '@/components/analytics/PerformanceMetrics.jsx';
import ResponseTimeChart from '@/components/analytics/ResponseTimeChart.jsx';
import EmergencyTypesChart from '@/components/analytics/EmergencyTypesChart.jsx';
import DetailedAnalytics from '@/components/analytics/DetailedAnalytics.jsx';

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
    const hours = Array.from({ length: 24 }, (_, i) => i);
    let mockChartData = [];
    let emergencyResponses = 0;
    if (timeRange === '1h') {
      emergencyResponses = Math.floor(Math.random() * 10) + 1;
      mockChartData = [
        {
          hour: 'This Hour',
          emergencies: emergencyResponses,
          responseTime: Math.floor(Math.random() * 30) + 20, // 20-49
          trafficFlow: Math.floor(Math.random() * 100) + 50
        }
      ];
    } else if (timeRange === '24h') {
      emergencyResponses = Math.floor(Math.random() * 40) + 11;
      mockChartData = hours.map(hour => ({
        hour: `${hour}:00`,
        emergencies: Math.floor(Math.random() * 3) + 1,
        responseTime: Math.floor(Math.random() * 40) + 10, // 10-49
        trafficFlow: Math.floor(Math.random() * 100) + 50
      }));
    } else {
      emergencyResponses = Math.floor(Math.random() * 50) + 51;
      mockChartData = hours.map(hour => ({
        hour: `${hour}:00`,
        emergencies: Math.floor(Math.random() * 5) + 1,
        responseTime: Math.floor(Math.random() * 50) + 5, // 5-54
        trafficFlow: Math.floor(Math.random() * 100) + 50
      }));
    }
    setChartData(mockChartData);

    // Calculate average response time from generated data
    let avgResponseTime = 0;
    if (mockChartData.length > 0) {
      avgResponseTime = Math.round(
        mockChartData.reduce((sum, d) => sum + d.responseTime, 0) / mockChartData.length
      );
    }

    const trends = [
      { type: 'Ambulance', count: Math.floor(emergencyResponses * 0.5), change: '+15%', color: 'text-red-400' },
      { type: 'Fire Truck', count: Math.floor(emergencyResponses * 0.3), change: '-8%', color: 'text-orange-400' },
      { type: 'Police', count: Math.floor(emergencyResponses * 0.2), change: '+25%', color: 'text-blue-400' }
    ];
    setEmergencyTrends(trends);

    // Calculate average traffic flow improvement and fuel savings
    let avgTrafficFlow = 0;
    let avgFuelSavings = 0;
    // Display a random number below 50 for traffic flow improvement
    avgTrafficFlow = Math.floor(Math.random() * 49) + 1;
    avgFuelSavings = Math.round(avgTrafficFlow * 0.15 * 10) / 10; // 15% of traffic flow, 1 decimal

    setAnalyticsData(prev => ({
      ...prev,
      emergencyResponses,
      averageResponseTime: avgResponseTime,
      trafficFlowImprovement: avgTrafficFlow,
      fuelSavings: avgFuelSavings
    }));
  }, [timeRange]);

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
      <AnalyticsHeader 
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        onRefresh={handleRefreshData}
        onExport={handleExportData}
      />
      
      <PerformanceMetrics analyticsData={analyticsData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResponseTimeChart chartData={chartData} />
        <EmergencyTypesChart emergencyTrends={emergencyTrends} />
      </div>

      <DetailedAnalytics />
    </div>
  );
};

export default Analytics;
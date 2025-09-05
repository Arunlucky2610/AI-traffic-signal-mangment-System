import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

const AnalyticsHeader = ({ timeRange, setTimeRange, onRefresh, onExport }) => {
  const timeRanges = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  return (
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
        <Button size="sm" variant="outline" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        <Button size="sm" variant="outline" onClick={onExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
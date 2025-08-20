import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

const ResponseTimeChart = ({ chartData }) => {
  return (
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
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          <polyline
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            points={chartData.map((point, index) => 
              `${(index / (chartData.length - 1)) * 100}%,${100 - (point.responseTime / 80) * 100}%`
            ).join(' ')}
          />
          
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
        
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 -ml-8">
          <span>80s</span>
          <span>60s</span>
          <span>40s</span>
          <span>20s</span>
          <span>0s</span>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-400 -mb-6">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>
    </div>
  );
};

export default ResponseTimeChart;
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Zap, Pause, RotateCcw } from 'lucide-react';

const SignalControlPanel = ({ onControl }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <Button className="h-16 flex flex-col items-center justify-center space-y-1" onClick={() => onControl('all', 'emergency')}>
            <AlertTriangle className="w-5 h-5" />
            <span className="text-xs">Emergency Mode</span>
          </Button>
          <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1" onClick={() => onControl('all', 'optimize')}>
            <Zap className="w-5 h-5" />
            <span className="text-xs">Optimize Flow</span>
          </Button>
          <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1" onClick={() => onControl('all', 'pause')}>
            <Pause className="w-5 h-5" />
            <span className="text-xs">Pause System</span>
          </Button>
          <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1" onClick={() => onControl('all', 'reset')}>
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
  );
};

export default SignalControlPanel;
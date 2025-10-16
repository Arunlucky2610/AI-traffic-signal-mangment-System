import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Zap, Pause, RotateCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SignalControlPanel = ({ 
  onControl, 
  emergencyActive, 
  setEmergencyActive, 
  isMonitoring, 
  setIsMonitoring,
  signals 
}) => {
  const { toast } = useToast();

  const handleEmergencyMode = () => {
    if (emergencyActive) {
      setEmergencyActive(false);
      toast({
        title: "🚦 Emergency Mode Deactivated",
        description: "All signals returning to normal operation.",
        className: "border-green-500 bg-green-500/10"
      });
    } else {
      setEmergencyActive(true);
      toast({
        title: "🚨 Emergency Mode Activated",
        description: "Priority corridor established for emergency vehicles.",
        className: "border-red-500 bg-red-500/10"
      });
    }
    onControl('all', 'emergency');
  };

  const handleOptimizeFlow = () => {
    onControl('all', 'optimize');
    toast({
      title: "⚡ Traffic Flow Optimized",
      description: `AI is now optimizing timing for all ${signals?.length || 12} signals based on current traffic patterns.`,
      className: "border-blue-500 bg-blue-500/10"
    });
  };

  const handlePauseSystem = () => {
    setIsMonitoring(!isMonitoring);
    if (isMonitoring) {
      toast({
        title: "⏸️ System Paused",
        description: "Traffic monitoring and automatic signal control paused.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "▶️ System Resumed",
        description: "Traffic monitoring and automatic signal control resumed.",
        className: "border-green-500 bg-green-500/10"
      });
    }
    onControl('all', 'pause');
  };

  const handleResetAll = () => {
    onControl('all', 'reset');
    toast({
      title: "🔄 All Signals Reset",
      description: "All traffic signals have been reset to default timing patterns.",
      className: "border-blue-500 bg-blue-500/10"
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            className={`h-16 flex flex-col items-center justify-center space-y-1 ${
              emergencyActive 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50'
            }`} 
            onClick={handleEmergencyMode}
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="text-xs">{emergencyActive ? 'Exit Emergency' : 'Emergency Mode'}</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 flex flex-col items-center justify-center space-y-1 border-blue-500/50 hover:bg-blue-500/20 text-blue-400"
            onClick={handleOptimizeFlow}
          >
            <Zap className="w-5 h-5" />
            <span className="text-xs">Optimize Flow</span>
          </Button>
          <Button 
            variant="outline" 
            className={`h-16 flex flex-col items-center justify-center space-y-1 ${
              isMonitoring 
                ? 'border-yellow-500/50 hover:bg-yellow-500/20 text-yellow-400' 
                : 'border-green-500/50 hover:bg-green-500/20 text-green-400'
            }`}
            onClick={handlePauseSystem}
          >
            <Pause className="w-5 h-5" />
            <span className="text-xs">{isMonitoring ? 'Pause System' : 'Resume System'}</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 flex flex-col items-center justify-center space-y-1 border-gray-500/50 hover:bg-gray-500/20 text-gray-400"
            onClick={handleResetAll}
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
  );
};

export default SignalControlPanel;
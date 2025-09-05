
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrafficCone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SignalCard = ({ signal, onControl, controlMode, isMonitoring }) => {
  const { toast } = useToast();
  
  const getSignalColor = (status) => {
    if (!isMonitoring) return 'bg-gray-700';
    switch (status) {
      case 'green': return 'bg-green-500 shadow-lg shadow-green-500/50';
      case 'yellow': return 'bg-yellow-500 shadow-lg shadow-yellow-500/50';
      case 'red': return 'bg-red-500 shadow-lg shadow-red-500/50';
      default: return 'bg-gray-700';
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'emergency': return 'text-red-400 bg-red-500/10';
      case 'manual': return 'text-blue-400 bg-blue-500/10';
      case 'automatic': return 'text-green-400 bg-green-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };
  
  const handleManualOverride = (newStatus) => {
     if (controlMode === 'manual' && isMonitoring) {
        onControl(signal.id, {type: 'manual_override', payload: newStatus});
     } else {
        toast({ title: 'Manual override disabled', description: 'Switch to Manual mode to control signals.', variant: 'destructive'});
     }
  }

  return (
    <div className={`glass-effect rounded-lg p-4 hover:bg-white/15 transition-all duration-300 ${signal.emergency ? 'border border-red-500/50' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-white">{signal.name}</h4>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getModeColor(controlMode)}`}>
          {signal.emergency ? 'emergency' : controlMode}
        </div>
      </div>

      <div className="flex items-center justify-center mb-4">
        <div className="bg-gray-800 rounded-lg p-3 flex flex-col space-y-2">
          <button onClick={() => handleManualOverride('red')} className={`w-6 h-6 rounded-full border-2 border-gray-600 ${signal.status === 'red' ? getSignalColor('red') : 'bg-gray-700'}`}></button>
          <button onClick={() => handleManualOverride('yellow')} className={`w-6 h-6 rounded-full border-2 border-gray-600 ${signal.status === 'yellow' ? getSignalColor('yellow') : 'bg-gray-700'}`}></button>
          <button onClick={() => handleManualOverride('green')} className={`w-6 h-6 rounded-full border-2 border-gray-600 ${signal.status === 'green' ? getSignalColor('green') : 'bg-gray-700'}`}></button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Current Status</span>
          <span className={`font-medium capitalize ${signal.status === 'green' ? 'text-green-400' : signal.status === 'yellow' ? 'text-yellow-400' : 'text-red-400'}`}>
            {isMonitoring ? signal.status : 'Paused'}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Time Remaining</span>
          <span className="text-white font-medium">{isMonitoring ? `${signal.timing}s` : 'N/A'}</span>
        </div>
        
        {signal.emergency && (
          <div className="mt-3 p-2 bg-red-500/10 rounded border border-red-500/30">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span className="text-xs text-red-400 font-medium">Emergency Override</span>
            </div>
          </div>
        )}

        {!signal.emergency && controlMode === 'manual' && (
          <div className="mt-3 p-2 bg-blue-500/10 rounded border border-blue-500/30">
            <div className="flex items-center space-x-2">
              <TrafficCone className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-blue-400 font-medium">Manual Control</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignalCard;

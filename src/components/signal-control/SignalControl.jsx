
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import SignalControlHeader from '@/components/signal-control/SignalControlHeader.jsx';
import EmergencyOverrideAlert from '@/components/signal-control/EmergencyOverrideAlert.jsx';
import SignalStats from '@/components/signal-control/SignalStats.jsx';
import SignalGrid from '@/components/signal-control/SignalGrid.jsx';
import SignalControlPanel from '@/components/signal-control/SignalControlPanel.jsx';
import { getInitialSignals, getNextSignalState } from '@/lib/signal-logic';

const SignalControl = ({ emergencyActive, isMonitoring, signals, setSignals, controlMode, setControlMode }) => {
  const { toast } = useToast();
 
  const resetAllSignals = useCallback(() => {
    setSignals(getInitialSignals());
    toast({ title: "All signals reset to default state.", description: "System is running on standard patterns." });
  }, [setSignals, toast]);

  useEffect(() => {
    if (emergencyActive) {
      setSignals(prev => prev.map(signal => {
        if ([1, 2, 3, 4].includes(signal.id)) {
          return { ...signal, status: 'green', mode: 'emergency', timing: 120, emergency: true };
        }
        return { ...signal, status: 'red', mode: 'emergency', timing: 120, emergency: false };
      }));
    } else {
      setSignals(prev => prev.map(s => ({ ...s, mode: controlMode, emergency: false })));
    }
  }, [emergencyActive, controlMode]);

  useEffect(() => {
    let interval;
    if (isMonitoring && controlMode === 'automatic') {
      interval = setInterval(() => {
        setSignals(prevSignals => prevSignals.map(signal => {
          if (signal.mode === 'emergency') return signal;
          return getNextSignalState(signal);
        }));
      }, 1000);
    } else {
        setSignals(prev => prev.map(s => ({ ...s, timing: 'N/A' })));
    }
    return () => clearInterval(interval);
  }, [isMonitoring, controlMode]);


  const handleSignalControl = (signalId, action) => {
    if (action === 'manual_override' && controlMode === 'manual') {
      setSignals(prev => prev.map(s => s.id === signalId ? {...s, status: action.payload} : s));
      toast({title: `Signal ${signalId} manually set to ${action.payload}`});
    } else {
      toast({ 
        title: `Action '${action}' unavailable in ${controlMode} mode.`
      });
    }
  };

  const handleSystemAction = (action) => {
    switch(action) {
      case 'reset':
        resetAllSignals();
        break;
      default:
        toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
    }
  };
  
  const handleControlModeChange = (mode) => {
    setControlMode(mode);
    setSignals(prev => prev.map(s => ({...s, mode})));
    toast({ title: `Signal control mode changed to ${mode}.` });
  }

  return (
    <div className="space-y-6">
      <SignalControlHeader controlMode={controlMode} setControlMode={handleControlModeChange} />
      {emergencyActive && <EmergencyOverrideAlert />}
      <SignalStats isMonitoring={isMonitoring}/>
      <SignalGrid signals={signals} onControl={handleSignalControl} controlMode={controlMode} isMonitoring={isMonitoring} />
      <SignalControlPanel onControl={handleSystemAction} />
    </div>
  );
};

export default SignalControl;

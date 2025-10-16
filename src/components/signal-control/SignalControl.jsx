
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import SignalControlHeader from '@/components/signal-control/SignalControlHeader.jsx';
import EmergencyOverrideAlert from '@/components/signal-control/EmergencyOverrideAlert.jsx';
import SignalStats from '@/components/signal-control/SignalStats.jsx';
import SignalGrid from '@/components/signal-control/SignalGrid.jsx';
import SignalControlPanel from '@/components/signal-control/SignalControlPanel.jsx';
import { getInitialSignals, getNextSignalState } from '@/lib/signal-logic';

const SignalControl = ({ 
  emergencyActive, 
  setEmergencyActive, 
  isMonitoring, 
  setIsMonitoring, 
  signals, 
  setSignals, 
  controlMode, 
  setControlMode 
}) => {
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

  const handleSystemAction = (signalId, action) => {
    switch(action) {
      case 'emergency':
        // Emergency mode is handled by the button itself now
        if (emergencyActive) {
          setSignals(prev => prev.map(signal => ({
            ...signal,
            mode: 'automatic',
            emergency: false,
            status: 'green',
            timing: 30
          })));
        } else {
          setSignals(prev => prev.map(signal => {
            if ([1, 2, 3, 4].includes(signal.id)) {
              return { ...signal, status: 'green', mode: 'emergency', timing: 120, emergency: true };
            }
            return { ...signal, status: 'red', mode: 'emergency', timing: 120, emergency: false };
          }));
        }
        break;
      case 'optimize':
        // Optimize all signals for better traffic flow
        setSignals(prev => prev.map(signal => ({
          ...signal,
          timing: Math.floor(Math.random() * 60) + 30, // Random optimized timing 30-90s
          mode: 'optimized'
        })));
        break;
      case 'pause':
        // Pause/resume is handled by the button itself now
        setSignals(prev => prev.map(s => ({ 
          ...s, 
          timing: isMonitoring ? 'N/A' : (s.timing === 'N/A' ? 30 : s.timing)
        })));
        break;
      case 'reset':
        resetAllSignals();
        break;
      default:
        toast({ title: "🚧 Action not recognized", description: `The action "${action}" is not implemented.` });
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
      <SignalControlPanel 
        onControl={handleSystemAction} 
        emergencyActive={emergencyActive}
        setEmergencyActive={setEmergencyActive}
        isMonitoring={isMonitoring}
        setIsMonitoring={setIsMonitoring}
        signals={signals}
      />
    </div>
  );
};

export default SignalControl;

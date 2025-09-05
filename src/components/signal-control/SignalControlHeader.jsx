
import React from 'react';
import { Button } from '@/components/ui/button';
import { Activity, Settings } from 'lucide-react';

const SignalControlHeader = ({ controlMode, setControlMode }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold text-white">Signal Control Center</h2>
        <p className="text-gray-300 mt-1">Real-time traffic signal management and optimization</p>
      </div>
      <div className="flex items-center space-x-4">
        <Button 
          variant={controlMode === 'automatic' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setControlMode('automatic')}
        >
          <Activity className="w-4 h-4 mr-2" />
          Auto Mode
        </Button>
        <Button 
          variant={controlMode === 'manual' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setControlMode('manual')}
        >
          <Settings className="w-4 h-4 mr-2" />
          Manual Mode
        </Button>
      </div>
    </div>
  );
};

export default SignalControlHeader;

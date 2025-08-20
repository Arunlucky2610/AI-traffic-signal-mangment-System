
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, RotateCcw } from 'lucide-react';
import SignalCard from '@/components/signal-control/SignalCard.jsx';
import { useToast } from '@/components/ui/use-toast';

const SignalGrid = ({ signals, onControl, controlMode, isMonitoring }) => {
  const { toast } = useToast();

  const handleOptimizeAll = () => {
    toast({ title: "System is now optimizing all signals for best traffic flow." });
  }

  const handleResetAll = () => {
    onControl('all', 'reset');
  }

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Traffic Signal Status</h3>
        <div className="flex items-center space-x-4">
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleOptimizeAll}
            disabled={controlMode !== 'automatic'}
          >
            <Zap className="w-4 h-4 mr-2" />
            Optimize All
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleResetAll}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {signals.map((signal) => (
          <motion.div
            key={signal.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: signal.id * 0.05 }}
          >
            <SignalCard signal={signal} onControl={onControl} controlMode={controlMode} isMonitoring={isMonitoring}/>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SignalGrid;

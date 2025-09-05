import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const EmergencyOverrideAlert = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="emergency-pulse glass-effect border-red-500/50 rounded-xl p-6"
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-red-400">Emergency Override Active</h3>
          <p className="text-gray-300">All signals on Main Street corridor optimized for emergency vehicle passage</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-red-400">4 SIGNALS</div>
          <div className="text-sm text-gray-400">Under Emergency Control</div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmergencyOverrideAlert;
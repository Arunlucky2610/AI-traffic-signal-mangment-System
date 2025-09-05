import React from 'react';
import { motion } from 'framer-motion';

const EmergencyTypesChart = ({ emergencyTrends }) => {
  return (
    <div className="glass-effect rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Emergency Vehicle Types</h3>
      
      <div className="space-y-4">
        {emergencyTrends.map((trend, index) => (
          <motion.div
            key={trend.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 glass-effect rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${
                trend.type === 'Ambulance' ? 'bg-red-500' :
                trend.type === 'Fire Truck' ? 'bg-orange-500' : 'bg-blue-500'
              }`}></div>
              <span className="text-white font-medium">{trend.type}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-white">{trend.count}</span>
              <span className={`text-sm font-medium ${trend.color}`}>{trend.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="#EF4444"
              strokeWidth="12"
              strokeDasharray="75 25"
              strokeDashoffset="0"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="#F97316"
              strokeWidth="12"
              strokeDasharray="30 70"
              strokeDashoffset="-75"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="12"
              strokeDasharray="17 83"
              strokeDashoffset="-105"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default EmergencyTypesChart;
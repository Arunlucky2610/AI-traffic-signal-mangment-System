import React from 'react';
import { Activity } from 'lucide-react';

const DetailedAnalytics = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Traffic Flow Impact</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Before AI System</span>
              <span className="text-red-400">65% efficiency</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">After AI System</span>
              <span className="text-green-400">83% efficiency</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '83%' }}></div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">+18%</div>
              <div className="text-sm text-gray-300">Overall Improvement</div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Peak Emergency Hours</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 rounded bg-red-500/10">
            <span className="text-gray-300">08:00 - 10:00</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-700 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <span className="text-red-400 text-sm">High</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-2 rounded bg-orange-500/10">
            <span className="text-gray-300">17:00 - 19:00</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-700 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <span className="text-orange-400 text-sm">Medium</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-2 rounded bg-green-500/10">
            <span className="text-gray-300">02:00 - 06:00</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <span className="text-green-400 text-sm">Low</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">System Efficiency</h3>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">98.7%</div>
            <div className="text-sm text-gray-300">Success Rate</div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Successful Clearances</span>
              <span className="text-green-400">227/230</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">False Positives</span>
              <span className="text-yellow-400">2</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">System Downtime</span>
              <span className="text-blue-400">0.2%</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center justify-center space-x-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm">System Operating Optimally</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalytics;
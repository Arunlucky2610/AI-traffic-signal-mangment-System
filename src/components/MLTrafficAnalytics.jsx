import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Target, 
  Clock, 
  BarChart3,
  Activity,
  Zap,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const MLTrafficAnalytics = () => {
  const [mlInsights, setMlInsights] = useState({
    congestionPrediction: 0,
    optimalTiming: [],
    trafficFlow: 0,
    emergencyResponse: 0,
    predictions: []
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulate ML analysis
  useEffect(() => {
    const interval = setInterval(() => {
      setMlInsights({
        congestionPrediction: Math.random() * 100,
        optimalTiming: [
          { intersection: 'Main & 1st', currentTiming: 45, optimalTiming: 38, improvement: 15 },
          { intersection: 'Oak & 2nd', currentTiming: 60, optimalTiming: 52, improvement: 13 },
          { intersection: 'Pine & 3rd', currentTiming: 55, optimalTiming: 47, improvement: 14 }
        ],
        trafficFlow: 65 + Math.random() * 30,
        emergencyResponse: 85 + Math.random() * 10,
        predictions: [
          { time: '2:00 PM', congestion: 45, confidence: 92 },
          { time: '3:00 PM', congestion: 78, confidence: 89 },
          { time: '4:00 PM', congestion: 95, confidence: 94 },
          { time: '5:00 PM', congestion: 88, confidence: 91 },
          { time: '6:00 PM', congestion: 62, confidence: 87 }
        ]
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const runMLAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">ML Traffic Analytics</h2>
            <p className="text-gray-400">AI-powered traffic optimization insights</p>
          </div>
        </div>
        <Button 
          onClick={runMLAnalysis}
          disabled={isAnalyzing}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isAnalyzing ? (
            <>
              <Activity className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Run Analysis
            </>
          )}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-4 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-sm text-gray-400">Next Hour</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">Congestion Risk</h3>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-orange-400">
                {mlInsights.congestionPrediction.toFixed(0)}%
              </span>
              <span className="text-sm text-gray-400 mb-1">predicted</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-4 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-sm text-gray-400">Current</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">Traffic Flow</h3>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-green-400">
                {mlInsights.trafficFlow.toFixed(0)}%
              </span>
              <span className="text-sm text-gray-400 mb-1">optimal</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-4 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm text-gray-400">Average</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">Response Time</h3>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-blue-400">
                {mlInsights.emergencyResponse.toFixed(0)}%
              </span>
              <span className="text-sm text-gray-400 mb-1">efficiency</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-4 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm text-gray-400">ML Model</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">Accuracy</h3>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-purple-400">94.2%</span>
              <span className="text-sm text-gray-400 mb-1">confident</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Optimization Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Optimization Recommendations</h3>
          </div>
          
          <div className="space-y-4">
            {mlInsights.optimalTiming.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 rounded-lg p-4 border border-gray-600"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white">{item.intersection}</h4>
                  <span className="text-green-400 font-semibold">+{item.improvement}%</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Current:</span>
                    <span className="text-white ml-2">{item.currentTiming}s</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Optimal:</span>
                    <span className="text-green-400 ml-2">{item.optimalTiming}s</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Traffic Predictions */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Traffic Predictions</h3>
          </div>
          
          <div className="space-y-3">
            {mlInsights.predictions.map((prediction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-600"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-mono">{prediction.time}</span>
                  <div className="flex items-center gap-1">
                    {prediction.congestion > 80 ? (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    ) : prediction.congestion > 60 ? (
                      <TrendingUp className="w-4 h-4 text-orange-400" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{prediction.congestion}%</span>
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          prediction.congestion > 80 ? 'bg-red-500' :
                          prediction.congestion > 60 ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${prediction.congestion}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{prediction.confidence}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ML Model Performance */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white">ML Model Performance</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-300">Training Metrics</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Accuracy:</span>
                <span className="text-green-400 font-semibold">94.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Precision:</span>
                <span className="text-blue-400 font-semibold">91.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Recall:</span>
                <span className="text-purple-400 font-semibold">93.5%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-300">Model Details</h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">• Deep Neural Network</p>
              <p className="text-gray-400">• 15 Hidden Layers</p>
              <p className="text-gray-400">• Trained on 2M+ samples</p>
              <p className="text-gray-400">• Real-time inference</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-300">Data Sources</h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">• Traffic cameras (24/7)</p>
              <p className="text-gray-400">• Vehicle sensors</p>
              <p className="text-gray-400">• Weather data</p>
              <p className="text-gray-400">• Historical patterns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLTrafficAnalytics;


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Camera, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Brain,
  Target,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const EmergencyDetection = ({ isMonitoring }) => {
  const { toast } = useToast();
  const [detectionStatus, setDetectionStatus] = useState('active');
  const [cameraFeeds, setCameraFeeds] = useState([]);
  const [detectionStats, setDetectionStats] = useState({
    accuracy: 98.7,
    processingTime: 45,
    vehiclesDetected: 1247,
    emergencyDetections: 23,
    falsePositives: 2,
    modelVersion: 'YOLOv8-Emergency-v2.1'
  });

  useEffect(() => {
    // Video file paths from the videos folder
    const videoFiles = [
      '/videos/4K Road traffic video for object detection and tracking - free download now! - Karol Majek (1080p, h264).mp4',
      '/videos/Cars in Highway Traffic (FREE STOCK VIDEO) - Free Stock Videos (1080p, h264).mp4',
      '/videos/Road traffic video for object recognition - Andrey Nikishaev (720p, h264).mp4',
      '/videos/Cars, Busy Streets, City Traffic - No Copyright Royalty Free Stock Videos - Royalty Free Video Libary (1080p, h264).mp4',
      '/videos/Traffic Flow In The Highway - 4K Stock Videos  NoCopyright  AllVideoFree - Free Edit Market (1080p, h264).mp4',
      '/videos/Traffic on Highway in City l Free Stock Footage  No Copyright Videos  Creative Common ! - Video Gallery - No Copyright Footage (720p, h264).mp4'
    ];
    const feeds = [
      { id: 1, name: 'Main St & 1st Ave', status: 'active', confidence: 97.2, lastDetection: '2 min ago', video: videoFiles[0] },
      { id: 2, name: 'Main St & 2nd Ave', status: 'active', confidence: 94.8, lastDetection: '5 min ago', video: videoFiles[1] },
      { id: 3, name: 'Oak St & 3rd Ave', status: 'active', confidence: 99.1, lastDetection: '1 min ago', video: videoFiles[2] },
      { id: 4, name: 'Pine St & 4th Ave', status: 'maintenance', confidence: 0, lastDetection: 'N/A', video: videoFiles[3] },
      { id: 5, name: 'Central Plaza', status: 'active', confidence: 96.5, lastDetection: '3 min ago', video: videoFiles[4] },
      { id: 6, name: 'Hospital District', status: 'active', confidence: 98.9, lastDetection: '30 sec ago', video: videoFiles[5] }
    ];
    setCameraFeeds(feeds);
  }, []);

  useEffect(() => {
    let interval;
    if (isMonitoring) {
      interval = setInterval(() => {
        setDetectionStats(prev => ({
          ...prev,
          vehiclesDetected: prev.vehiclesDetected + Math.floor(Math.random() * 3),
          processingTime: Math.max(30, prev.processingTime + (Math.random() - 0.5) * 10),
          accuracy: Math.min(99.9, Math.max(95, prev.accuracy + (Math.random() - 0.5) * 0.5))
        }));

        setCameraFeeds(prev => prev.map(feed => ({
          ...feed,
          confidence: feed.status === 'active' ? Math.max(90, Math.min(99.9, feed.confidence + (Math.random() - 0.5) * 2)) : 0
        })));
      }, 2000);
    } else {
        setDetectionStats(prev => ({...prev, vehiclesDetected: 0, processingTime: 0 }));
    }

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/10';
      case 'maintenance': return 'text-yellow-400 bg-yellow-500/10';
      case 'offline': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'maintenance': return AlertTriangle;
      case 'offline': return XCircle;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">AI Emergency Detection</h2>
          <p className="text-gray-300 mt-1">Real-time vehicle detection and classification system</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
          >
            <Brain className="w-4 h-4 mr-2" />
            Retrain Model
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
          >
            <Target className="w-4 h-4 mr-2" />
            Calibrate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-right">
              <div className="text-sm text-green-400 font-medium">+0.2%</div>
              <div className="text-xs text-gray-400">vs yesterday</div>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-300">Detection Accuracy</h3>
            <div className="text-2xl font-bold text-white">{detectionStats.accuracy.toFixed(1)}%</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-400 font-medium">-5ms</div>
              <div className="text-xs text-gray-400">vs last hour</div>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-300">Processing Time</h3>
            <div className="text-2xl font-bold text-white">{Math.round(detectionStats.processingTime)}ms</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-400 font-medium">+12</div>
              <div className="text-xs text-gray-400">today</div>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-300">Vehicles Detected</h3>
            <div className="text-2xl font-bold text-white">{detectionStats.vehiclesDetected.toLocaleString()}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-right">
              <div className="text-sm text-red-400 font-medium">+3</div>
              <div className="text-xs text-gray-400">this week</div>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-300">Emergency Detections</h3>
            <div className="text-2xl font-bold text-white">{detectionStats.emergencyDetections}</div>
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Live Camera Feeds</h3>
          <div className="flex items-center space-x-2">
            <div className="status-indicator status-active"></div>
            <span className="text-sm text-gray-300">{cameraFeeds.filter(f => f.status === 'active').length} of {cameraFeeds.length} cameras active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cameraFeeds.map((feed) => {
            const StatusIcon = getStatusIcon(feed.status);
            return (
              <motion.div
                key={feed.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: feed.id * 0.1 }}
                className="glass-effect rounded-lg p-4 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-white">{feed.name}</h4>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feed.status)}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span>{feed.status}</span>
                  </div>
                </div>

                <div className="aspect-video bg-gray-800 rounded-lg mb-3 relative overflow-hidden">
                  {/* Video element for live feed */}
                  <video
                    className="w-full h-full object-cover"
                    src={feed.video}
                    autoPlay={isMonitoring && feed.status === 'active'}
                    loop
                    muted
                    controls={false}
                    playsInline
                    {...(!isMonitoring || feed.status !== 'active' ? { paused: true } : {})}
                    ref={el => {
                      if (el) {
                        if (!isMonitoring || feed.status !== 'active') {
                          el.pause();
                        } else {
                          el.play();
                        }
                      }
                    }}
                  />
                  {feed.status === 'active' && isMonitoring && (
                    <>
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        LIVE
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        AI: {feed.confidence.toFixed(1)}%
                      </div>
                    </>
                  )}
                  {!isMonitoring && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">PAUSED</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Confidence</span>
                    <span className="text-white font-medium">{isMonitoring ? `${feed.confidence.toFixed(1)}%` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Last Detection</span>
                    <span className="text-white font-medium">{isMonitoring ? feed.lastDetection : 'N/A'}</span>
                  </div>
                  {feed.status === 'active' && (
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div 
                        className="bg-green-500 h-1 rounded-full transition-all duration-300" 
                        style={{ width: isMonitoring ? `${feed.confidence}%` : '0%' }}
                      ></div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">AI Model Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Model Version</span>
              <span className="text-white font-mono text-sm">{detectionStats.modelVersion}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Emergency Vehicle Detection</span>
                <span className="text-green-400 font-medium">99.2%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.2%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Regular Vehicle Classification</span>
                <span className="text-blue-400 font-medium">97.8%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '97.8%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">False Positive Rate</span>
                <span className="text-yellow-400 font-medium">0.3%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '0.3%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Detection Categories</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-white">Ambulance</span>
              </div>
              <span className="text-red-400 font-semibold">{isMonitoring ? '12 detected' : '0 detected'}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <span className="text-white">Fire Truck</span>
              </div>
              <span className="text-orange-400 font-semibold">{isMonitoring ? '7 detected' : '0 detected'}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-blue-400" />
                <span className="text-white">Police Vehicle</span>
              </div>
              <span className="text-blue-400 font-semibold">{isMonitoring ? '4 detected' : '0 detected'}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-500/10 rounded-lg border border-gray-500/20">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-gray-400" />
                <span className="text-white">Regular Vehicles</span>
              </div>
              <span className="text-gray-400 font-semibold">{isMonitoring ? '1,224 detected' : '0 detected'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDetection;

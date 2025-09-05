
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Play, Pause, RotateCcw } from 'lucide-react';

const Sidebar = ({ navigationItems, activeTab, setActiveTab, isMonitoring, setIsMonitoring }) => {
  const { toast } = useToast();

  const handleStartMonitoring = () => {
    setIsMonitoring(true);
    toast({ title: "System Monitoring Started", description: "Real-time traffic analysis is now active." });
  };

  const handlePauseSystem = () => {
    setIsMonitoring(false);
    toast({ title: "System Monitoring Paused", description: "Real-time analysis is temporarily stopped.", variant: "destructive" });
  };

  const handleResetSignals = () => {
    toast({ title: "Signal Reset Initiated", description: "All signals are returning to default patterns." });
  };
  
  return (
    <nav className="w-64 glass-effect border-r border-white/10 min-h-screen">
      <div className="p-6">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 p-4 glass-effect rounded-lg">
          <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button 
              size="sm" 
              className="w-full justify-start bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30"
              onClick={handleStartMonitoring}
              disabled={isMonitoring}
            >
              <Play className="w-4 h-4 mr-2" />
              Start Monitoring
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full justify-start"
              onClick={handlePauseSystem}
              disabled={!isMonitoring}
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause System
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleResetSignals}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Signals
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;

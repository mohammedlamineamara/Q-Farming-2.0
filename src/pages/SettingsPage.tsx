import { useState, useEffect } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Wifi,
  MapPin,
  Brain,
  Database,
  Info,
  Sprout,
  Download,
  Trash2,
} from "lucide-react";

export default function SettingsPage() {
  const utils = trpc.useUtils();
  const { data: settingsData } = trpc.settings.get.useQuery();
  const updateSettings = trpc.settings.upsert.useMutation({
    onSuccess: () => utils.settings.get.invalidate(),
  });

  const [localSettings, setLocalSettings] = useState({
    theme: "dark" as "light" | "dark",
    offlineMode: true,
    autoSync: true,
    gpsTracking: true,
    aiNotifications: true,
    predictiveAnalytics: true,
    farmLocation: "Algiers, Algeria",
  });

  useEffect(() => {
    if (settingsData) {
      setLocalSettings({
        theme: settingsData.theme as "light" | "dark",
        offlineMode: settingsData.offlineMode,
        autoSync: settingsData.autoSync,
        gpsTracking: settingsData.gpsTracking,
        aiNotifications: settingsData.aiNotifications,
        predictiveAnalytics: settingsData.predictiveAnalytics,
        farmLocation: settingsData.farmLocation,
      });
    }
  }, [settingsData]);

  const handleToggle = (key: string, value: boolean) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    updateSettings.mutate({ [key]: value });
  };

  const exportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      app: "Q-Farming 2.0",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `q-farming-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500/20 to-gray-500/10 flex items-center justify-center border border-slate-500/20">
          <Settings className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">System Settings</h1>
          <p className="text-sm text-slate-400">Configure your farm management preferences</p>
        </div>
      </div>

      {/* Connectivity */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/8 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Wifi className="w-4 h-4" /> Connectivity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-white font-medium">Offline Mode</Label>
              <p className="text-xs text-slate-400">Work without internet connection</p>
            </div>
            <Switch
              checked={localSettings.offlineMode}
              onCheckedChange={(v) => handleToggle("offlineMode", v)}
            />
          </div>
          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <div>
              <Label className="text-white font-medium">Auto-Sync</Label>
              <p className="text-xs text-slate-400">Sync when connection is available</p>
            </div>
            <Switch
              checked={localSettings.autoSync}
              onCheckedChange={(v) => handleToggle("autoSync", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/8 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-white font-medium">Farm Location</Label>
              <p className="text-xs text-slate-400">{localSettings.farmLocation}</p>
            </div>
            <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white">
              Update
            </Button>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <div>
              <Label className="text-white font-medium">GPS Tracking</Label>
              <p className="text-xs text-slate-400">Track field boundaries and equipment</p>
            </div>
            <Switch
              checked={localSettings.gpsTracking}
              onCheckedChange={(v) => handleToggle("gpsTracking", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Preferences */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/8 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Brain className="w-4 h-4" /> AI Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-white font-medium">AI Notifications</Label>
              <p className="text-xs text-slate-400">Receive AI-powered recommendations</p>
            </div>
            <Switch
              checked={localSettings.aiNotifications}
              onCheckedChange={(v) => handleToggle("aiNotifications", v)}
            />
          </div>
          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <div>
              <Label className="text-white font-medium">Predictive Analytics</Label>
              <p className="text-xs text-slate-400">Enable yield and weather predictions</p>
            </div>
            <Switch
              checked={localSettings.predictiveAnalytics}
              onCheckedChange={(v) => handleToggle("predictiveAnalytics", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/8 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4" /> Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-white font-medium">Export Data</Label>
              <p className="text-xs text-slate-400">Download all farm data</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 gap-2"
              onClick={exportData}
            >
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <div>
              <Label className="text-white font-medium">Clear Cache</Label>
              <p className="text-xs text-slate-400">Reset all local data</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 gap-2"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/8 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4" /> About
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="text-6xl mb-3 mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-emerald-500/20">
              <Sprout className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-1">Q-Farming 2.0</h4>
            <p className="text-sm text-slate-400 mb-1">AI-Powered Smart Agriculture ERP</p>
            <p className="text-xs text-slate-500">Version 2.0.1 | Industrial Engineering Project</p>
            <p className="text-xs text-slate-500 mt-1">Built for Algerian Rural Agriculture</p>
            <div className="flex gap-2 justify-center mt-4">
              <Badge variant="outline" className="bg-white/5 text-slate-400 border-white/10">🌐 Offline Ready</Badge>
              <Badge variant="outline" className="bg-white/5 text-slate-400 border-white/10">🤖 AI Powered</Badge>
              <Badge variant="outline" className="bg-white/5 text-slate-400 border-white/10">📡 IoT Connected</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

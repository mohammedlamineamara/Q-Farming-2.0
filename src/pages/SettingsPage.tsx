import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useTheme } from "@/components/theme-provider";
import { useI18n } from "@/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { RoleBadge } from "@/components/rbac/RoleBadge";
import { hasPermission, type Role, type Permission } from "@/rbac";
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
  Sun,
  Moon,
  Laptop,
  Globe,
  ShieldCheck,
  Check,
  Lock,
  User as UserIcon,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t, language, setLanguage } = useI18n();
  const utils = trpc.useUtils();

  const userRole = (user?.role as Role) || "worker";

  const keyPermissions: { key: string; perm: Permission; labelKey: string }[] = [
    { key: "dashboard", perm: "dashboard.view", labelKey: "rbac.myRole.capabilities.dashboardView" },
    { key: "fieldsManage", perm: "fields.create", labelKey: "rbac.myRole.capabilities.fieldsManage" },
    { key: "fieldsDelete", perm: "fields.delete", labelKey: "rbac.myRole.capabilities.fieldsDelete" },
    { key: "inventoryManage", perm: "inventory.create", labelKey: "rbac.myRole.capabilities.inventoryManage" },
    { key: "inventoryDelete", perm: "inventory.delete", labelKey: "rbac.myRole.capabilities.inventoryDelete" },
    { key: "sensorsManage", perm: "sensors.read", labelKey: "rbac.myRole.capabilities.sensorsManage" },
    { key: "workersView", perm: "workers.view", labelKey: "rbac.myRole.capabilities.workersView" },
    { key: "workersManage", perm: "workers.create", labelKey: "rbac.myRole.capabilities.workersManage" },
    { key: "workersDelete", perm: "workers.delete", labelKey: "rbac.myRole.capabilities.workersDelete" },
    { key: "analyticsView", perm: "analytics.view", labelKey: "rbac.myRole.capabilities.analyticsView" },
    { key: "aiInsightsView", perm: "ai.view", labelKey: "rbac.myRole.capabilities.aiInsightsView" },
    { key: "systemAdmin", perm: "system.admin", labelKey: "rbac.myRole.capabilities.systemAdmin" },
  ];
  const { data: settingsData } = trpc.settings.get.useQuery();
  const updateSettings = trpc.settings.upsert.useMutation({
    onSuccess: () => {
      utils.settings.get.invalidate();
      toast.success(t("settings.toasts.settingsUpdated"));
    },
  });

  const [localSettings, setLocalSettings] = useState({
    theme: "system",
    offlineMode: true,
    autoSync: true,
    gpsTracking: true,
    aiNotifications: true,
    predictiveAnalytics: true,
    farmLocation: "Algiers, Algeria",
  });

  const [prevSettingsData, setPrevSettingsData] = useState<typeof settingsData>(undefined);
  if (settingsData !== prevSettingsData) {
    setPrevSettingsData(settingsData);
    if (settingsData) {
      setLocalSettings({
        theme: settingsData.theme || "system",
        offlineMode: settingsData.offlineMode,
        autoSync: settingsData.autoSync,
        gpsTracking: settingsData.gpsTracking,
        aiNotifications: settingsData.aiNotifications,
        predictiveAnalytics: settingsData.predictiveAnalytics,
        farmLocation: settingsData.farmLocation,
      });
    }
  }

  const handleToggle = (key: string, value: boolean) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    updateSettings.mutate({ [key]: value });
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    setLocalSettings({ ...localSettings, theme: newTheme });
    updateSettings.mutate({ theme: newTheme === "system" ? "light" : newTheme });
  };

  const exportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      app: "Q-Farming 2.0",
      settings: localSettings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `q-farming-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("settings.toasts.dataExported"));
  };

  const clearCache = () => {
    localStorage.removeItem("q-farming-cache");
    toast.success(t("settings.toasts.cacheCleared"));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t("settings.title")}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("settings.subtitle")}</p>
        </div>
      </div>

      {/* User Account & Role Profile */}
      <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> {t("rbac.myRole.title")}
            </CardTitle>
            <RoleBadge role={userRole} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-base shadow-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : <UserIcon className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  {user?.name || "User"}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-normal">
                    {t("rbac.myRole.activeStatus")}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  {user?.email || "user@qfarming.com"}
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 sm:text-end">
              <span className="font-medium text-slate-700 dark:text-slate-300 block">{t("rbac.myRole.systemAccessLevel")}</span>
              <span className="capitalize text-emerald-600 dark:text-emerald-400 font-semibold">{userRole}</span>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
              {t("rbac.myRole.permissionsSummary")}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {keyPermissions.map((item) => {
                const granted = hasPermission(userRole, item.perm);
                return (
                  <div
                    key={item.key}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs border transition-colors ${
                      granted
                        ? "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 text-slate-800 dark:text-slate-200"
                        : "bg-slate-100/50 dark:bg-white/[0.02] border-slate-200/50 dark:border-white/5 text-slate-400 dark:text-slate-500 opacity-75"
                    }`}
                  >
                    <span className="truncate me-2">{t(item.labelKey as "rbac.myRole.capabilities.dashboardView")}</span>
                    {granted ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                        <Check className="w-3 h-3" />
                        {t("rbac.myRole.granted")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 dark:text-slate-500 shrink-0">
                        <Lock className="w-3 h-3" />
                        {t("rbac.myRole.restricted")}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Selection */}
      <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-500" /> {t("settings.languageAndRegion")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[
              { code: "ar" as const, label: t("common.arabic"), native: "العربية", dir: "rtl" },
              { code: "en" as const, label: t("common.english"), native: "English", dir: "ltr" },
              { code: "fr" as const, label: t("common.french"), native: "Français", dir: "ltr" },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                  language === lang.code
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold shadow-xs"
                    : "border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                }`}
              >
                <span className="text-base font-bold mb-0.5">{lang.native}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{lang.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appearance & Theme */}
      <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" /> {t("settings.appearance")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleThemeChange("light")}
              className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                theme === "light"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold"
                  : "border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Sun className="w-5 h-5 mb-1.5 text-amber-500" />
              <span className="text-sm">{t("settings.lightMode")}</span>
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                theme === "dark"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold"
                  : "border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Moon className="w-5 h-5 mb-1.5 text-cyan-500 dark:text-cyan-400" />
              <span className="text-sm">{t("settings.darkMode")}</span>
            </button>
            <button
              onClick={() => handleThemeChange("system")}
              className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                theme === "system"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold"
                  : "border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Laptop className="w-5 h-5 mb-1.5 text-slate-400" />
              <span className="text-sm">{t("settings.system")}</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Connectivity */}
      <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Wifi className="w-4 h-4 text-blue-500" /> {t("settings.connectivity")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-slate-900 dark:text-white font-medium text-sm">{t("settings.offlineMode")}</Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("settings.offlineModeDesc")}</p>
            </div>
            <Switch
              checked={localSettings.offlineMode}
              onCheckedChange={(v) => handleToggle("offlineMode", v)}
            />
          </div>
          <div className="flex items-center justify-between py-2 border-t border-slate-200/80 dark:border-white/5">
            <div>
              <Label className="text-slate-900 dark:text-white font-medium text-sm">{t("settings.autoSync")}</Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("settings.autoSyncDesc")}</p>
            </div>
            <Switch
              checked={localSettings.autoSync}
              onCheckedChange={(v) => handleToggle("autoSync", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500" /> {t("settings.farmLocationTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-slate-900 dark:text-white font-medium text-sm">{t("settings.primaryLocation")}</Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">{localSettings.farmLocation}</p>
            </div>
            <Button variant="outline" size="sm" className="border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer">
              {t("settings.updateGps")}
            </Button>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-slate-200/80 dark:border-white/5">
            <div>
              <Label className="text-slate-900 dark:text-white font-medium text-sm">{t("settings.gpsTracking")}</Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("settings.gpsTrackingDesc")}</p>
            </div>
            <Switch
              checked={localSettings.gpsTracking}
              onCheckedChange={(v) => handleToggle("gpsTracking", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Preferences */}
      <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Brain className="w-4 h-4 text-cyan-500" /> {t("settings.aiTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-slate-900 dark:text-white font-medium text-sm">{t("settings.aiNotifications")}</Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("settings.aiNotificationsDesc")}</p>
            </div>
            <Switch
              checked={localSettings.aiNotifications}
              onCheckedChange={(v) => handleToggle("aiNotifications", v)}
            />
          </div>
          <div className="flex items-center justify-between py-2 border-t border-slate-200/80 dark:border-white/5">
            <div>
              <Label className="text-slate-900 dark:text-white font-medium text-sm">{t("settings.predictiveAnalytics")}</Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("settings.predictiveAnalyticsDesc")}</p>
            </div>
            <Switch
              checked={localSettings.predictiveAnalytics}
              onCheckedChange={(v) => handleToggle("predictiveAnalytics", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-500" /> {t("settings.dataManagement")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-slate-900 dark:text-white font-medium text-sm">{t("settings.exportFarmData")}</Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("settings.exportFarmDataDesc")}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 gap-2 font-medium cursor-pointer"
              onClick={exportData}
            >
              <Download className="w-4 h-4" /> {t("settings.exportJson")}
            </Button>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-slate-200/80 dark:border-white/5">
            <div>
              <Label className="text-slate-900 dark:text-white font-medium text-sm">{t("settings.clearLocalCache")}</Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("settings.clearLocalCacheDesc")}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20 gap-2 font-medium cursor-pointer"
              onClick={clearCache}
            >
              <Trash2 className="w-4 h-4" /> {t("settings.clearCacheBtn")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-500" /> {t("settings.aboutTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Q-Farming 2.0</h4>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t("settings.aboutSubtitle")}</p>
            <p className="text-xs text-slate-500">{t("settings.version")}</p>
            <p className="text-xs text-slate-500 mt-0.5">{t("settings.optimizedFor")}</p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <Badge variant="outline" className="bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10">{t("settings.badges.offlineReady")}</Badge>
              <Badge variant="outline" className="bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10">{t("settings.badges.aiPrecision")}</Badge>
              <Badge variant="outline" className="bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10">{t("settings.badges.iotTelemetry")}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

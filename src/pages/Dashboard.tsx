import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/i18n";
import {
  Sprout,
  Droplets,
  Sun,
  TrendingUp,
  Activity,
  Radio,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Wind,
  Eye,
} from "lucide-react";

export default function Dashboard() {
  const { data: dashboard } = trpc.analytics.dashboard.useQuery();
  const { data: activities } = trpc.activities.list.useQuery();
  const { data: sensors } = trpc.sensors.list.useQuery();
  const { t, language } = useI18n();

  const kpiCards = [
    {
      title: t("dashboard.fieldsCard"),
      value: String(dashboard?.activeFields ?? 0),
      unit: t("dashboard.fieldsCard"),
      icon: Sprout,
      trend: `${dashboard?.avgProgress ?? 0}%`,
      trendUp: true,
      color: "emerald",
      sub: t("dashboard.fieldsSub"),
    },
    {
      title: t("dashboard.sensorsCard"),
      value: String(dashboard?.totalSensors ?? 0),
      unit: t("dashboard.sensorsCard"),
      icon: Radio,
      trend: t("dashboard.live"),
      trendUp: true,
      color: "cyan",
      sub: t("dashboard.sensorsSub"),
    },
    {
      title: t("dashboard.workersCard"),
      value: String(dashboard?.totalWorkers ?? 0),
      unit: t("dashboard.workersCard"),
      icon: Activity,
      trend: t("common.active"),
      trendUp: true,
      color: "amber",
      sub: t("dashboard.workersSub"),
    },
    {
      title: t("dashboard.inventoryCard"),
      value: String(dashboard?.totalInventory ?? 0),
      unit: t("common.items"),
      icon: TrendingUp,
      trend: `${dashboard?.lowStockCount ?? 0} ${t("dashboard.lowStockNotice")}`,
      trendUp: false,
      color: "blue",
      sub: t("dashboard.inventorySub"),
    },
  ];

  const quickActions = [
    { icon: Droplets, label: t("dashboard.startIrrigation"), sub: t("dashboard.startIrrigationSub"), color: "cyan" },
    { icon: Zap, label: t("dashboard.applyFertilizer"), sub: t("dashboard.applyFertilizerSub"), color: "amber" },
    { icon: Sprout, label: t("dashboard.logHarvest"), sub: t("dashboard.logHarvestSub"), color: "emerald" },
    { icon: Activity, label: t("dashboard.setAlert"), sub: t("dashboard.setAlertSub"), color: "red" },
  ];

  const weatherForecast = [
    { day: t("dashboard.tomorrow"), icon: "🌤️", temp: "34°C" },
    { day: t("dashboard.wed"), icon: "⛅", temp: "31°C" },
    { day: t("dashboard.thu"), icon: "🌧️", temp: "28°C" },
    { day: t("dashboard.fri"), icon: "☀️", temp: "33°C" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 dark:from-emerald-950/80 dark:via-slate-900/90 dark:to-slate-950 border border-emerald-500/20 p-6 lg:p-8 text-white shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {t("dashboard.heroBadge")}
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white mb-2">
              {t("dashboard.greeting")}
            </h1>
            <p className="text-slate-300 max-w-lg text-sm leading-relaxed">
              {t("dashboard.heroSubtitle", { count: dashboard?.activeFields ?? 0 })}
            </p>
          </div>
          <div className="flex gap-6 lg:gap-8 bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-black text-emerald-400">{dashboard?.activeFields ?? 0}</div>
              <div className="text-xs text-slate-300 uppercase tracking-wider mt-1 font-medium">{t("dashboard.activeFields")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-black text-cyan-400">{dashboard?.totalSensors ?? 0}</div>
              <div className="text-xs text-slate-300 uppercase tracking-wider mt-1 font-medium">{t("dashboard.totalSensors")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-black text-amber-400">{dashboard?.efficiency ?? 87}%</div>
              <div className="text-xs text-slate-300 uppercase tracking-wider mt-1 font-medium">{t("dashboard.efficiency")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card
            key={kpi.title}
            className="group bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg shadow-xs cursor-pointer"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                  <kpi.icon className="w-5 h-5" />
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs font-semibold ${
                    kpi.trendUp
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                  }`}
                >
                  {kpi.trendUp ? <ArrowUpRight className="w-3 h-3 me-0.5" /> : <ArrowDownRight className="w-3 h-3 me-0.5" />}
                  {kpi.trend}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">{kpi.value}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">{kpi.unit}</div>
              <div className="text-xs text-slate-400 dark:text-slate-500">{kpi.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
            <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            {t("dashboard.quickOperations")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 hover:border-emerald-500/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/10 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-xs"
              >
                <action.icon className="w-7 h-7 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-white">{action.label}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{action.sub}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two Column: Activity + Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center justify-between text-slate-900 dark:text-white">
              <span className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                {t("dashboard.recentOperations")}
              </span>
              <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 text-xs font-semibold">
                {t("dashboard.activityBadge")}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(!activities || activities.length === 0) && (
              <div className="text-center py-6 text-sm text-slate-400">{t("dashboard.noActivities")}</div>
            )}
            {activities?.slice(0, 6).map((activity, i) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 hover:bg-slate-100/80 dark:hover:bg-white/10 transition-all cursor-pointer hover:translate-x-0.5 group"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${
                    activity.type === "success"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : activity.type === "warning"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : activity.type === "danger"
                      ? "bg-red-500/15 text-red-600 dark:text-red-400"
                      : "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                    {activity.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(activity.createdAt).toLocaleDateString(
                      language === "ar" ? "ar-DZ" : language === "fr" ? "fr-FR" : "en-US"
                    )}{" "}
                    {new Date(activity.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    i < 2 ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                  }`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weather Widget */}
        <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
              <Sun className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              {t("dashboard.weatherForecast")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
              <span className="text-5xl">☀️</span>
              <div className="flex-1">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">32°C</div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-300">{t("nav.algiersRegion")}</div>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-blue-500" /> {t("nav.humidity")}</span>
                  <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-cyan-500" /> {t("nav.wind")}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-slate-400" /> 10 km</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {weatherForecast.map((day) => (
                <div
                  key={day.day}
                  className="flex-1 text-center p-3 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="text-2xl mb-1">{day.icon}</div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{day.day}</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{day.temp}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sensor Summary */}
      <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
            <Radio className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
            {t("sensors.liveTelemetry")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {sensors?.slice(0, 8).map((sensor) => {
              const pct = Math.min((Number(sensor.value) / sensor.max) * 100, 100);
              const circumference = 2 * Math.PI * 34;
              const offset = circumference - (pct / 100) * circumference;
              return (
                <div
                  key={sensor.id}
                  className="text-center p-3 rounded-xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 hover:border-emerald-500/30 transition-all shadow-2xs"
                >
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" className="stroke-slate-200 dark:stroke-white/10" strokeWidth="6" />
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        fill="none"
                        stroke={sensor.color}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{sensor.value}</span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                    {sensor.icon} {sensor.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{sensor.unit}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

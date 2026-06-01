import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const kpiCards = [
  {
    title: "Fields",
    value: String(dashboard?.activeFields ?? 0),
    unit: "Fields",
    icon: Sprout,
    trend: `${dashboard?.avgProgress ?? 0}%`,
    trendUp: true,
    color: "emerald",
    sub: "Farm fields",
  },
  {
    title: "Sensors",
    value: String(dashboard?.totalSensors ?? 0),
    unit: "Sensors",
    icon: Radio,
    trend: "Live",
    trendUp: true,
    color: "cyan",
    sub: "Connected devices",
  },
  {
    title: "Workers",
    value: String(dashboard?.totalWorkers ?? 0),
    unit: "Workers",
    icon: Activity,
    trend: "Active",
    trendUp: true,
    color: "amber",
    sub: "Farm staff",
  },
  {
    title: "Inventory",
    value: String(dashboard?.totalInventory ?? 0),
    unit: "Items",
    icon: TrendingUp,
    trend: `${dashboard?.lowStockCount ?? 0} Low`,
    trendUp: false,
    color: "blue",
    sub: "Inventory stock",
  },
];


  const quickActions = [
    { icon: Droplets, label: "Start Irrigation", sub: "Field A scheduled", color: "cyan" },
    { icon: Zap, label: "Apply Fertilizer", sub: "NPK recommended", color: "amber" },
    { icon: Sprout, label: "Log Harvest", sub: "Field C ready", color: "emerald" },
    { icon: Activity, label: "Set Alert", sub: "Weather warning", color: "red" },
  ];

  const weatherForecast = [
    { day: "Tomorrow", icon: "🌤️", temp: "34°C" },
    { day: "Wed", icon: "⛅", temp: "31°C" },
    { day: "Thu", icon: "🌧️", temp: "28°C" },
    { day: "Fri", icon: "☀️", temp: "33°C" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-slate-800/80 border border-white/10 p-6 lg:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Good Morning, Farm Manager</h1>
            <p className="text-slate-400 max-w-lg">
              Your AI-powered agriculture dashboard is live. All systems operational across {dashboard?.activeFields ?? 0} active fields.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AI Optimization Active
            </div>
          </div>
          <div className="flex gap-6 lg:gap-8">
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-gradient">{dashboard?.activeFields ?? 0}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Active Fields</div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-gradient">{dashboard?.totalSensors ?? 0}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">IoT Sensors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-gradient">{dashboard?.efficiency ?? 87}%</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Efficiency</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card
            key={kpi.title}
            className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/8 backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5 cursor-pointer"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-${kpi.color}-500/15 flex items-center justify-center shadow-lg shadow-${kpi.color}-500/10`}>
                  <kpi.icon className={`w-5 h-5 text-${kpi.color}-400`} />
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs font-semibold ${
                    kpi.trendUp
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}
                >
                  {kpi.trendUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                  {kpi.trend}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-white mb-0.5">{kpi.value}</div>
              <div className="text-sm text-slate-400 mb-1">{kpi.unit}</div>
              <div className="text-xs text-slate-500">{kpi.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/8 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/8 hover:border-emerald-500/30 hover:bg-gradient-to-br hover:from-emerald-500/5 hover:to-cyan-500/5 transition-all duration-300 hover:-translate-y-1"
              >
                <action.icon className={`w-7 h-7 text-${action.color}-400 group-hover:scale-110 transition-transform`} />
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white">{action.label}</span>
                <span className="text-xs text-slate-500">{action.sub}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two Column: Activity + Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/8 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Recent Activity
              </span>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse mr-1.5" />
                LIVE
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activities?.slice(0, 6).map((activity, i) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer hover:translate-x-1 group"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${
                    activity.type === "success"
                      ? "bg-emerald-500/15"
                      : activity.type === "warning"
                      ? "bg-amber-500/15"
                      : activity.type === "danger"
                      ? "bg-red-500/15"
                      : "bg-blue-500/15"
                  }`}
                >
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                    {activity.title}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(activity.createdAt).toLocaleDateString()} {new Date(activity.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    i < 2 ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
                  }`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weather Widget */}
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/8 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-400" />
              Weather Forecast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-5xl">☀️</span>
              <div className="flex-1">
                <div className="text-3xl font-bold text-white">32°C</div>
                <div className="text-sm text-slate-400">Sunny - Algiers, Algeria</div>
                <div className="flex gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> 45% Humidity</span>
                  <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> 12km/h NE</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> 10km</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {weatherForecast.map((day) => (
                <div
                  key={day.day}
                  className="flex-1 text-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="text-2xl mb-1">{day.icon}</div>
                  <div className="text-xs text-slate-400">{day.day}</div>
                  <div className="text-sm font-semibold text-slate-200 mt-1">{day.temp}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sensor Summary */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/8 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            Sensor Network Overview
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
                  className="text-center p-3 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/20 transition-all"
                >
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
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
                        style={{ filter: `drop-shadow(0 0 6px ${sensor.color})` }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{sensor.value}</span>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-slate-300">
                    {sensor.icon} {sensor.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{sensor.unit}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

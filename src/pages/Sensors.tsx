import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, Activity } from "lucide-react";

export default function Sensors() {
  const { data: sensors, isLoading } = trpc.sensors.list.useQuery();
  const { data: trend } = trpc.analytics.sensorTrend.useQuery();

  const [period, setPeriod] = useState("24h");

  const statusColors: Record<string, string> = {
    optimal: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    critical: "bg-red-500/15 text-red-400 border-red-500/20",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 flex items-center justify-center border border-cyan-500/20">
            <Radio className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">IoT Sensor Network</h1>
            <p className="text-sm text-slate-400">Real-time monitoring of your farm sensors</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-pulse mr-2" />
          LIVE DATA
        </Badge>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="bg-slate-800/40 border-white/5 animate-pulse h-56" />
          ))}
        {sensors?.map((sensor) => {
          const pct = Math.min((Number(sensor.value) / sensor.max) * 100, 100);
          const circumference = 2 * Math.PI * 34;
          const offset = circumference - (pct / 100) * circumference;
          return (
            <Card
              key={sensor.id}
              className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/8 backdrop-blur-xl hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-5 text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
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
                    <span className="text-base font-bold text-white">{sensor.value}</span>
                  </div>
                </div>
                <div className="text-sm font-semibold text-slate-300 mb-1">
                  {sensor.icon} {sensor.name}
                </div>
                <Badge variant="outline" className={statusColors[sensor.status]}>
                  {sensor.status.toUpperCase()}
                </Badge>
                <div className="text-xs text-slate-500 mt-1.5">{sensor.unit}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sensor Trend Chart */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/8 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Sensor Data Trends
          </CardTitle>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/30"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </CardHeader>
        <CardContent>
          <div className="h-48 relative">
            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sensorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[0, 50, 100, 150].map((y) => (
                <line
                  key={y}
                  x1="30"
                  y1={y + 20}
                  x2="580"
                  y2={y + 20}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              ))}
              {/* Area */}
              {trend && (
                <>
                  <path
                    d={`M 30 ${180 - (trend[0] / 100) * 160} ${trend
                      .map((v, i) => `L ${30 + (i / (trend.length - 1)) * 550} ${180 - (v / 100) * 160}`)
                      .join(" ")} L 580 200 L 30 200 Z`}
                    fill="url(#sensorGrad)"
                  />
                  <path
                    d={`M 30 ${180 - (trend[0] / 100) * 160} ${trend
                      .map((v, i) => `L ${30 + (i / (trend.length - 1)) * 550} ${180 - (v / 100) * 160}`)
                      .join(" ")}`}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: "drop-shadow(0 0 8px #10b981)" }}
                  />
                  {trend.map((v, i) => (
                    <circle
                      key={i}
                      cx={30 + (i / (trend.length - 1)) * 550}
                      cy={180 - (v / 100) * 160}
                      r="4"
                      fill="#10b981"
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                  ))}
                </>
              )}
            </svg>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

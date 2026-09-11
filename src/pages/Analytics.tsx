import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/i18n";
import { BarChart3, TrendingUp, Sprout, Droplets, Zap } from "lucide-react";

export default function Analytics() {
  const [period, setPeriod] = useState("7");
  const { t } = useI18n();
  const { data: yieldData } = trpc.analytics.yieldTrend.useQuery();
  const { data: revenueData } = trpc.analytics.revenueTrend.useQuery();

  const maxRevenue = 1400;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center border border-amber-500/20 text-amber-600 dark:text-amber-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t("analytics.title")}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("analytics.subtitle")}</p>
          </div>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500/30 shadow-xs cursor-pointer"
        >
          <option value="7">{t("analytics.last7Days")}</option>
          <option value="30">{t("analytics.last30Days")}</option>
          <option value="90">{t("analytics.lastQuarter")}</option>
          <option value="365">{t("analytics.lastYear")}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield Chart */}
        <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
              <Sprout className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              {t("analytics.yieldPerformance")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 flex items-end justify-around gap-2 px-2">
              {yieldData?.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                  <div className="flex gap-[3px] items-end h-28">
                    <div
                      className="w-3 rounded-t-md bg-gradient-to-t from-[#2d6a4f] to-[#40916c] transition-all duration-500 group-hover:brightness-125 relative"
                      style={{
                        height: `${d.wheat}%`,
                        animation: `barGrow 0.8s ease-out ${i * 0.1}s both`,
                      }}
                    >
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.wheat}
                      </span>
                    </div>
                    <div
                      className="w-3 rounded-t-md bg-gradient-to-t from-[#40916c] to-[#52b788] transition-all duration-500 group-hover:brightness-125 relative"
                      style={{
                        height: `${d.barley}%`,
                        animation: `barGrow 0.8s ease-out ${i * 0.1 + 0.05}s both`,
                      }}
                    >
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.barley}
                      </span>
                    </div>
                    <div
                      className="w-3 rounded-t-md bg-gradient-to-t from-[#74c69d] to-[#95d5b2] transition-all duration-500 group-hover:brightness-125 relative"
                      style={{
                        height: `${d.oats}%`,
                        animation: `barGrow 0.8s ease-out ${i * 0.1 + 0.1}s both`,
                      }}
                    >
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.oats}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{d.label}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2d6a4f]" /> {t("fields.crops.wheat")}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#40916c]" /> {t("fields.crops.barley")}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#74c69d]" /> {t("fields.crops.oats")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Resource Efficiency */}
        <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
              <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              {t("analytics.resourceEfficiency")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { name: t("analytics.waterEfficiency"), value: 87, color: "from-cyan-500 to-blue-500", icon: Droplets },
              { name: t("analytics.fertilizerUtilization"), value: 72, color: "from-amber-500 to-orange-500", icon: Zap },
              { name: t("analytics.energyConsumption"), value: 65, color: "from-emerald-500 to-cyan-500", icon: TrendingUp },
            ].map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    {item.name}
                  </span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{item.value}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 relative`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend */}
      <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
            <TrendingUp className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
            {t("analytics.revenueTrend")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 relative">
            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
              </defs>
              {revenueData && (
                <>
                  <path
                    d={`M 30 ${200 - (revenueData[0].value / maxRevenue) * 180} ${revenueData
                      .map((d, i) => `L ${30 + (i / (revenueData.length - 1)) * 540} ${200 - (d.value / maxRevenue) * 180}`)
                      .join(" ")} L 570 200 L 30 200 Z`}
                    fill="url(#revenueGrad)"
                  />
                  <path
                    d={`M 30 ${200 - (revenueData[0].value / maxRevenue) * 180} ${revenueData
                      .map((d, i) => `L ${30 + (i / (revenueData.length - 1)) * 540} ${200 - (d.value / maxRevenue) * 180}`)
                      .join(" ")}`}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {revenueData.map((d, i) => (
                    <circle
                      key={i}
                      cx={30 + (i / (revenueData.length - 1)) * 540}
                      cy={200 - (d.value / maxRevenue) * 180}
                      r="4"
                      fill="#06b6d4"
                      className="stroke-white dark:stroke-slate-900"
                      strokeWidth="2"
                    />
                  ))}
                </>
              )}
            </svg>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {revenueData?.map((d) => (
              <div key={d.month} className="text-center">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">{d.month}</div>
                <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">{d.value}K</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

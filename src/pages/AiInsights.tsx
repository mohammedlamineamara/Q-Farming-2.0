import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/i18n";
import { Brain, Sparkles, TrendingUp, Droplets, Sprout, AlertTriangle } from "lucide-react";

export default function AiInsightsPage() {
  const { t } = useI18n();
  const { data: insights } = trpc.aiInsights.list.useQuery();

  const iconMap: Record<string, { icon: typeof Droplets; color: string }> = {
    water: { icon: Droplets, color: "text-cyan-400" },
    harvest: { icon: Sprout, color: "text-emerald-400" },
    fertilizer: { icon: Sparkles, color: "text-purple-400" },
    weather: { icon: AlertTriangle, color: "text-amber-400" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center border border-violet-500/20 text-violet-600 dark:text-violet-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t("aiInsights.title")}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("aiInsights.subtitle")}</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {t("aiInsights.analysisReady")}
        </div>
      </div>

      {/* AI Insight Cards */}
      <div className="space-y-4">
        {insights?.map((insight) => {
          const mapped = iconMap[insight.category] || { icon: Sparkles, color: "text-emerald-500 dark:text-emerald-400" };
          const Icon = mapped.icon;
          return (
            <Card
              key={insight.id}
              className="group bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-emerald-500/15 backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-200 shadow-xs"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    <Icon className={`w-5 h-5 ${mapped.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-emerald-700 dark:text-emerald-400 mb-1.5">{insight.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{insight.content}</p>
                    <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                      <Sparkles className="w-3 h-3" />
                      {t("aiInsights.confidence", { percent: insight.confidence })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
              <Brain className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              {t("aiInsights.predictionAccuracy")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-6">
            <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">92.4%</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t("aiInsights.historicalQuarter")}</div>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">94%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t("aiInsights.yield")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">89%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t("aiInsights.weather")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">91%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t("aiInsights.resources")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
              <TrendingUp className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              {t("aiInsights.impactMetrics")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 py-2">
            {[
              { label: t("aiInsights.estimatedSavings"), value: "+187K DZD", color: "text-emerald-600 dark:text-emerald-400" },
              { label: t("aiInsights.yieldImprovement"), value: "+8.3%", color: "text-emerald-600 dark:text-emerald-400" },
              { label: t("aiInsights.waterOptimization"), value: "-12%", color: "text-cyan-600 dark:text-cyan-400" },
              { label: t("aiInsights.resourceEfficiency"), value: "+15%", color: "text-blue-600 dark:text-blue-400" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5 last:border-0">
                <span className="text-sm text-slate-600 dark:text-slate-400">{item.label}</span>
                <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

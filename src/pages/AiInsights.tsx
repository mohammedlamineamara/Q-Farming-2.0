import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Sparkles, TrendingUp, Droplets, Sprout, AlertTriangle } from "lucide-react";

export default function AiInsightsPage() {
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 flex items-center justify-center border border-violet-500/20">
            <Brain className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Optimization & Predictions</h1>
            <p className="text-sm text-slate-400">AI-powered recommendations for your farm</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          AI Engine Active
        </div>
      </div>

      {/* AI Insight Cards */}
      <div className="space-y-4">
        {insights?.map((insight) => {
          const mapped = iconMap[insight.category] || { icon: Sparkles, color: "text-emerald-400" };
          const Icon = mapped.icon;
          return (
            <Card
              key={insight.id}
              className="group bg-gradient-to-r from-emerald-500/5 via-cyan-500/3 to-transparent border-emerald-500/15 backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-300 hover:translate-x-1"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                    <Icon className={`w-5 h-5 ${mapped.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-emerald-400 mb-2">{insight.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{insight.content}</p>
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      <Sparkles className="w-3 h-3" />
                      {insight.confidence}% Confidence
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
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/8 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5 text-emerald-400" />
              AI Prediction Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-6">
            <div className="text-5xl font-bold text-gradient mb-2">92.4%</div>
            <div className="text-sm text-slate-400 mb-6">Overall AI prediction accuracy this quarter</div>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">94%</div>
                <div className="text-xs text-slate-500 mt-1">Yield</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">89%</div>
                <div className="text-xs text-slate-500 mt-1">Weather</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">91%</div>
                <div className="text-xs text-slate-500 mt-1">Resources</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/8 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              AI Revenue Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 py-2">
            {[
              { label: "Cost Savings (AI Optimized)", value: "+187K DZD", color: "text-emerald-400" },
              { label: "Yield Improvement", value: "+8.3%", color: "text-emerald-400" },
              { label: "Water Reduction", value: "-12%", color: "text-cyan-400" },
              { label: "Resource Efficiency", value: "+15%", color: "text-blue-400" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-400">{item.label}</span>
                <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

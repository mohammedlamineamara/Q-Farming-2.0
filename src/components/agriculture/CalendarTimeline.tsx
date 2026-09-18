import { useI18n } from "@/i18n";
import { Badge } from "@/components/ui/badge";

interface Phase {
  phase: "sowing" | "vegetative" | "flowering" | "maturation" | "harvesting";
  name: { en: string; ar: string; fr: string };
  startMonth: number;
  endMonth: number;
  notes?: { en: string; ar: string; fr: string };
}

interface CalendarTimelineProps {
  phases: Phase[];
}

export function CalendarTimeline({ phases }: CalendarTimelineProps) {
  const { language } = useI18n();

  const monthNamesEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthNamesFr = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  const monthNamesAr = ["جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان", "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  const months = language === "ar" ? monthNamesAr : language === "fr" ? monthNamesFr : monthNamesEn;

  const getPhaseColor = (type: Phase["phase"]) => {
    switch (type) {
      case "sowing":
        return "bg-amber-500 text-white";
      case "vegetative":
        return "bg-emerald-500 text-white";
      case "flowering":
        return "bg-purple-500 text-white";
      case "maturation":
        return "bg-yellow-500 text-slate-900";
      case "harvesting":
        return "bg-red-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  const getPhaseBadge = (type: Phase["phase"]) => {
    switch (type) {
      case "sowing":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
      case "vegetative":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
      case "flowering":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";
      case "maturation":
        return "bg-yellow-500/10 text-yellow-800 dark:text-yellow-400 border-yellow-500/20";
      case "harvesting":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20";
    }
  };

  const isMonthActive = (mIndex: number, phase: Phase) => {
    const month = mIndex + 1;
    if (phase.startMonth <= phase.endMonth) {
      return month >= phase.startMonth && month <= phase.endMonth;
    }
    // Wraps around year (e.g. Oct to Jan: 10 to 1)
    return month >= phase.startMonth || month <= phase.endMonth;
  };

  return (
    <div className="space-y-4">
      {/* 12-Month Matrix */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[600px] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-white/[0.02]">
          {/* Header Months */}
          <div className="grid grid-cols-12 border-b border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 text-center text-xs font-semibold py-2 text-slate-700 dark:text-slate-300">
            {months.map((m, i) => (
              <div key={i} className="px-1 border-r last:border-r-0 border-slate-200 dark:border-white/5">
                {m}
              </div>
            ))}
          </div>

          {/* Phase Rows */}
          <div className="divide-y divide-slate-200/60 dark:divide-white/5">
            {phases.map((phase, pIdx) => (
              <div key={pIdx} className="grid grid-cols-12 py-1.5 items-center">
                {months.map((_, mIdx) => {
                  const active = isMonthActive(mIdx, phase);
                  return (
                    <div key={mIdx} className="px-1 flex justify-center">
                      {active ? (
                        <div
                          className={`w-full h-5 rounded-md text-[10px] font-bold flex items-center justify-center shadow-xs transition-transform hover:scale-105 ${getPhaseColor(
                            phase.phase
                          )}`}
                          title={language === "ar" ? phase.name.ar : language === "fr" ? phase.name.fr : phase.name.en}
                        >
                          •
                        </div>
                      ) : (
                        <div className="w-full h-5" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phase Cards Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {phases.map((phase, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/5 space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {language === "ar" ? phase.name.ar : language === "fr" ? phase.name.fr : phase.name.en}
              </span>
              <Badge variant="outline" className={`text-[10px] font-medium capitalize ${getPhaseBadge(phase.phase)}`}>
                {phase.phase}
              </Badge>
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {months[phase.startMonth - 1]} → {months[phase.endMonth - 1]}
            </div>
            {phase.notes && (
              <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 leading-relaxed border-t border-slate-100 dark:border-white/5">
                {language === "ar" ? phase.notes.ar : language === "fr" ? phase.notes.fr : phase.notes.en}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default CalendarTimeline;

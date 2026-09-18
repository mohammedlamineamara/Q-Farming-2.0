import { useI18n } from "@/i18n";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface AlgerianWilaya {
  code: string;
  name: { en: string; ar: string; fr: string };
  zone: "coastal_tell" | "high_plateaus" | "saharan_oases" | "semi_arid_steppes";
  primaryCrops: string[];
}

interface WilayasPanelProps {
  wilayas: AlgerianWilaya[];
}

export function WilayasPanel({ wilayas }: WilayasPanelProps) {
  const { language } = useI18n();

  const zones: Record<
    AlgerianWilaya["zone"],
    { en: string; ar: string; fr: string; color: string }
  > = {
    coastal_tell: {
      en: "Tellian & Coastal Plain",
      ar: "السهول الساحلية والتلية",
      fr: "Plaine Tellienne et Côtière",
      color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    },
    high_plateaus: {
      en: "High Plateaus (Cereal Steppes)",
      ar: "الهضاب العليا (حزام الحبوب)",
      fr: "Hautes Plaines Céréalières",
      color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    },
    semi_arid_steppes: {
      en: "Semi-Arid Steppes",
      ar: "السهوب شبه الجافة",
      fr: "Steppes Semi-Arides",
      color: "bg-yellow-500/10 text-yellow-800 dark:text-yellow-400 border-yellow-500/20",
    },
    saharan_oases: {
      en: "Saharan Oases & Arid Basins",
      ar: "الواحات الصحراوية والأحواض الجافة",
      fr: "Oasis Sahariennes & Bassins Arides",
      color: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
    },
  };

  const grouped = wilayas.reduce<Record<string, AlgerianWilaya[]>>((acc, w) => {
    acc[w.zone] = acc[w.zone] || [];
    acc[w.zone].push(w);
    return acc;
  }, {});

  const getLocalizedName = (w: AlgerianWilaya) => {
    if (language === "ar") return w.name.ar;
    if (language === "fr") return w.name.fr;
    return w.name.en;
  };

  return (
    <div className="space-y-6">
      {Object.entries(zones).map(([zoneKey, zoneInfo]) => {
        const list = grouped[zoneKey] || [];
        if (list.length === 0) return null;

        const zoneTitle =
          language === "ar"
            ? zoneInfo.ar
            : language === "fr"
            ? zoneInfo.fr
            : zoneInfo.en;

        return (
          <div key={zoneKey} className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-xs font-semibold ${zoneInfo.color}`}>
                {zoneTitle}
              </Badge>
              <span className="text-xs text-slate-400">
                ({list.length} {language === "ar" ? "ولايات" : language === "fr" ? "wilayas" : "wilayas"})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {list.map((wilaya) => (
                <div
                  key={wilaya.code}
                  className="p-3 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/60 shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold flex items-center justify-center font-mono text-slate-700 dark:text-slate-300">
                      {wilaya.code}
                    </span>
                    <div>
                      <div className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        {getLocalizedName(wilaya)}
                      </div>
                      <div className="text-[11px] text-slate-400 flex flex-wrap gap-1 mt-0.5">
                        {wilaya.primaryCrops.map((c) => (
                          <span key={c} className="capitalize">
                            • {c.replace("-", " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default WilayasPanel;

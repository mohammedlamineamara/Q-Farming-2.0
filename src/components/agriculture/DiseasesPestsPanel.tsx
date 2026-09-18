import { useI18n } from "@/i18n";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bug, ShieldCheck, Stethoscope } from "lucide-react";

interface Affliction {
  id: string;
  type: "disease" | "pest" | "physiological";
  scientificName: string;
  name: { en: string; ar: string; fr: string };
  severity: "low" | "medium" | "high" | "critical";
  symptoms: { en: string; ar: string; fr: string };
  treatment: { en: string; ar: string; fr: string };
}

interface DiseasesPestsPanelProps {
  afflictions: Affliction[];
}

export function DiseasesPestsPanel({ afflictions }: DiseasesPestsPanelProps) {
  const { language } = useI18n();

  const getSeverityBadge = (severity: Affliction["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30";
      case "high":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30";
      case "medium":
        return "bg-yellow-500/10 text-yellow-800 dark:text-yellow-400 border-yellow-500/30";
      default:
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30";
    }
  };

  const getLocalizedName = (a: Affliction) => {
    if (language === "ar") return a.name.ar;
    if (language === "fr") return a.name.fr;
    return a.name.en;
  };

  const getLocalizedSymptoms = (a: Affliction) => {
    if (language === "ar") return a.symptoms.ar;
    if (language === "fr") return a.symptoms.fr;
    return a.symptoms.en;
  };

  const getLocalizedTreatment = (a: Affliction) => {
    if (language === "ar") return a.treatment.ar;
    if (language === "fr") return a.treatment.fr;
    return a.treatment.en;
  };

  if (!afflictions || afflictions.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 rounded-xl bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10">
        {language === "ar"
          ? "لا توجد آفات مسجلة حالياً لهذا المحصول."
          : language === "fr"
          ? "Aucun ravageur ou maladie spécifique répertorié pour cette culture."
          : "No specific pests or diseases recorded for this crop."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {afflictions.map((item) => (
        <div
          key={item.id}
          className="p-4 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/60 shadow-xs space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                {item.type === "pest" ? <Bug className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {getLocalizedName(item)}
                </h4>
                <p className="text-xs italic text-slate-400">
                  {item.scientificName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-xs capitalize font-semibold ${getSeverityBadge(item.severity)}`}>
                {item.severity} {language === "ar" ? "خطورة" : language === "fr" ? "gravité" : "severity"}
              </Badge>
              <Badge variant="outline" className="text-xs capitalize text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10">
                {item.type}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100 dark:border-white/5">
            {/* Symptoms */}
            <div className="space-y-1 p-3 rounded-lg bg-slate-50/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-amber-500" />
                {language === "ar" ? "الأعراض والتشخيص" : language === "fr" ? "Symptômes & Diagnostic" : "Symptoms & Diagnosis"}
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {getLocalizedSymptoms(item)}
              </p>
            </div>

            {/* Treatment */}
            <div className="space-y-1 p-3 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30">
              <span className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {language === "ar" ? "المكافحة والتوصيات التقنية" : language === "fr" ? "Traitements & Bonnes Pratiques" : "Certified Management & Control"}
              </span>
              <p className="text-emerald-900/90 dark:text-emerald-300 leading-relaxed">
                {getLocalizedTreatment(item)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default DiseasesPestsPanel;

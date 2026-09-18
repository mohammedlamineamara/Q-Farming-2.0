import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/i18n";
import { Sprout, Calendar, ShieldAlert, ArrowRight, ArrowLeft } from "lucide-react";

interface CropCardProps {
  crop: {
    id: string;
    slug: string;
    name: { en: string; ar: string; fr: string };
    scientificName: string;
    family: string;
    category: string;
    description: { en: string; ar: string; fr: string };
    varieties: unknown[];
    calendar: unknown[];
    afflictionIds: string[];
    primaryWilayas: string[];
    requirements?: {
      waterNeedsMm: number;
      droughtTolerance: string;
    };
  };
}

export function CropCard({ crop }: CropCardProps) {
  const { language, isRTL } = useI18n();

  const getLocalizedName = () => {
    if (language === "ar") return crop.name.ar;
    if (language === "fr") return crop.name.fr;
    return crop.name.en;
  };

  const getLocalizedDesc = () => {
    if (language === "ar") return crop.description.ar;
    if (language === "fr") return crop.description.fr;
    return crop.description.en;
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "cereal":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
      case "fruit_tree":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
      case "vegetable":
        return "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20";
      default:
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";
    }
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <Card className="flex flex-col justify-between hover:border-emerald-500/50 dark:hover:border-emerald-500/40 transition-all duration-200 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md">
      <div>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <Badge variant="outline" className={`text-xs capitalize font-medium ${getCategoryColor(crop.category)}`}>
              {crop.category.replace("_", " ")}
            </Badge>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              {crop.family}
            </span>
          </div>
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white mt-2">
            {getLocalizedName()}
          </CardTitle>
          <p className="text-xs italic text-slate-500 dark:text-slate-400">
            {crop.scientificName}
          </p>
        </CardHeader>

        <CardContent className="space-y-3 pb-3">
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {getLocalizedDesc()}
          </p>

          <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1 bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-md border border-slate-200/60 dark:border-white/5">
              <Sprout className="w-3.5 h-3.5 text-emerald-500" />
              {crop.varieties?.length ?? 0} {language === "ar" ? "أصناف" : language === "fr" ? "variétés" : "varieties"}
            </span>

            <span className="flex items-center gap-1 bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-md border border-slate-200/60 dark:border-white/5">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              {crop.calendar?.length ?? 0} {language === "ar" ? "أطوار" : language === "fr" ? "phases" : "phases"}
            </span>

            {crop.afflictionIds?.length > 0 && (
              <span className="flex items-center gap-1 bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-md border border-slate-200/60 dark:border-white/5 text-red-600 dark:text-red-400">
                <ShieldAlert className="w-3.5 h-3.5" />
                {crop.afflictionIds.length} {language === "ar" ? "آفات" : language === "fr" ? "ravageurs" : "pests"}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      <div className="px-6 py-3 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
        <Link
          to={`/agriculture/crops/${crop.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          {language === "ar" ? "تفاصيل المحصول والدليل" : language === "fr" ? "Voir la fiche technique" : "View Agronomic Guide"}
          <ArrowIcon className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}
export default CropCard;

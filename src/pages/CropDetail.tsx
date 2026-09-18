import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useI18n } from "@/i18n";
import { resolveCropSlug } from "@/lib/cropLinking";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarTimeline } from "@/components/agriculture/CalendarTimeline";
import { DiseasesPestsPanel } from "@/components/agriculture/DiseasesPestsPanel";
import { KnowledgeSourcesPanel } from "@/components/agriculture/KnowledgeSourcesPanel";
import {
  ArrowLeft,
  ArrowRight,
  Sprout,
  Droplets,
  Thermometer,
  Layers,
  ShieldAlert,
  Calendar,
  BookOpen,
  MapPin,
  Tractor,
  RefreshCw,
} from "lucide-react";

export default function CropDetailPage() {
  const { cropId } = useParams<{ cropId: string }>();
  const { language, isRTL } = useI18n();

  const cropQuery = trpc.agriculture.getCropById.useQuery(
    { id: cropId || "" },
    { enabled: !!cropId }
  );

  // Also query user's active fields to display linked fields for this crop
  const fieldsQuery = trpc.fields.list.useQuery();

  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;
  const crop = cropQuery.data;

  // Filter linked fields
  const linkedFields = (fieldsQuery.data || []).filter(
    (f) => resolveCropSlug(f.crop) === crop?.slug
  );

  if (cropQuery.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
        <p className="text-sm text-slate-400">Loading crop agronomic profile...</p>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          {language === "ar" ? "المحصول غير موجود" : language === "fr" ? "Culture introuvable" : "Crop Not Found"}
        </h2>
        <Link to="/agriculture">
          <Button variant="outline" className="gap-2 cursor-pointer">
            <ArrowIcon className="w-4 h-4" />
            {language === "ar" ? "العودة إلى الدليل الزراعي" : language === "fr" ? "Retour au répertoire" : "Back to Agricultural Knowledge"}
          </Button>
        </Link>
      </div>
    );
  }

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

  const resolvedWilayas = (crop.resolvedWilayas ?? []).filter(
    (w): w is NonNullable<typeof w> => w !== null
  );
  const resolvedSources = (crop.resolvedSources ?? []).filter(
    (s): s is NonNullable<typeof s> => s !== null
  );

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb / Back */}
      <div className="flex items-center justify-between">
        <Link to="/agriculture">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
            <ArrowIcon className="w-4 h-4" />
            {language === "ar" ? "العودة إلى دليل المحاصيل" : language === "fr" ? "Retour aux cultures" : "Back to Crops"}
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize text-xs font-semibold">
            {crop.category.replace("_", " ")}
          </Badge>
          <span className="text-xs font-mono text-slate-400">
            {crop.family}
          </span>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 border border-emerald-500/20 p-6 lg:p-8 text-white shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-emerald-400">
                {crop.name.ar} • {crop.name.fr}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              {getLocalizedName()}
            </h1>
            <p className="text-emerald-300 font-mono text-sm italic mb-3">
              {crop.scientificName}
            </p>
            <p className="text-slate-300 max-w-2xl text-sm leading-relaxed">
              {getLocalizedDesc()}
            </p>
          </div>

          <div className="flex flex-col gap-2 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <span className="text-xs text-slate-300 font-medium">
              {language === "ar" ? "الولايات الرئيسية للإنتاج" : language === "fr" ? "Wilayas de production majeure" : "Major Production Wilayas"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {resolvedWilayas.map((w) => (
                <Badge key={w.code} variant="secondary" className="text-xs bg-white/10 hover:bg-white/20 text-white gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {language === "ar" ? w.name.ar : language === "fr" ? w.name.fr : w.name.en}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Agronomic Requirements Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Droplets className="w-4 h-4 text-blue-500" />
            {language === "ar" ? "الاحتياجات المائية" : language === "fr" ? "Besoins en eau" : "Water Needs"}
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {crop.requirements.waterNeedsMm} <span className="text-xs font-normal text-slate-400">mm/yr</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Thermometer className="w-4 h-4 text-amber-500" />
            {language === "ar" ? "الحرارة المثالية" : language === "fr" ? "T° Optimale" : "Optimal Temp"}
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {crop.requirements.optimalTempMin}° - {crop.requirements.optimalTempMax}°C
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Layers className="w-4 h-4 text-emerald-500" />
            {language === "ar" ? "تحمل الجفاف" : language === "fr" ? "Tolérance sécheresse" : "Drought Endurance"}
          </div>
          <div className="text-lg font-bold capitalize text-slate-900 dark:text-white">
            {crop.requirements.droughtTolerance}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Sprout className="w-4 h-4 text-purple-500" />
            {language === "ar" ? "تحمل الملوحة" : language === "fr" ? "Tolérance salinité" : "Salinity Endurance"}
          </div>
          <div className="text-lg font-bold capitalize text-slate-900 dark:text-white">
            {crop.requirements.salinityTolerance}
          </div>
        </div>
      </div>

      {/* Soil Type description */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {language === "ar" ? "نوعية التربة المفضلة:" : language === "fr" ? "Exigences pédologiques / sol :" : "Preferred Soil Types:"}
        </span>{" "}
        <span className="text-slate-600 dark:text-slate-400">
          {language === "ar"
            ? crop.requirements.soilTypes.ar
            : language === "fr"
            ? crop.requirements.soilTypes.fr
            : crop.requirements.soilTypes.en}
        </span>
      </div>

      {/* Linked Fields Section (Deterministic Crop Linking) */}
      {linkedFields.length > 0 && (
        <Card className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-300/50 dark:border-emerald-800/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-900 dark:text-emerald-300">
              <Tractor className="w-4 h-4 text-emerald-600" />
              {language === "ar"
                ? `حقول مزرعتك المزروعة بـ ${getLocalizedName()} (${linkedFields.length})`
                : language === "fr"
                ? `Vos parcelles cultivées en ${getLocalizedName()} (${linkedFields.length})`
                : `Your Active Farm Fields Cultivating ${getLocalizedName()} (${linkedFields.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {linkedFields.map((field) => (
                <Link
                  key={field.id}
                  to="/fields"
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/50 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {field.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {field.size} • {field.location}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] capitalize bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                    {field.status}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Varieties Catalog */}
      <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-500" />
            {language === "ar" ? "الأصناف والسلالات المعتمدة وطنيا" : language === "fr" ? "Variétés Nationales Certifiées" : "Certified National Varietals"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {crop.varieties?.map((v: { id: string; name: string; code?: string; cycleDays: number; maturity: string; description: { en: string; ar: string; fr: string } }) => (
              <div
                key={v.id}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {v.name}
                  </span>
                  {v.code && (
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {v.code}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>{v.cycleDays} {language === "ar" ? "يوم دورة" : language === "fr" ? "jours cycle" : "days cycle"}</span>
                  <span>•</span>
                  <span className="capitalize">{v.maturity}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1 border-t border-slate-200/60 dark:border-white/5">
                  {language === "ar" ? v.description.ar : language === "fr" ? v.description.fr : v.description.en}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 12-Month Agronomic Calendar */}
      <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            {language === "ar" ? "التقويم الزراعي السنوي للأطوار الفينولوجية" : language === "fr" ? "Calendrier Cultural & Phénologique" : "Annual Phenological Crop Calendar"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarTimeline phases={crop.calendar || []} />
        </CardContent>
      </Card>

      {/* Integrated Pest & Disease Management */}
      <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            {language === "ar" ? "الآفات والأمراض والمكافحة المتكاملة (IPM)" : language === "fr" ? "Protection Phytosanitaire & Ravageurs" : "Integrated Pest & Disease Management"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DiseasesPestsPanel afflictions={crop.resolvedAfflictions || []} />
        </CardContent>
      </Card>

      {/* Technical Provenance & Institutional Sources */}
      {resolvedSources.length > 0 && (
        <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-500" />
              {language === "ar" ? "المعاهد التقنية ومصادر التوثيق المعتمدة" : language === "fr" ? "Sources Scientifiques & Fiches ITGC/INRAA" : "Scientific Sources & Institutional Provenance"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <KnowledgeSourcesPanel sources={resolvedSources} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

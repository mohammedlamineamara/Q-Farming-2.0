import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useI18n } from "@/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CropCard } from "@/components/agriculture/CropCard";
import { WilayasPanel } from "@/components/agriculture/WilayasPanel";
import { KnowledgeSourcesPanel } from "@/components/agriculture/KnowledgeSourcesPanel";
import {
  Sprout,
  Search,
  BookOpen,
  MapPin,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";

export default function AgriculturePage() {
  const { language } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const cropsQuery = trpc.agriculture.getCrops.useQuery({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    query: searchQuery.trim() ? searchQuery : undefined,
  });

  const wilayasQuery = trpc.agriculture.getWilayas.useQuery();
  const sourcesQuery = trpc.agriculture.getSources.useQuery();

  const categories = [
    { id: "all", label: { en: "All Crops", ar: "كل المحاصيل", fr: "Toutes les cultures" } },
    { id: "cereal", label: { en: "Cereals", ar: "الحبوب", fr: "Céréales" } },
    { id: "fruit_tree", label: { en: "Fruit Trees", ar: "الأشجار المثمرة", fr: "Arboriculture" } },
    { id: "vegetable", label: { en: "Vegetables", ar: "الخضروات", fr: "Maraîchage" } },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 border border-emerald-500/20 p-6 lg:p-8 text-white shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
              <Sprout className="w-3.5 h-3.5" />
              {language === "ar"
                ? "قاعدة المعرفة الزراعية الوطنية"
                : language === "fr"
                ? "Référentiel Agronomique Algérien"
                : "Algerian National Agronomic Knowledge Base"}
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white mb-2">
              {language === "ar"
                ? "الدليل الزراعي للمحاصيل والواحات"
                : language === "fr"
                ? "Encyclopédie des Cultures & Agro-écologie"
                : "Crops, Varietals & Agro-Ecosystems"}
            </h1>
            <p className="text-slate-300 max-w-2xl text-sm leading-relaxed">
              {language === "ar"
                ? "بيانات تقنية معتمدة من المعاهد الفلاحية الوطنية (ITGC, INRAA, ITDAS) حول أصناف الحبوب، الأشجار المثمرة، مواعيد الغرس والحصاد ومكافحة الآفات."
                : language === "fr"
                ? "Données techniques validées par les instituts de recherche (ITGC, INRAA, ITDAS) : calendriers culturaux, variétés certifiées et phytosanitaire."
                : "Certified technical guides from national agricultural institutes (ITGC, INRAA, ITDAS) covering varietals, crop calendars, and integrated pest management."}
            </p>
          </div>

          <div className="flex gap-4 bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center">
              <div className="text-xl font-bold text-emerald-400">
                {cropsQuery.data?.length ?? 7}
              </div>
              <div className="text-[11px] text-slate-300">
                {language === "ar" ? "محاصيل معتمدة" : language === "fr" ? "Cultures" : "Crops"}
              </div>
            </div>
            <div className="w-[1px] bg-white/10" />
            <div className="text-center">
              <div className="text-xl font-bold text-cyan-400">
                {wilayasQuery.data?.length ?? 12}
              </div>
              <div className="text-[11px] text-slate-300">
                {language === "ar" ? "ولايات زراعية" : language === "fr" ? "Wilayas" : "Wilayas"}
              </div>
            </div>
            <div className="w-[1px] bg-white/10" />
            <div className="text-center">
              <div className="text-xl font-bold text-amber-400">
                {sourcesQuery.data?.length ?? 5}
              </div>
              <div className="text-[11px] text-slate-300">
                {language === "ar" ? "معاهد علمية" : language === "fr" ? "Instituts" : "Institutes"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs defaultValue="crops" className="space-y-6">
        <TabsList className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-1">
          <TabsTrigger value="crops" className="gap-2 text-xs font-semibold">
            <Sprout className="w-4 h-4 text-emerald-500" />
            {language === "ar" ? "دليل المحاصيل" : language === "fr" ? "Cultures & Variétés" : "Crops & Varietals"}
          </TabsTrigger>
          <TabsTrigger value="wilayas" className="gap-2 text-xs font-semibold">
            <MapPin className="w-4 h-4 text-blue-500" />
            {language === "ar" ? "المناطق الفلاحية والولايات" : language === "fr" ? "Zones & Wilayas" : "Zones & Wilayas"}
          </TabsTrigger>
          <TabsTrigger value="sources" className="gap-2 text-xs font-semibold">
            <BookOpen className="w-4 h-4 text-amber-500" />
            {language === "ar" ? "المصادر والمعاهد المعتمدة" : language === "fr" ? "Sources & Instituts" : "Research Institutes"}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Crops */}
        <TabsContent value="crops" className="space-y-6 m-0">
          {/* Filters and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-xs">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  size="sm"
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                      : "border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {language === "ar" ? cat.label.ar : language === "fr" ? cat.label.fr : cat.label.en}
                </Button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === "ar"
                    ? "ابحث عن قمح، زيتون، طماطم..."
                    : language === "fr"
                    ? "Rechercher un blé, olivier, tomate..."
                    : "Search crop or scientific name..."
                }
                className="pl-9 text-xs"
              />
            </div>
          </div>

          {/* Crops Grid */}
          {cropsQuery.isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-2">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
              <p className="text-xs text-slate-400">Loading agronomic data...</p>
            </div>
          ) : !cropsQuery.data || cropsQuery.data.length === 0 ? (
            <div className="text-center p-12 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 space-y-2">
              <SlidersHorizontal className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {language === "ar" ? "لم يتم العثور على محاصيل مطابقة" : language === "fr" ? "Aucune culture trouvée" : "No crops match your search"}
              </p>
              <p className="text-xs text-slate-400">
                {language === "ar" ? "جرب كلمة بحث أخرى أو حدد جميع الفئات" : language === "fr" ? "Essayez un autre mot-clé" : "Try adjusting your search terms or category filter"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cropsQuery.data.map((crop) => (
                <CropCard key={crop.id} crop={crop} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Wilayas */}
        <TabsContent value="wilayas" className="m-0">
          <WilayasPanel wilayas={wilayasQuery.data || []} />
        </TabsContent>

        {/* Tab 3: Sources */}
        <TabsContent value="sources" className="m-0">
          <KnowledgeSourcesPanel sources={sourcesQuery.data || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

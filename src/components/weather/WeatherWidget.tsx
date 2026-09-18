import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/providers/trpc";
import { useI18n } from "@/i18n";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  Wind,
  Droplets,
  RefreshCw,
  MapPin,
  AlertCircle,
  Settings as SettingsIcon,
} from "lucide-react";

export function WeatherWidget() {
  const { t, language } = useI18n();
  const utils = trpc.useUtils();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Weather query using tRPC
  const weatherQuery = trpc.weather.get.useQuery(
    {},
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const freshData = await utils.weather.get.fetch({ bypassCache: true });
      utils.weather.get.setData({}, freshData);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getWeatherIcon = (condition: string, sizeClass = "w-6 h-6") => {
    switch (condition) {
      case "clear_sky":
      case "mainly_clear":
        return <Sun className={`${sizeClass} text-amber-500`} />;
      case "rain":
      case "drizzle":
      case "rain_showers":
        return <CloudRain className={`${sizeClass} text-blue-500`} />;
      case "thunderstorm":
      case "thunderstorm_hail":
        return <CloudLightning className={`${sizeClass} text-purple-500`} />;
      case "snow":
      case "snow_showers":
        return <Snowflake className={`${sizeClass} text-cyan-400`} />;
      default:
        return <Cloud className={`${sizeClass} text-slate-400`} />;
    }
  };

  const getConditionLabel = (condition: string): string => {
    const labels: Record<string, { en: string; ar: string; fr: string }> = {
      clear_sky: { en: "Clear Sky", ar: "سماء صافية", fr: "Ciel dégagé" },
      mainly_clear: { en: "Mainly Clear", ar: "صافٍ غالباً", fr: "Généralement dégagé" },
      partly_cloudy: { en: "Partly Cloudy", ar: "غائم جزئياً", fr: "Partiellement nuageux" },
      overcast: { en: "Overcast", ar: "غائم", fr: "Couvert" },
      foggy: { en: "Foggy", ar: "ضبابي", fr: "Brumeux" },
      drizzle: { en: "Drizzle", ar: "رذاذ خفيف", fr: "Bruine" },
      rain: { en: "Rain", ar: "ممطر", fr: "Pluvieux" },
      rain_showers: { en: "Rain Showers", ar: "زخات مطر", fr: "Averses" },
      thunderstorm: { en: "Thunderstorm", ar: "عواصف رعدية", fr: "Orage" },
      snow: { en: "Snow", ar: "ثلوج", fr: "Neige" },
    };

    const entry = labels[condition];
    if (!entry) return condition;
    return language === "ar" ? entry.ar : language === "fr" ? entry.fr : entry.en;
  };

  const formatDayName = (dateStr: string, index: number): string => {
    if (index === 0) {
      return language === "ar" ? "اليوم" : language === "fr" ? "Aujourd'hui" : "Today";
    }
    if (index === 1) {
      return language === "ar" ? "غداً" : language === "fr" ? "Demain" : "Tomorrow";
    }
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(
        language === "ar" ? "ar-DZ" : language === "fr" ? "fr-FR" : "en-US",
        { weekday: "short" }
      );
    } catch {
      return dateStr;
    }
  };

  const data = weatherQuery.data;

  return (
    <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
          <Sun className="w-5 h-5 text-amber-500 dark:text-amber-400" />
          {t("dashboard.weatherForecast")}
        </CardTitle>
        <div className="flex items-center gap-2">
          {data?.fromCache && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-slate-500 border-slate-200 dark:border-white/10">
              {language === "ar" ? "مخزن مؤقتاً" : language === "fr" ? "En cache" : "Cached"}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing || weatherQuery.isFetching}
            className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            title={language === "ar" ? "تحديث الطقس" : language === "fr" ? "Actualiser" : "Refresh weather"}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing || weatherQuery.isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {weatherQuery.isLoading && (
          <div className="flex flex-col items-center justify-center p-8 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
            <p className="text-xs text-slate-400">{t("common.loading")}</p>
          </div>
        )}

        {data?.status === "not_configured" && (
          <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl bg-slate-50/80 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 space-y-3">
            <MapPin className="w-8 h-8 text-amber-500/80" />
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {language === "ar" ? "لم يتم تحديد موقع المزرعة" : language === "fr" ? "Emplacement de la ferme non configuré" : "Farm Location Not Configured"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                {language === "ar"
                  ? "يرجى تحديد ولاية أو إحداثيات مزرعتك في الإعدادات لجلب حالة الطقس المباشرة."
                  : language === "fr"
                  ? "Veuillez configurer votre wilaya ou coordonnées dans les paramètres pour afficher la météo."
                  : "Please set your wilaya or GPS coordinates in settings to view live Open-Meteo weather forecasts."}
              </p>
            </div>
            <Link to="/settings">
              <Button size="sm" variant="outline" className="gap-2 cursor-pointer text-xs">
                <SettingsIcon className="w-3.5 h-3.5" />
                {language === "ar" ? "الانتقال إلى الإعدادات" : language === "fr" ? "Ouvrir les Paramètres" : "Open Settings"}
              </Button>
            </Link>
          </div>
        )}

        {data?.status === "error" && (
          <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 space-y-2">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <p className="text-xs text-red-600 dark:text-red-400">{data.message || "Failed to load weather data"}</p>
            <Button size="sm" variant="ghost" onClick={handleManualRefresh} className="text-xs text-red-600 hover:text-red-700">
              {language === "ar" ? "إعادة المحاولة" : language === "fr" ? "Réessayer" : "Retry"}
            </Button>
          </div>
        )}

        {data?.status === "success" && data.current && (
          <>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
              <div className="p-3 rounded-2xl bg-white dark:bg-white/10 shadow-xs">
                {getWeatherIcon(data.current.condition, "w-10 h-10")}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    {data.current.temperature}°C
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {getConditionLabel(data.current.condition)}
                  </span>
                </div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  {data.locationName}
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    {data.current.humidity !== undefined ? `${data.current.humidity}%` : "--"} {t("nav.humidity")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-cyan-500" />
                    {data.current.windSpeed} km/h {t("nav.wind")}
                  </span>
                </div>
              </div>
            </div>

            {/* 7-Day Forecast Grid */}
            {data.forecast && data.forecast.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 pt-1">
                {data.forecast.slice(0, 7).map((day, idx) => (
                  <div
                    key={day.date}
                    className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {formatDayName(day.date, idx)}
                    </div>
                    <div className="my-1.5">{getWeatherIcon(day.condition, "w-5 h-5")}</div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {day.tempMax}°
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">
                      {day.tempMin}°
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
export default WeatherWidget;

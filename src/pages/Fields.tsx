import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { getCropDetailUrl } from "@/lib/cropLinking";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n";
import { Can } from "@/components/rbac/Can";
import { Tractor, Search, MapPin, Ruler, Sprout, Droplets, Thermometer, Plus, Trash2 } from "lucide-react";

export default function Fields() {
  const [search, setSearch] = useState("");
  const { t } = useI18n();
  const utils = trpc.useUtils();
  const { data: fields, isLoading } = trpc.fields.list.useQuery();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    crop: "Wheat",
    size: "",
    location: "",
    lat: "36.75°N",
    lng: "3.06°E",
  });

  const createField = trpc.fields.create.useMutation({
    onSuccess: () => {
      utils.fields.list.invalidate();
      setOpen(false);
      setForm({
        name: "",
        crop: "Wheat",
        size: "",
        location: "",
        lat: "36.75°N",
        lng: "3.06°E",
      });
    },
    onError: (err) => {
      console.error("CREATE FIELD ERROR:", err);
    },
  });

  const deleteField = trpc.fields.delete.useMutation({
    onSuccess: () => {
      utils.fields.list.invalidate();
    },
  });

  const filteredFields = fields?.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.crop.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createField.mutate({
      ...form,
      size: form.size || "5.0",
      location: form.location || "Algiers",
    });
  };

  const statusColors: Record<string, string> = {
    active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    irrigation: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
    harvest: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
    fallow: "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/20",
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return t("fields.statusActive");
      case "irrigation":
        return t("fields.statusIrrigation");
      case "harvest":
        return t("fields.statusHarvest");
      case "fallow":
        return t("fields.statusFallow");
      default:
        return status;
    }
  };

  const cropOptions = [
    { value: "Wheat", key: "wheat" },
    { value: "Barley", key: "barley" },
    { value: "Oats", key: "oats" },
    { value: "Corn", key: "corn" },
    { value: "Potatoes", key: "potatoes" },
    { value: "Tomatoes", key: "tomatoes" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Tractor className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t("fields.title")}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("fields.subtitle")}</p>
          </div>
        </div>
        <Can permission="fields.create">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white gap-2 shadow-xs cursor-pointer">
                <Plus className="w-4 h-4" /> {t("fields.addField")}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-slate-900 dark:text-white">{t("fields.addNewField")}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">{t("fields.fieldName")}</Label>
                  <Input
                    className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 mt-1"
                    placeholder={t("fields.fieldNamePlaceholder")}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">{t("fields.cropType")}</Label>
                  <Select value={form.crop} onValueChange={(v) => setForm({ ...form, crop: v })}>
                    <SelectTrigger className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                      {cropOptions.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {t(`fields.crops.${c.key}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">{t("fields.sizeHectares")}</Label>
                  <Input
                    className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 mt-1"
                    type="number"
                    step="0.1"
                    placeholder="5.0"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">{t("fields.location")}</Label>
                  <Input
                    className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 mt-1"
                    placeholder={t("fields.locationPlaceholder")}
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium cursor-pointer">
                  {t("fields.addField")}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </Can>
      </div>

      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          className="ps-10 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-xs"
          placeholder={t("fields.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 animate-pulse h-64" />
          ))}
        {filteredFields?.map((field) => (
          <Card
            key={field.id}
            className="group bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5 shadow-xs overflow-hidden"
          >
            {/* Map Placeholder */}
            <div className="h-28 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 dark:from-emerald-500/10 dark:to-cyan-500/5 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(100,116,139,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,0.15) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="absolute inset-0 bg-radial-gradient from-emerald-500/20 via-transparent to-transparent" />
              <div className="absolute bottom-2 start-2 px-2 py-1 rounded-md bg-white/80 dark:bg-black/50 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-[10px] text-slate-700 dark:text-slate-300 flex items-center gap-1 font-medium shadow-xs">
                <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> {field.lat}, {field.lng}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">{field.name}</h3>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className={statusColors[field.status] || ""}>
                    {getStatusLabel(field.status)}
                  </Badge>
                  <Can permission="fields.delete">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-slate-400 hover:text-red-500 cursor-pointer"
                      onClick={() => deleteField.mutate({ id: field.id })}
                      disabled={deleteField.isPending}
                      title={t("common.delete")}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </Can>
                </div>
              </div>
              <div className="flex gap-4 text-xs text-slate-600 dark:text-slate-400 mb-3 font-medium">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {field.location}</span>
                <span className="flex items-center gap-1"><Ruler className="w-3 h-3 text-slate-400" /> {field.size} {t("common.ha")}</span>
                <span className="flex items-center gap-1">
                  <Sprout className="w-3 h-3 text-emerald-500" />
                  {getCropDetailUrl(field.crop) ? (
                    <Link
                      to={getCropDetailUrl(field.crop)!}
                      className="hover:underline text-emerald-600 dark:text-emerald-400 font-semibold"
                      title="View Agronomic Guide"
                    >
                      {field.crop}
                    </Link>
                  ) : (
                    <span>{field.crop}</span>
                  )}
                </span>
              </div>
              <div className="flex gap-2 mb-3">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-medium">
                  <Droplets className="w-3 h-3 text-blue-500" /> {field.moisture}% {t("fields.moistureLevel")}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1 font-medium">
                  <Thermometer className="w-3 h-3 text-amber-500" /> {field.temp}°C
                </span>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">{t("fields.growthProgress")}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{field.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${field.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[progressShine_2s_infinite]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n";
import { Can } from "@/components/rbac/Can";
import { Package, Plus, Trash2 } from "lucide-react";

const categories = ["all", "seeds", "fertilizer", "equipment", "pesticide"] as const;

export default function Inventory() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const utils = trpc.useUtils();
  const { data: items, isLoading } = trpc.inventory.list.useQuery();
  const createItem = trpc.inventory.create.useMutation({
    onSuccess: () => {
      utils.inventory.list.invalidate();
      setOpen(false);
      setForm({
        name: "",
        category: "seeds",
        stock: "",
        max: "",
        unit: "kg",
        icon: "📦",
      });
    },
  });

  const deleteItem = trpc.inventory.delete.useMutation({
    onSuccess: () => {
      utils.inventory.list.invalidate();
    },
  });

  const [form, setForm] = useState({
    name: "",
    category: "seeds",
    stock: "",
    max: "",
    unit: "kg",
    icon: "📦",
  });

  const filteredItems =
    activeCategory === "all" ? items : items?.filter((i) => i.category === activeCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createItem.mutate({
      name: form.name,
      category: form.category as "seeds" | "fertilizer" | "equipment" | "pesticide" | "other",
      stock: parseInt(form.stock) || 0,
      max: parseInt(form.max) || 100,
      unit: form.unit,
      icon: form.icon,
    });
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "all":
        return t("inventory.categories.all");
      case "seeds":
        return t("inventory.categories.seeds");
      case "fertilizer":
        return t("inventory.categories.fertilizer");
      case "equipment":
        return t("inventory.categories.equipment");
      case "pesticide":
        return t("inventory.categories.pesticide");
      default:
        return cat;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t("inventory.title")}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("inventory.subtitle")}</p>
          </div>
        </div>
        <Can permission="inventory.create">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white gap-2 shadow-xs cursor-pointer">
                <Plus className="w-4 h-4" /> {t("inventory.addItem")}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-slate-900 dark:text-white">{t("inventory.addInventoryItem")}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">{t("inventory.itemName")}</Label>
                  <Input
                    className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 mt-1"
                    placeholder={t("inventory.itemNamePlaceholder")}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">{t("inventory.category")}</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                      {categories.filter((c) => c !== "all").map((c) => (
                        <SelectItem key={c} value={c}>{getCategoryLabel(c)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-slate-700 dark:text-slate-300">{t("inventory.stock")}</Label>
                    <Input
                      className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 mt-1"
                      type="number"
                      placeholder="0"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 dark:text-slate-300">{t("inventory.maxCapacity")}</Label>
                    <Input
                      className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 mt-1"
                      type="number"
                      placeholder="100"
                      value={form.max}
                      onChange={(e) => setForm({ ...form, max: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">{t("inventory.unit")}</Label>
                  <Input
                    className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 mt-1"
                    placeholder={t("inventory.unitPlaceholder")}
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium cursor-pointer">
                  {t("inventory.addItem")}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </Can>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              activeCategory === cat
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md shadow-emerald-500/20"
                : "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 animate-pulse h-48" />
          ))}
        {filteredItems?.map((item) => {
          const pct = Math.round((item.stock / item.max) * 100);
          const isLow = item.stock < 20;
          return (
            <Card
              key={item.id}
              className="group relative bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5 shadow-xs text-center p-5 cursor-pointer"
            >
              <Can permission="inventory.delete">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2.5 end-2.5 h-7 w-7 text-slate-400 hover:text-red-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem.mutate({ id: item.id });
                  }}
                  disabled={deleteItem.isPending}
                  title={t("common.delete")}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </Can>
              <div className="text-4xl mb-3 group-hover:scale-105 transition-transform duration-200">
                {item.icon}
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{item.name}</h3>
              <div className={`text-sm font-medium ${isLow ? "text-red-600 dark:text-red-400" : "text-slate-600 dark:text-slate-400"}`}>
                {item.stock} {item.unit} {isLow && `⚠️ ${t("inventory.lowWarning")}`}
              </div>
              <div className="mt-3 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${pct}%`,
                    background: isLow
                      ? "linear-gradient(90deg, #ef4444, #f97316)"
                      : "linear-gradient(90deg, #10b981, #22d3ee)",
                  }}
                />
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                {t("inventory.capacityPct", { pct })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

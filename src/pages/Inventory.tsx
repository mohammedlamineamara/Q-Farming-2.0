import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Package, Plus } from "lucide-react";

const categories = ["all", "seeds", "fertilizer", "equipment", "pesticide"];

export default function Inventory() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();
  const { data: items, isLoading } = trpc.inventory.list.useQuery();
  const createItem = trpc.inventory.create.useMutation({
    onSuccess: () => {
      utils.inventory.list.invalidate();
      setOpen(false);
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

  const categoryLabels: Record<string, string> = {
    all: "All",
    seeds: "Seeds",
    fertilizer: "Fertilizer",
    equipment: "Equipment",
    pesticide: "Pesticide",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center border border-blue-500/20">
            <Package className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Inventory & Resources</h1>
            <p className="text-sm text-slate-400">Track your farm supplies and equipment</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white gap-2">
              <Plus className="w-4 h-4" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Add Inventory Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Item Name</Label>
                <Input
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="e.g., Pesticide"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    {categories.filter((c) => c !== "all").map((c) => (
                      <SelectItem key={c} value={c}>{categoryLabels[c]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Stock</Label>
                  <Input
                    className="bg-white/5 border-white/10 text-white"
                    type="number"
                    placeholder="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Max Capacity</Label>
                  <Input
                    className="bg-white/5 border-white/10 text-white"
                    type="number"
                    placeholder="100"
                    value={form.max}
                    onChange={(e) => setForm({ ...form, max: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Unit</Label>
                <Input
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="kg, bags, units..."
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
                Add Item
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20"
                : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200"
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="bg-slate-800/40 border-white/5 animate-pulse h-48" />
          ))}
        {filteredItems?.map((item) => {
          const pct = Math.round((item.stock / item.max) * 100);
          const isLow = item.stock < 20;
          return (
            <Card
              key={item.id}
              className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/8 backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] text-center p-5 cursor-pointer"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{item.name}</h3>
              <div className={`text-sm font-medium ${isLow ? "text-red-400 animate-pulse" : "text-slate-400"}`}>
                {item.stock} {item.unit} {isLow && "⚠️ Low"}
              </div>
              <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
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
              <div className="text-[10px] text-slate-500 mt-1.5">{pct}% of capacity</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

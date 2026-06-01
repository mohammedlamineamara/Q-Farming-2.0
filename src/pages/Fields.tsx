import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tractor, Search, MapPin, Ruler, Sprout, Droplets, Thermometer, Plus } from "lucide-react";

export default function Fields() {
  const [search, setSearch] = useState("");
  const utils = trpc.useUtils();
  const { data: fields, isLoading } = trpc.fields.list.useQuery();
  const createField = trpc.fields.create.useMutation({
    onSuccess: () => {
      utils.fields.list.invalidate();
      setOpen(false);
    },
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    crop: "Wheat",
    size: "",
    location: "",
    lat: "36.75°N",
    lng: "3.06°E",
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
    active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    irrigation: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
    harvest: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    fallow: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center border border-emerald-500/20">
            <Tractor className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Field Management</h1>
            <p className="text-sm text-slate-400">Manage your farm fields and crops</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white gap-2">
              <Plus className="w-4 h-4" /> Add Field
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Add New Field</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Field Name</Label>
                <Input
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="e.g., Field D - Corn"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Crop Type</Label>
                <Select value={form.crop} onValueChange={(v) => setForm({ ...form, crop: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    {["Wheat", "Barley", "Oats", "Corn", "Potatoes", "Tomatoes"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Size (hectares)</Label>
                <Input
                  className="bg-white/5 border-white/10 text-white"
                  type="number"
                  step="0.1"
                  placeholder="5.0"
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="e.g., Blida"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
                Add Field
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
          placeholder="Search fields by name, crop, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-slate-800/40 border-white/5 animate-pulse h-64" />
          ))}
        {filteredFields?.map((field) => (
          <Card
            key={field.id}
            className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/8 backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            {/* Map Placeholder */}
            <div className="h-28 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="absolute inset-0 bg-radial-gradient from-emerald-500/20 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/10 text-[10px] text-slate-300 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {field.lat}, {field.lng}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-white">{field.name}</h3>
                <Badge variant="outline" className={statusColors[field.status]}>
                  {field.status}
                </Badge>
              </div>
              <div className="flex gap-4 text-xs text-slate-400 mb-3">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {field.location}</span>
                <span className="flex items-center gap-1"><Ruler className="w-3 h-3" /> {field.size} ha</span>
                <span className="flex items-center gap-1"><Sprout className="w-3 h-3" /> {field.crop}</span>
              </div>
              <div className="flex gap-2 mb-3">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Droplets className="w-3 h-3" /> {field.moisture}% moisture
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <Thermometer className="w-3 h-3" /> {field.temp}°C
                </span>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Growth Progress</span>
                  <span className="text-emerald-400 font-semibold">{field.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
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

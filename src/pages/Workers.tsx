import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users, Plus, Phone, Mail } from "lucide-react";

export default function Workers() {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();
  const { data: workers, isLoading } = trpc.workers.list.useQuery();
  const createWorker = trpc.workers.create.useMutation({
    onSuccess: () => {
      utils.workers.list.invalidate();
      setOpen(false);
    },
  });

  const [form, setForm] = useState({
    name: "",
    role: "Field Manager",
    status: "online" as "online" | "offline" | "busy",
    phone: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createWorker.mutate(form);
  };

  const statusColors: Record<string, string> = {
    online: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    offline: "bg-slate-500/15 text-slate-400 border-slate-500/20",
    busy: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  };

  const avatarIcons: Record<string, string> = {
    "Field Manager": "👨‍🌾",
    Agronomist: "👩‍🔬",
    "Equipment Operator": "👷",
    "Data Analyst": "👩‍💻",
    "Irrigation Tech": "👨‍🔧",
    "Quality Inspector": "👩‍🔬",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 flex items-center justify-center border border-purple-500/20">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Worker Management</h1>
            <p className="text-sm text-slate-400">Manage your farm team</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white gap-2">
              <Plus className="w-4 h-4" /> Add Worker
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Add Worker</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="e.g., Ali Benali"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    {["Field Manager", "Agronomist", "Equipment Operator", "Data Analyst", "Irrigation Technician", "Quality Inspector"].map(
                      (r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="+213..."
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  className="bg-white/5 border-white/10 text-white"
                  type="email"
                  placeholder="worker@qfarming.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
                Add Worker
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-slate-800/40 border-white/5 animate-pulse h-56" />
          ))}
        {workers?.map((worker) => (
          <Card
            key={worker.id}
            className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/8 backdrop-blur-xl hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 text-center p-5"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              {avatarIcons[worker.role] || "👷"}
            </div>
            <h3 className="font-bold text-white mb-0.5">{worker.name}</h3>
            <p className="text-xs text-slate-400 mb-3">{worker.role}</p>
            <Badge variant="outline" className={statusColors[worker.status]}>
              <span
                className="w-1.5 h-1.5 rounded-full mr-1.5"
                style={{
                  backgroundColor:
                    worker.status === "online"
                      ? "#10b981"
                      : worker.status === "busy"
                      ? "#f59e0b"
                      : "#64748b",
                }}
              />
              {worker.status}
            </Badge>
            {(worker.phone || worker.email) && (
              <div className="mt-3 pt-3 border-t border-white/5 space-y-1">
                {worker.phone && (
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                    <Phone className="w-3 h-3" /> {worker.phone}
                  </div>
                )}
                {worker.email && (
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                    <Mail className="w-3 h-3" /> {worker.email}
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

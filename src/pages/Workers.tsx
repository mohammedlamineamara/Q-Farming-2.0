import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n";
import { Can } from "@/components/rbac/Can";
import { Users, Plus, Phone, Mail, Trash2 } from "lucide-react";

export default function Workers() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const utils = trpc.useUtils();
  const { data: workers, isLoading } = trpc.workers.list.useQuery();
  const createWorker = trpc.workers.create.useMutation({
    onSuccess: () => {
      utils.workers.list.invalidate();
      setOpen(false);
      setForm({
        name: "",
        role: "Field Manager",
        status: "online",
        phone: "",
        email: "",
      });
    },
  });

  const deleteWorker = trpc.workers.delete.useMutation({
    onSuccess: () => {
      utils.workers.list.invalidate();
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
    online: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    offline: "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/20",
    busy: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "online":
        return t("workers.statusOnline");
      case "offline":
        return t("workers.statusOffline");
      case "busy":
        return t("workers.statusBusy");
      default:
        return status;
    }
  };

  const roles = [
    { value: "Field Manager", labelKey: "workers.roles.fieldManager" as const },
    { value: "Agronomist", labelKey: "workers.roles.agronomist" as const },
    { value: "Equipment Operator", labelKey: "workers.roles.equipmentOperator" as const },
    { value: "Data Analyst", labelKey: "workers.roles.dataAnalyst" as const },
    { value: "Irrigation Technician", labelKey: "workers.roles.irrigationTech" as const },
    { value: "Quality Inspector", labelKey: "workers.roles.qualityInspector" as const },
  ];

  const avatarIcons: Record<string, string> = {
    "Field Manager": "👨‍🌾",
    Agronomist: "👩‍🔬",
    "Equipment Operator": "👷",
    "Data Analyst": "👩‍💻",
    "Irrigation Tech": "👨‍🔧",
    "Irrigation Technician": "👨‍🔧",
    "Quality Inspector": "👩‍🔬",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center border border-purple-500/20 text-purple-600 dark:text-purple-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t("workers.title")}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("workers.subtitle")}</p>
          </div>
        </div>
        <Can permission="workers.create">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white gap-2 shadow-xs cursor-pointer">
                <Plus className="w-4 h-4" /> {t("workers.addWorker")}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-slate-900 dark:text-white">{t("workers.addWorker")}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">{t("workers.fullName")}</Label>
                  <Input
                    className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 mt-1"
                    placeholder={t("workers.namePlaceholder")}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">{t("workers.role")}</Label>
                  <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                    <SelectTrigger className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                      {roles.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {t(r.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">{t("workers.phone")}</Label>
                  <Input
                    className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 mt-1"
                    placeholder="+213..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">{t("workers.email")}</Label>
                  <Input
                    className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 mt-1"
                    type="email"
                    placeholder="worker@qfarming.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium cursor-pointer">
                  {t("workers.addWorker")}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </Can>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 animate-pulse h-56" />
          ))}
        {workers?.map((worker) => (
          <Card
            key={worker.id}
            className="group relative bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5 shadow-xs text-center p-5"
          >
            <Can permission="workers.delete">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2.5 end-2.5 h-7 w-7 text-slate-400 hover:text-red-500 cursor-pointer"
                onClick={() => deleteWorker.mutate({ id: worker.id })}
                disabled={deleteWorker.isPending}
                title={t("common.delete")}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </Can>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-3xl mx-auto mb-3 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              {avatarIcons[worker.role] || "👷"}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-0.5">{worker.name}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{worker.role}</p>
            <Badge variant="outline" className={statusColors[worker.status] || ""}>
              <span
                className="w-1.5 h-1.5 rounded-full me-1.5 inline-block"
                style={{
                  backgroundColor:
                    worker.status === "online"
                      ? "#10b981"
                      : worker.status === "busy"
                      ? "#f59e0b"
                      : "#64748b",
                }}
              />
              {getStatusLabel(worker.status)}
            </Badge>
            {(worker.phone || worker.email) && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5 space-y-1">
                {worker.phone && (
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400" dir="ltr">
                    <Phone className="w-3 h-3" /> {worker.phone}
                  </div>
                )}
                {worker.email && (
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400" dir="ltr">
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

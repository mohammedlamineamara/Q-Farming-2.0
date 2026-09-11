import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n";
import { CalendarDays, Plus, ChevronLeft, ChevronRight, Droplets, Sprout, Wrench } from "lucide-react";

export default function CalendarPage() {
  const [open, setOpen] = useState(false);
  const { t, language } = useI18n();
  const utils = trpc.useUtils();
  const { data: events } = trpc.calendar.list.useQuery();
  const { data: fields } = trpc.fields.list.useQuery();
  const { data: workers } = trpc.workers.list.useQuery();
  const createEvent = trpc.calendar.create.useMutation({
    onSuccess: () => {
      utils.calendar.list.invalidate();
      setOpen(false);
      setForm({
        title: "",
        description: "",
        eventDate: "",
        fieldId: "",
        workerId: "",
        priority: "medium",
      });
    },
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    fieldId: "",
    workerId: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEvent.mutate({
      ...form,
      eventDate: new Date(form.eventDate).toISOString(),
      fieldId: form.fieldId ? parseInt(form.fieldId) : undefined,
      workerId: form.workerId ? parseInt(form.workerId) : undefined,
    });
  };

  // Calendar generation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const locale = language === "ar" ? "ar-DZ" : language === "fr" ? "fr-FR" : "en-US";
  const monthName = new Date(year, month, 1).toLocaleDateString(locale, { month: "long" });

  const dayHeaders = Array.from({ length: 7 }).map((_, i) => {
    // 2023-01-01 is Sunday
    const d = new Date(2023, 0, 1 + i);
    return d.toLocaleDateString(locale, { weekday: "short" });
  });

  const eventDates = events?.reduce(
    (acc, e) => {
      const d = new Date(e.eventDate);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const day = d.getDate();
        if (!acc[day]) acc[day] = [];
        acc[day].push(e);
      }
      return acc;
    },
    {} as Record<number, typeof events>
  );

  const today = new Date().getDate();
  const isCurrentMonth = new Date().getMonth() === month && new Date().getFullYear() === year;

  const priorityColors: Record<string, string> = {
    low: "bg-slate-500/20 text-slate-700 dark:text-slate-400 border-slate-500/30",
    medium: "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30",
    high: "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30",
    urgent: "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30",
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "low":
        return t("calendar.low");
      case "medium":
        return t("calendar.medium");
      case "high":
        return t("calendar.high");
      case "urgent":
        return t("calendar.urgent");
      default:
        return priority;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center border border-pink-500/20 text-pink-600 dark:text-pink-400">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t("calendar.title")}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("calendar.subtitle")}</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white gap-2 shadow-xs cursor-pointer">
              <Plus className="w-4 h-4" /> {t("calendar.addEvent")}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white max-w-md shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-white">{t("calendar.addEvent")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-slate-700 dark:text-slate-300">{t("calendar.eventTitle")}</Label>
                <Input
                  className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 mt-1"
                  placeholder={t("calendar.eventTitlePlaceholder")}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label className="text-slate-700 dark:text-slate-300">{t("calendar.dateTime")}</Label>
                <Input
                  className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 mt-1"
                  type="datetime-local"
                  value={form.eventDate}
                  onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label className="text-slate-700 dark:text-slate-300">{t("calendar.fieldOptional")}</Label>
                <Select value={form.fieldId} onValueChange={(v) => setForm({ ...form, fieldId: v })}>
                  <SelectTrigger className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white mt-1">
                    <SelectValue placeholder={t("calendar.selectField")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                    {fields?.map((f) => (
                      <SelectItem key={f.id} value={String(f.id)}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-700 dark:text-slate-300">{t("calendar.assignToOptional")}</Label>
                <Select value={form.workerId} onValueChange={(v) => setForm({ ...form, workerId: v })}>
                  <SelectTrigger className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white mt-1">
                    <SelectValue placeholder={t("calendar.selectWorker")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                    {workers?.map((w) => (
                      <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-700 dark:text-slate-300">{t("calendar.priority")}</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) => setForm({ ...form, priority: v as typeof form.priority })}
                >
                  <SelectTrigger className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                    {(["low", "medium", "high", "urgent"] as const).map((p) => (
                      <SelectItem key={p} value={p}>{getPriorityLabel(p)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium cursor-pointer">
                {t("calendar.addEvent")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white capitalize">
                {monthName} {year}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                  onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                  onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center">
              {dayHeaders.map((d, i) => (
                <div key={i} className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase py-2">
                  {d}
                </div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const hasEvents = eventDates && eventDates[day] && eventDates[day].length > 0;
                const isToday = isCurrentMonth && day === today;
                return (
                  <button
                    key={day}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-all relative ${
                      isToday
                        ? "bg-gradient-to-br from-emerald-500 to-cyan-500 text-white font-bold shadow-md shadow-emerald-500/20"
                        : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {day}
                    {hasEvents && !isToday && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
              <CalendarDays className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              {t("calendar.upcomingTasks")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {events?.length === 0 && (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">{t("calendar.noUpcomingEvents")}</div>
            )}
            {events?.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 hover:bg-slate-100/80 dark:hover:bg-white/10 hover:border-slate-300/80 dark:hover:border-white/10 transition-all cursor-pointer hover:translate-x-0.5"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${priorityColors[event.priority] || ""}`}
                >
                  {event.priority === "urgent" ? (
                    <Sprout className="w-5 h-5" />
                  ) : event.priority === "high" ? (
                    <Droplets className="w-5 h-5" />
                  ) : (
                    <Wrench className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{event.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(event.eventDate).toLocaleDateString(locale, {
                      weekday: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <Badge variant="outline" className={priorityColors[event.priority] || ""}>
                  {getPriorityLabel(event.priority)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

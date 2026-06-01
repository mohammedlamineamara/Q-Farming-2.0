import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CalendarDays, Plus, ChevronLeft, ChevronRight, Droplets, Sprout, Wrench } from "lucide-react";

export default function CalendarPage() {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();
  const { data: events } = trpc.calendar.list.useQuery();
  const { data: fields } = trpc.fields.list.useQuery();
  const { data: workers } = trpc.workers.list.useQuery();
  const createEvent = trpc.calendar.create.useMutation({
    onSuccess: () => {
      utils.calendar.list.invalidate();
      setOpen(false);
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

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

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
    low: "bg-slate-500/20 text-slate-400",
    medium: "bg-blue-500/20 text-blue-400",
    high: "bg-amber-500/20 text-amber-400",
    urgent: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/10 flex items-center justify-center border border-pink-500/20">
            <CalendarDays className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Smart Calendar & Scheduling</h1>
            <p className="text-sm text-slate-400">Plan and track your farm activities</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white gap-2">
              <Plus className="w-4 h-4" /> Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Add Calendar Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Event Title</Label>
                <Input
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="e.g., Field Inspection"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Date & Time</Label>
                <Input
                  className="bg-white/5 border-white/10 text-white"
                  type="datetime-local"
                  value={form.eventDate}
                  onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Field (Optional)</Label>
                <Select value={form.fieldId} onValueChange={(v) => setForm({ ...form, fieldId: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    {fields?.map((f) => (
                      <SelectItem key={f.id} value={String(f.id)}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Assign To (Optional)</Label>
                <Select value={form.workerId} onValueChange={(v) => setForm({ ...form, workerId: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select worker" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    {workers?.map((w) => (
                      <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) => setForm({ ...form, priority: v as typeof form.priority })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    {["low", "medium", "high", "urgent"].map((p) => (
                      <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
                Add Event
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/8 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                {monthNames[month]} {year}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
                  onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
                  onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-[10px] font-semibold text-slate-500 uppercase py-2">
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
                        ? "bg-gradient-to-br from-emerald-500 to-cyan-500 text-white font-bold shadow-lg shadow-emerald-500/20"
                        : "hover:bg-white/5 text-slate-300"
                    }`}
                  >
                    {day}
                    {hasEvents && !isToday && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/8 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-400" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {events?.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-sm">No upcoming events</div>
            )}
            {events?.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer hover:translate-x-1"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${priorityColors[event.priority]}`}
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
                  <div className="text-sm font-medium text-slate-200 truncate">{event.title}</div>
                  <div className="text-xs text-slate-500">
                    {new Date(event.eventDate).toLocaleDateString(undefined, {
                      weekday: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <Badge variant="outline" className={priorityColors[event.priority]}>
                  {event.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

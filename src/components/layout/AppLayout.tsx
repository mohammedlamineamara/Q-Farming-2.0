import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Tractor,
  Package,
  Radio,
  Users,
  BarChart3,
  CalendarDays,
  Brain,
  Settings,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  LogOut,
  Sprout,
  Cloud,
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Tractor, label: "Fields", path: "/fields" },
  { icon: Package, label: "Inventory", path: "/inventory" },
  { icon: Radio, label: "IoT Sensors", path: "/sensors" },
  { icon: Users, label: "Workers", path: "/workers" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: CalendarDays, label: "Calendar", path: "/calendar" },
  { icon: Brain, label: "AI Insights", path: "/ai" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { data: unreadNotifs } = trpc.notifications.unread.useQuery();
  const utils = trpc.useUtils();

  const markAllRead = trpc.notifications.markAllRead.useMutation({
    onSuccess: () => {
      utils.notifications.unread.invalidate();
      utils.notifications.list.invalidate();
    },
  });

  const { data: notifications } = trpc.notifications.list.useQuery();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const unreadCount = unreadNotifs?.length ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#111827] to-[#0f172a] text-slate-100">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/60 border-b border-white/8">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-300 hover:text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-white leading-tight">Q-Farming 2.0</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium leading-tight">AI Smart Agriculture ERP</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Systems Online
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-white/10 relative"
              onClick={() => setNotifOpen(!notifOpen)}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-[10px] font-bold border-2 border-slate-900">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-white/10"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/10">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name || ""} className="w-8 h-8 rounded-full ring-2 ring-emerald-500/30" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
              <span className="hidden md:block text-sm font-medium text-slate-200">{user?.name || "User"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Panel */}
      {notifOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setNotifOpen(false)} />
          <div className="fixed top-16 right-4 w-96 max-h-[70vh] overflow-y-auto z-[70] backdrop-blur-2xl bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl scrollbar-thin">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" /> Notifications
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                    onClick={() => markAllRead.mutate()}
                  >
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white" onClick={() => setNotifOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-2">
              {notifications?.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm">No notifications</div>
              )}
              {notifications?.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex gap-3 p-3 rounded-xl mb-1 transition-all cursor-pointer hover:bg-white/5 ${
                    !notif.read ? "bg-emerald-500/5 border-l-2 border-emerald-500" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center text-lg flex-shrink-0 border border-emerald-500/20">
                    {notif.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-200 truncate">{notif.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notif.description}</div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 z-40 w-64 backdrop-blur-xl bg-slate-900/80 border-r border-white/8 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="p-3 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/15 to-cyan-500/10 text-emerald-400 border border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <Icon className={`w-[18px] h-[18px] transition-transform group-hover:scale-110 ${isActive ? "text-emerald-400" : ""}`} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1 h-5 rounded-full bg-gradient-to-b from-emerald-400 to-cyan-400" />
                )}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-white/8">
            <button
              onClick={() => logout()}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
            >
              <LogOut className="w-[18px] h-[18px]" />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="glass-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <Cloud className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-medium text-slate-300">Weather</span>
            </div>
            <div className="text-lg font-bold text-white">32°C</div>
            <div className="text-xs text-slate-400">Sunny - Algiers</div>
            <div className="flex gap-3 mt-2 text-[10px] text-slate-500">
              <span>💧 45%</span>
              <span>💨 12km/h</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

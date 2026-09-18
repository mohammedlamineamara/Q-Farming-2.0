import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useI18n } from "@/i18n";
import { isRoleAuthorizedForRoute } from "@/rbac";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { LOGIN_PATH } from "@/const";
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
  LogOut,
  LogIn,
  Sprout,
  Cloud,
} from "lucide-react";

const sidebarNavItems = [
  { icon: LayoutDashboard, key: "nav.dashboard", path: "/" },
  { icon: Tractor, key: "nav.fields", path: "/fields" },
  { icon: Sprout, key: "nav.agriculture", path: "/agriculture" },
  { icon: Package, key: "nav.inventory", path: "/inventory" },
  { icon: Radio, key: "nav.sensors", path: "/sensors" },
  { icon: Users, key: "nav.workers", path: "/workers" },
  { icon: BarChart3, key: "nav.analytics", path: "/analytics" },
  { icon: CalendarDays, key: "nav.calendar", path: "/calendar" },
  { icon: Brain, key: "nav.aiInsights", path: "/ai" },
  { icon: Settings, key: "nav.settings", path: "/settings" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { t, language } = useI18n();
  const { data: unreadNotifs } = trpc.notifications.unread.useQuery();
  const utils = trpc.useUtils();

  const markAllRead = trpc.notifications.markAllRead.useMutation({
    onSuccess: () => {
      utils.notifications.unread.invalidate();
      utils.notifications.list.invalidate();
    },
  });

  const { data: notifications } = trpc.notifications.list.useQuery();
  const unreadCount = unreadNotifs?.length ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-white/10 transition-colors">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation menu"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  {t("app.title")}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-medium leading-tight">
                  {t("app.subtitle")}
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {t("app.systemReady")}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 relative"
              onClick={() => setNotifOpen(!notifOpen)}
              aria-label={t("notifications.title")}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-[10px] font-bold border-2 border-white dark:border-slate-900">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            {/* Language Selector Component */}
            <LanguageToggle />

            {/* Theme Toggle Component (Light / Dark / System) */}
            <ThemeToggle />

            <div className="ltr:ml-1 rtl:mr-1 ltr:pl-2 rtl:pr-2 ltr:border-l rtl:border-r border-slate-200 dark:border-white/10">
              <AccountMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Notification Panel */}
      {notifOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setNotifOpen(false)} />
          <div className="fixed top-16 ltr:right-4 rtl:left-4 w-96 max-h-[70vh] overflow-y-auto z-[70] backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl scrollbar-thin">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10">
              <h3 className="font-semibold text-sm flex items-center gap-2 text-slate-900 dark:text-white">
                <Bell className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> {t("notifications.title")}
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:bg-emerald-500/10"
                    onClick={() => markAllRead.mutate()}
                  >
                    {t("notifications.markAllRead")}
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-700 dark:hover:text-white" onClick={() => setNotifOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-2">
              {notifications?.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">{t("notifications.noNotifications")}</div>
              )}
              {notifications?.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex gap-3 p-3 rounded-xl mb-1 transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 ${
                    !notif.read ? "bg-emerald-500/10 ltr:border-l-2 rtl:border-r-2 border-emerald-500 dark:bg-emerald-500/5" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-lg flex-shrink-0 border border-emerald-500/20">
                    {notif.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">{notif.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{notif.description}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                      {new Date(notif.createdAt).toLocaleDateString(
                        language === "ar" ? "ar-DZ" : language === "fr" ? "fr-FR" : "en-US"
                      )}
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
        className={`fixed top-16 ltr:left-0 rtl:right-0 bottom-0 z-40 w-64 backdrop-blur-xl bg-white/90 dark:bg-slate-900/80 ltr:border-r rtl:border-l border-slate-200/80 dark:border-white/10 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"
        }`}
      >
        <nav className="p-3 space-y-1">
          {sidebarNavItems
            .filter((item) => isRoleAuthorizedForRoute(user?.role, item.path))
            .map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200/80 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Icon className={`w-[18px] h-[18px] transition-transform group-hover:scale-110 ${isActive ? "text-emerald-600 dark:text-emerald-400" : ""}`} />
                <span>{t(item.key)}</span>
                {isActive && (
                  <div className="ms-auto w-1.5 h-5 rounded-full bg-emerald-500 dark:bg-gradient-to-b dark:from-emerald-400 dark:to-cyan-400" />
                )}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-200/80 dark:border-white/10">
            {isAuthenticated && user ? (
              <button
                id="sidebar-logout-btn"
                onClick={() => logout()}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-all w-full cursor-pointer"
                aria-label={t("nav.logout")}
              >
                <LogOut className="w-[18px] h-[18px]" />
                <span>{t("nav.logout")}</span>
              </button>
            ) : (
              <Link
                id="sidebar-login-btn"
                to={LOGIN_PATH}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all w-full"
                aria-label={t("account.login")}
              >
                <LogIn className="w-[18px] h-[18px]" />
                <span>{t("account.login")}</span>
              </Link>
            )}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-4 ltr:left-4 rtl:right-4 ltr:right-4 rtl:left-4">
          <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Cloud className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t("nav.climateOverview")}</span>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">32°C</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{t("nav.algiersRegion")}</div>
            <div className="flex gap-3 mt-2 text-[10px] font-medium text-slate-600 dark:text-slate-400">
              <span>{t("nav.humidity")}</span>
              <span>{t("nav.wind")}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-16 ltr:lg:pl-64 rtl:lg:pr-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

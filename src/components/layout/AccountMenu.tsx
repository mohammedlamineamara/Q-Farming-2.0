import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n";
import { hasPermission } from "@/rbac";
import { RoleBadge } from "@/components/rbac/RoleBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  Settings,
  Users,
  History,
  FileText,
  ChevronDown,
  Shield,
} from "lucide-react";
import { LOGIN_PATH } from "@/const";

export function AccountMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t, dir } = useI18n();
  const navigate = useNavigate();

  const isRtl = dir === "rtl";
  const userRole = user?.role;

  // Unauthenticated view: prominent Login button + guest menu
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button
          id="header-login-btn"
          onClick={() => navigate(LOGIN_PATH)}
          className="h-9 px-3 sm:px-4 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white shadow-xs shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200 border border-emerald-400/20 flex items-center gap-2 cursor-pointer"
          aria-label={t("account.login")}
        >
          <LogIn className="w-4 h-4" />
          <span>{t("account.login")}</span>
        </Button>

        <DropdownMenu dir={dir}>
          <DropdownMenuTrigger asChild>
            <button
              id="guest-menu-trigger"
              className="p-2 rounded-xl border border-slate-200/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 transition-all min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
              aria-label={t("account.menuTitle")}
            >
              <User className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={isRtl ? "start" : "end"}
            sideOffset={8}
            className="w-56 p-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl z-50 text-slate-900 dark:text-white"
          >
            <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 mb-1.5 text-xs">
              <div className="font-semibold text-slate-800 dark:text-slate-200">{t("account.guest")}</div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">{t("account.guestDescription")}</div>
            </div>
            <DropdownMenuItem asChild>
              <Link
                to={LOGIN_PATH}
                className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl cursor-pointer text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 font-medium"
              >
                <LogIn className="w-4 h-4" />
                <span>{t("account.login")}</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Permissions for future/extensible items based on existing RBAC
  const canSeeUserManagement = hasPermission(userRole, "users.view");
  const canSeeRoleManagement = hasPermission(userRole, "roles.view");
  const canSeeReports = hasPermission(userRole, "reports.view") || hasPermission(userRole, "analytics.view");
  const canSeeAuditLog = hasPermission(userRole, "system.admin");

  return (
    <DropdownMenu dir={dir}>
      <DropdownMenuTrigger asChild>
        <button
          id="account-menu-trigger"
          className="flex items-center gap-2 py-1 px-1.5 sm:px-2 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-white/10 hover:bg-slate-100/80 dark:hover:bg-white/5 transition-all duration-200 outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 min-h-[44px] cursor-pointer"
          aria-label={t("account.manageAccount")}
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name || "User avatar"}
              className="w-8 h-8 rounded-full ring-2 ring-emerald-500/30 object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shadow-xs">
              {user.name?.charAt(0) || "U"}
            </div>
          )}

          <div className="hidden md:flex flex-col items-start leading-none text-start">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
              {user.name || "User"}
            </span>
            <span className="mt-1">
              <RoleBadge role={userRole} size="sm" />
            </span>
          </div>

          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        id="account-menu-dropdown"
        align={isRtl ? "start" : "end"}
        sideOffset={8}
        className="w-64 sm:w-72 p-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl z-50 text-slate-900 dark:text-white"
      >
        {/* User Identity Header */}
        <div className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 mb-1.5">
          <div className="flex items-center gap-2.5">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || "User avatar"}
                className="w-9 h-9 rounded-full ring-2 ring-emerald-500/30 object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shadow-xs">
                {user.name?.charAt(0) || "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate text-slate-900 dark:text-white">
                {user.name || "User"}
              </div>
              {user.email && (
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </div>
              )}
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-white/5">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {t("rbac.roleLabel")}:
            </span>
            <RoleBadge role={userRole} size="sm" />
          </div>
        </div>

        {/* Primary Account Actions */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              to="/settings"
              className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>{t("account.profile")}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              to="/settings"
              className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>{t("account.myRole")}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              to="/settings"
              className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>{t("account.settings")}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Future Permissions & Extensible Management Sections (Role-Aware) */}
        {(canSeeUserManagement || canSeeRoleManagement || canSeeReports || canSeeAuditLog) && (
          <>
            <DropdownMenuSeparator className="my-1.5 bg-slate-200 dark:bg-white/10" />
            <DropdownMenuLabel className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              {t("account.futureFeatures")}
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {canSeeUserManagement && (
                <DropdownMenuItem
                  disabled
                  className="flex items-center justify-between px-3 py-2 text-sm rounded-xl opacity-60 cursor-not-allowed"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{t("account.userManagement")}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-slate-300 dark:border-white/20 text-slate-500">
                    {t("account.comingSoon")}
                  </Badge>
                </DropdownMenuItem>
              )}

              {canSeeRoleManagement && (
                <DropdownMenuItem
                  disabled
                  className="flex items-center justify-between px-3 py-2 text-sm rounded-xl opacity-60 cursor-not-allowed"
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span>{t("account.roleManagement")}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-slate-300 dark:border-white/20 text-slate-500">
                    {t("account.comingSoon")}
                  </Badge>
                </DropdownMenuItem>
              )}

              {canSeeAuditLog && (
                <DropdownMenuItem
                  disabled
                  className="flex items-center justify-between px-3 py-2 text-sm rounded-xl opacity-60 cursor-not-allowed"
                >
                  <div className="flex items-center gap-2.5">
                    <History className="w-4 h-4 text-slate-400" />
                    <span>{t("account.activityLog")}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-slate-300 dark:border-white/20 text-slate-500">
                    {t("account.comingSoon")}
                  </Badge>
                </DropdownMenuItem>
              )}

              {canSeeReports && (
                <DropdownMenuItem
                  disabled
                  className="flex items-center justify-between px-3 py-2 text-sm rounded-xl opacity-60 cursor-not-allowed"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>{t("account.reports")}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-slate-300 dark:border-white/20 text-slate-500">
                    {t("account.comingSoon")}
                  </Badge>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </>
        )}

        {/* Logout Action */}
        <DropdownMenuSeparator className="my-1.5 bg-slate-200 dark:bg-white/10" />
        <DropdownMenuItem
          id="account-menu-logout-btn"
          onClick={() => logout()}
          className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 focus:bg-red-50 dark:focus:bg-red-500/10 cursor-pointer font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>{t("account.logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

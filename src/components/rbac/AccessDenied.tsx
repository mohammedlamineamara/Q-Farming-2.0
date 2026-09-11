import { Link } from "react-router";
import { useI18n } from "@/i18n";
import { useAuth } from "@/hooks/useAuth";
import { RoleBadge } from "./RoleBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert, ArrowLeft, ArrowRight } from "lucide-react";

interface AccessDeniedProps {
  requiredPermission?: string;
}

export function AccessDenied({ requiredPermission }: AccessDeniedProps) {
  const { t, dir } = useI18n();
  const { user } = useAuth();
  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="min-h-[60vh] flex items-center justify-center p-4"
    >
      <Card className="max-w-md w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl">
        <CardContent className="pt-8 pb-8 px-6 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 dark:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 mx-auto shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t("rbac.accessDenied.title")}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {t("rbac.accessDenied.message")}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {t("rbac.accessDenied.currentRole")}:
            </span>
            <RoleBadge role={user?.role} size="sm" />
          </div>

          {requiredPermission && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              {t("rbac.accessDenied.requiredCode")}:{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {requiredPermission}
              </code>
            </p>
          )}

          <div className="pt-2">
            <Button asChild className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white gap-2 font-medium shadow-sm">
              <Link to="/">
                <span>{t("rbac.accessDenied.backToDashboard")}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useI18n } from "@/i18n";
import { normalizeRole, type Role } from "@/rbac";
import { ShieldCheck, UserCheck, HardHat } from "lucide-react";

interface RoleBadgeProps {
  role?: string | null;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function RoleBadge({
  role,
  size = "md",
  showIcon = true,
  className = "",
}: RoleBadgeProps) {
  const { t } = useI18n();
  const normalizedRole: Role = normalizeRole(role);

  const roleLabels: Record<Role, string> = {
    admin: t("rbac.roles.admin"),
    manager: t("rbac.roles.manager"),
    worker: t("rbac.roles.worker"),
  };

  const roleStyles: Record<Role, string> = {
    admin:
      "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 hover:bg-purple-500/20",
    manager:
      "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30 hover:bg-sky-500/20",
    worker:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20",
  };

  const sizeStyles: Record<"sm" | "md" | "lg", string> = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-0.5 gap-1.5",
    lg: "text-sm px-3 py-1 gap-2 font-medium",
  };

  const iconSizes: Record<"sm" | "md" | "lg", string> = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  const icons: Record<Role, React.ComponentType<{ className?: string }>> = {
    admin: ShieldCheck,
    manager: UserCheck,
    worker: HardHat,
  };

  const Icon = icons[normalizedRole];
  const label = roleLabels[normalizedRole];

  return (
    <span
      role="status"
      aria-label={`${t("rbac.roleLabel")}: ${label}`}
      className={`inline-flex items-center rounded-full font-semibold border transition-colors select-none ${roleStyles[normalizedRole]} ${sizeStyles[size]} ${className}`}
    >
      {showIcon && <Icon className={`${iconSizes[size]} shrink-0`} />}
      <span className="whitespace-nowrap">{label}</span>
    </span>
  );
}

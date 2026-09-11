export type Role = "admin" | "manager" | "worker";

export type Permission =
  | "dashboard.view"
  | "fields.view"
  | "fields.create"
  | "fields.update"
  | "fields.delete"
  | "inventory.view"
  | "inventory.create"
  | "inventory.update"
  | "inventory.delete"
  | "sensors.view"
  | "sensors.read"
  | "sensors.create"
  | "sensors.update"
  | "sensors.delete"
  | "workers.view"
  | "workers.create"
  | "workers.update"
  | "workers.delete"
  | "activities.view"
  | "activities.create"
  | "activities.update"
  | "activities.delete"
  | "calendar.view"
  | "calendar.create"
  | "calendar.update"
  | "calendar.delete"
  | "notifications.view"
  | "notifications.manage"
  | "analytics.view"
  | "aiInsights.view"
  | "ai.view"
  | "reports.view"
  | "reports.generate"
  | "reports.export"
  | "settings.view"
  | "settings.manage"
  | "users.view"
  | "users.create"
  | "users.update"
  | "users.delete"
  | "roles.view"
  | "roles.manage"
  | "system.admin";

export function normalizeRole(rawRole?: string | null): Role {
  if (!rawRole) return "worker";
  const lower = rawRole.toLowerCase().trim();
  if (lower === "admin" || lower === "administrator") return "admin";
  if (
    lower === "manager" ||
    lower === "farm_manager" ||
    lower === "agronomist" ||
    lower === "gestionnaire"
  ) {
    return "manager";
  }
  return "worker";
}

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  admin: [
    "dashboard.view",
    "fields.view",
    "fields.create",
    "fields.update",
    "fields.delete",
    "inventory.view",
    "inventory.create",
    "inventory.update",
    "inventory.delete",
    "sensors.view",
    "sensors.read",
    "sensors.create",
    "sensors.update",
    "sensors.delete",
    "workers.view",
    "workers.create",
    "workers.update",
    "workers.delete",
    "activities.view",
    "activities.create",
    "activities.update",
    "activities.delete",
    "calendar.view",
    "calendar.create",
    "calendar.update",
    "calendar.delete",
    "notifications.view",
    "notifications.manage",
    "analytics.view",
    "aiInsights.view",
    "ai.view",
    "reports.view",
    "reports.generate",
    "reports.export",
    "settings.view",
    "settings.manage",
    "users.view",
    "users.create",
    "users.update",
    "users.delete",
    "roles.view",
    "roles.manage",
    "system.admin",
  ],
  manager: [
    "dashboard.view",
    "fields.view",
    "fields.create",
    "fields.update",
    "fields.delete",
    "inventory.view",
    "inventory.create",
    "inventory.update",
    "inventory.delete",
    "sensors.view",
    "sensors.read",
    "sensors.create",
    "sensors.update",
    "sensors.delete",
    "workers.view",
    "workers.create",
    "workers.update",
    "activities.view",
    "activities.create",
    "activities.update",
    "calendar.view",
    "calendar.create",
    "calendar.update",
    "calendar.delete",
    "notifications.view",
    "notifications.manage",
    "analytics.view",
    "aiInsights.view",
    "ai.view",
    "reports.view",
    "reports.generate",
    "reports.export",
    "settings.view",
    "settings.manage",
  ],
  worker: [
    "dashboard.view",
    "fields.view",
    "inventory.view",
    "sensors.view",
    "sensors.read",
    "calendar.view",
    "notifications.view",
    "activities.view",
    "settings.view",
  ],
};

export function hasPermission(
  role: string | null | undefined,
  permission: Permission
): boolean {
  if (!role) return false;
  const lower = role.toLowerCase().trim();
  if (
    lower !== "admin" &&
    lower !== "administrator" &&
    lower !== "manager" &&
    lower !== "farm_manager" &&
    lower !== "agronomist" &&
    lower !== "gestionnaire" &&
    lower !== "worker"
  ) {
    return false;
  }
  const normalized = normalizeRole(role);
  return ROLE_PERMISSIONS[normalized]?.includes(permission) ?? false;
}

export function hasAllPermissions(
  role: string | null | undefined,
  permissions: Permission[]
): boolean {
  if (!role) return false;
  return permissions.every((p) => hasPermission(role, p));
}

export function hasAnyPermission(
  role: string | null | undefined,
  permissions: Permission[]
): boolean {
  if (!role) return false;
  return permissions.some((p) => hasPermission(role, p));
}

export const ROUTE_PERMISSIONS: Record<string, Permission> = {
  "/": "dashboard.view",
  "/fields": "fields.view",
  "/inventory": "inventory.view",
  "/sensors": "sensors.view",
  "/workers": "workers.view",
  "/analytics": "analytics.view",
  "/calendar": "calendar.view",
  "/ai": "aiInsights.view",
  "/settings": "settings.view",
};

export function isRoleAuthorizedForRoute(
  role: string | null | undefined,
  path: string
): boolean {
  if (!role) return false;
  const lower = role.toLowerCase().trim();
  if (
    lower !== "admin" &&
    lower !== "administrator" &&
    lower !== "manager" &&
    lower !== "farm_manager" &&
    lower !== "agronomist" &&
    lower !== "gestionnaire" &&
    lower !== "worker"
  ) {
    return false;
  }
  const required = ROUTE_PERMISSIONS[path];
  if (!required) return true;
  return hasPermission(role, required);
}

export function getRoleDisplayName(role: string | null | undefined): string {
  const normalized = normalizeRole(role);
  switch (normalized) {
    case "admin":
      return "Admin";
    case "manager":
      return "Manager";
    case "worker":
      return "Worker";
  }
}

export function getRoleBadgeVariant(role: string | null | undefined): Role {
  return normalizeRole(role);
}

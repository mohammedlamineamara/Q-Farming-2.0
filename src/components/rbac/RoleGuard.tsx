import React from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  hasPermission,
  normalizeRole,
  type Permission,
  type Role,
} from "@/rbac";
import { AccessDenied } from "./AccessDenied";

interface RoleGuardProps {
  requiredPermission?: Permission;
  requiredRole?: Role | Role[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Route/component-level guard for protecting whole views or sections.
 * If the user is unauthorized, renders the translated AccessDenied page by default.
 */
export function RoleGuard({
  requiredPermission,
  requiredRole,
  fallback,
  children,
}: RoleGuardProps) {
  const { user } = useAuth();
  const userRole = user?.role;

  if (requiredRole) {
    const userNorm = normalizeRole(userRole);
    const allowed = Array.isArray(requiredRole)
      ? requiredRole.includes(userNorm)
      : userNorm === requiredRole;
    if (!allowed) {
      return fallback !== undefined ? <>{fallback}</> : <AccessDenied />;
    }
  }

  if (requiredPermission) {
    if (!hasPermission(userRole, requiredPermission)) {
      return (
        fallback !== undefined ? (
          <>{fallback}</>
        ) : (
          <AccessDenied requiredPermission={requiredPermission} />
        )
      );
    }
  }

  return <>{children}</>;
}

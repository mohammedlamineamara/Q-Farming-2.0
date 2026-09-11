import React from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  normalizeRole,
  type Permission,
  type Role,
} from "@/rbac";

interface CanProps {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  role?: Role | Role[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Reusable permission component that renders children only if the current authenticated
 * user holds the necessary RBAC permission(s) or role(s).
 */
export function Can({
  permission,
  permissions,
  requireAll = false,
  role,
  fallback = null,
  children,
}: CanProps) {
  const { user } = useAuth();
  const userRole = user?.role;

  // If specific role(s) specified
  if (role) {
    const userNorm = normalizeRole(userRole);
    const allowed = Array.isArray(role) ? role.includes(userNorm) : userNorm === role;
    if (!allowed) {
      return <>{fallback}</>;
    }
  }

  // Single permission check
  if (permission) {
    if (!hasPermission(userRole, permission)) {
      return <>{fallback}</>;
    }
  }

  // Multiple permissions check
  if (permissions && permissions.length > 0) {
    const allowed = requireAll
      ? hasAllPermissions(userRole, permissions)
      : hasAnyPermission(userRole, permissions);
    if (!allowed) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

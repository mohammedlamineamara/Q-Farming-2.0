import { describe, it, expect } from "vitest";
import {
  type Role,
  ROLE_PERMISSIONS,
  hasPermission,
  isRoleAuthorizedForRoute,
  getRoleDisplayName,
  getRoleBadgeVariant,
} from "./index";

describe("RBAC Permissions Matrix", () => {
  it("should define permissions for all three roles: admin, manager, worker", () => {
    expect(ROLE_PERMISSIONS.admin).toBeDefined();
    expect(ROLE_PERMISSIONS.manager).toBeDefined();
    expect(ROLE_PERMISSIONS.worker).toBeDefined();
  });

  describe("Admin Role", () => {
    const admin: Role = "admin";

    it("should have unrestricted access to all critical permissions", () => {
      expect(hasPermission(admin, "dashboard.view")).toBe(true);
      expect(hasPermission(admin, "fields.create")).toBe(true);
      expect(hasPermission(admin, "fields.delete")).toBe(true);
      expect(hasPermission(admin, "inventory.create")).toBe(true);
      expect(hasPermission(admin, "inventory.delete")).toBe(true);
      expect(hasPermission(admin, "workers.view")).toBe(true);
      expect(hasPermission(admin, "workers.create")).toBe(true);
      expect(hasPermission(admin, "workers.delete")).toBe(true);
      expect(hasPermission(admin, "analytics.view")).toBe(true);
      expect(hasPermission(admin, "ai.view")).toBe(true);
      expect(hasPermission(admin, "system.admin")).toBe(true);
    });

    it("should be authorized for every application route", () => {
      const routes = [
        "/",
        "/fields",
        "/inventory",
        "/sensors",
        "/workers",
        "/analytics",
        "/calendar",
        "/ai",
        "/settings",
      ];
      for (const route of routes) {
        expect(isRoleAuthorizedForRoute(admin, route)).toBe(true);
      }
    });
  });

  describe("Manager Role", () => {
    const manager: Role = "manager";

    it("should have operational permissions for fields, inventory, analytics, and ai", () => {
      expect(hasPermission(manager, "dashboard.view")).toBe(true);
      expect(hasPermission(manager, "fields.view")).toBe(true);
      expect(hasPermission(manager, "fields.create")).toBe(true);
      expect(hasPermission(manager, "inventory.create")).toBe(true);
      expect(hasPermission(manager, "workers.view")).toBe(true);
      expect(hasPermission(manager, "analytics.view")).toBe(true);
      expect(hasPermission(manager, "ai.view")).toBe(true);
    });

    it("should NOT have administrative destructive permissions", () => {
      expect(hasPermission(manager, "workers.delete")).toBe(false);
      expect(hasPermission(manager, "system.admin")).toBe(false);
      expect(hasPermission(manager, "users.create")).toBe(false);
      expect(hasPermission(manager, "users.delete")).toBe(false);
      expect(hasPermission(manager, "roles.manage")).toBe(false);
    });

    it("should be authorized to access all dashboard pages including analytics and workers directory", () => {
      expect(isRoleAuthorizedForRoute(manager, "/")).toBe(true);
      expect(isRoleAuthorizedForRoute(manager, "/fields")).toBe(true);
      expect(isRoleAuthorizedForRoute(manager, "/inventory")).toBe(true);
      expect(isRoleAuthorizedForRoute(manager, "/sensors")).toBe(true);
      expect(isRoleAuthorizedForRoute(manager, "/workers")).toBe(true);
      expect(isRoleAuthorizedForRoute(manager, "/analytics")).toBe(true);
      expect(isRoleAuthorizedForRoute(manager, "/ai")).toBe(true);
      expect(isRoleAuthorizedForRoute(manager, "/calendar")).toBe(true);
      expect(isRoleAuthorizedForRoute(manager, "/settings")).toBe(true);
    });
  });

  describe("Worker Role", () => {
    const worker: Role = "worker";

    it("should have read-only access to primary field operations and telemetry", () => {
      expect(hasPermission(worker, "dashboard.view")).toBe(true);
      expect(hasPermission(worker, "fields.view")).toBe(true);
      expect(hasPermission(worker, "inventory.view")).toBe(true);
      expect(hasPermission(worker, "sensors.view")).toBe(true);
      expect(hasPermission(worker, "sensors.read")).toBe(true);
      expect(hasPermission(worker, "calendar.view")).toBe(true);
    });

    it("should be restricted from mutation and administrative permissions", () => {
      expect(hasPermission(worker, "fields.create")).toBe(false);
      expect(hasPermission(worker, "fields.delete")).toBe(false);
      expect(hasPermission(worker, "inventory.create")).toBe(false);
      expect(hasPermission(worker, "inventory.delete")).toBe(false);
      expect(hasPermission(worker, "workers.view")).toBe(false);
      expect(hasPermission(worker, "workers.create")).toBe(false);
      expect(hasPermission(worker, "workers.delete")).toBe(false);
      expect(hasPermission(worker, "analytics.view")).toBe(false);
      expect(hasPermission(worker, "ai.view")).toBe(false);
      expect(hasPermission(worker, "system.admin")).toBe(false);
    });

    it("should only be authorized for essential frontline routes and denied restricted routes", () => {
      expect(isRoleAuthorizedForRoute(worker, "/")).toBe(true);
      expect(isRoleAuthorizedForRoute(worker, "/fields")).toBe(true);
      expect(isRoleAuthorizedForRoute(worker, "/inventory")).toBe(true);
      expect(isRoleAuthorizedForRoute(worker, "/sensors")).toBe(true);
      expect(isRoleAuthorizedForRoute(worker, "/calendar")).toBe(true);
      expect(isRoleAuthorizedForRoute(worker, "/settings")).toBe(true);

      // Restricted routes
      expect(isRoleAuthorizedForRoute(worker, "/workers")).toBe(false);
      expect(isRoleAuthorizedForRoute(worker, "/analytics")).toBe(false);
      expect(isRoleAuthorizedForRoute(worker, "/ai")).toBe(false);
    });
  });

  describe("Graceful Fallbacks & Defensive Handling", () => {
    it("should safely default unauthenticated or unknown roles to least privilege", () => {
      expect(hasPermission(null, "dashboard.view")).toBe(false);
      expect(hasPermission(undefined, "fields.view")).toBe(false);
      expect(hasPermission("guest" as Role, "dashboard.view")).toBe(false);

      expect(isRoleAuthorizedForRoute(null, "/fields")).toBe(false);
      expect(isRoleAuthorizedForRoute(undefined, "/workers")).toBe(false);
      expect(isRoleAuthorizedForRoute("unknown" as Role, "/analytics")).toBe(false);
    });

    it("should return correct role display names and badge variants", () => {
      expect(getRoleDisplayName("admin")).toBe("Admin");
      expect(getRoleDisplayName("manager")).toBe("Manager");
      expect(getRoleDisplayName("worker")).toBe("Worker");

      expect(getRoleBadgeVariant("admin")).toBe("admin");
      expect(getRoleBadgeVariant("manager")).toBe("manager");
      expect(getRoleBadgeVariant("worker")).toBe("worker");
    });
  });

  describe("Multilingual RBAC Dictionaries (Arabic, English, French)", () => {
    it("should have complete RBAC translations in Arabic, English, and French", async () => {
      const { ar } = await import("@/i18n/locales/ar");
      const { en } = await import("@/i18n/locales/en");
      const { fr } = await import("@/i18n/locales/fr");

      // Role names
      expect(ar.rbac.roles.admin).toBe("مدير النظام");
      expect(en.rbac.roles.admin).toBe("Administrator");
      expect(fr.rbac.roles.admin).toBe("Administrateur");

      expect(ar.rbac.roles.manager).toBe("مدير");
      expect(en.rbac.roles.manager).toBe("Manager");
      expect(fr.rbac.roles.manager).toBe("Gestionnaire");

      expect(ar.rbac.roles.worker).toBe("عامل");
      expect(en.rbac.roles.worker).toBe("Worker");
      expect(fr.rbac.roles.worker).toBe("Ouvrier");

      // Access Denied messages
      expect(ar.rbac.accessDenied.title).toBeTruthy();
      expect(en.rbac.accessDenied.title).toBe("Access Denied");
      expect(fr.rbac.accessDenied.title).toBe("Accès Refusé");

      // Capabilities keys in all 3 languages
      const capKeys = [
        "dashboardView",
        "fieldsManage",
        "fieldsDelete",
        "inventoryManage",
        "inventoryDelete",
        "sensorsManage",
        "workersView",
        "workersManage",
        "workersDelete",
        "analyticsView",
        "aiInsightsView",
        "calendarManage",
        "systemAdmin",
      ] as const;

      for (const key of capKeys) {
        expect(ar.rbac.myRole.capabilities[key]).toBeTruthy();
        expect(en.rbac.myRole.capabilities[key]).toBeTruthy();
        expect(fr.rbac.myRole.capabilities[key]).toBeTruthy();
      }
    });
  });
});

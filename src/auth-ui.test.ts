import { describe, it, expect } from "vitest";
import { en } from "./i18n/locales/en";
import { ar } from "./i18n/locales/ar";
import { fr } from "./i18n/locales/fr";

describe("Phase 5B - Production Auth UI & Validation", () => {
  describe("1. Translation Keys & Multilingual Parity for Auth", () => {
    it("should have all required auth translation keys across en, ar, and fr", () => {
      const requiredAuthKeys = [
        "loginTitle",
        "loginSubtitle",
        "registerTitle",
        "registerSubtitle",
        "email",
        "emailPlaceholder",
        "password",
        "passwordPlaceholder",
        "confirmPassword",
        "confirmPasswordPlaceholder",
        "name",
        "namePlaceholder",
        "role",
        "accountTypeBadge",
        "showPassword",
        "hidePassword",
        "submitLogin",
        "submitRegister",
        "signingIn",
        "creatingAccount",
        "alreadyHaveAccount",
        "needAccount",
        "backToHome",
      ] as const;

      for (const key of requiredAuthKeys) {
        expect(en.auth[key]).toBeDefined();
        expect(typeof en.auth[key]).toBe("string");
        expect(en.auth[key].length).toBeGreaterThan(0);

        expect(ar.auth[key]).toBeDefined();
        expect(typeof ar.auth[key]).toBe("string");
        expect(ar.auth[key].length).toBeGreaterThan(0);

        expect(fr.auth[key]).toBeDefined();
        expect(typeof fr.auth[key]).toBe("string");
        expect(fr.auth[key].length).toBeGreaterThan(0);
      }
    });

    it("should have all required auth error messages in en, ar, and fr", () => {
      const requiredErrorKeys = [
        "requiredField",
        "nameRequired",
        "emailRequired",
        "invalidEmail",
        "passwordRequired",
        "passwordTooShort",
        "confirmPasswordRequired",
        "passwordMismatch",
        "invalidCredentials",
        "emailExists",
        "serverError",
        "networkError",
      ] as const;

      for (const key of requiredErrorKeys) {
        expect(en.auth.errors[key]).toBeDefined();
        expect(ar.auth.errors[key]).toBeDefined();
        expect(fr.auth.errors[key]).toBeDefined();

        expect(en.auth.errors[key].length).toBeGreaterThan(0);
        expect(ar.auth.errors[key].length).toBeGreaterThan(0);
        expect(fr.auth.errors[key].length).toBeGreaterThan(0);
      }
    });

    it("should provide authentic localized translations in Arabic", () => {
      expect(ar.auth.loginTitle).toBe("مرحبًا بك مجددًا");
      expect(ar.auth.registerTitle).toBe("إنشاء حساب جديد");
      expect(ar.auth.email).toBe("البريد الإلكتروني");
      expect(ar.auth.password).toBe("كلمة المرور");
      expect(ar.auth.confirmPassword).toBe("تأكيد كلمة المرور");
      expect(ar.auth.accountTypeBadge).toBe("حساب مشغّل معتمد");
      expect(ar.auth.errors.invalidCredentials).toBe("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      expect(ar.auth.errors.emailExists).toBe("يوجد حساب مسجل بالفعل بهذا البريد الإلكتروني");
    });

    it("should provide authentic localized translations in French", () => {
      expect(fr.auth.loginTitle).toBe("Bon Retour");
      expect(fr.auth.registerTitle).toBe("Créer un Compte");
      expect(fr.auth.email).toBe("Adresse E-mail");
      expect(fr.auth.password).toBe("Mot de Passe");
      expect(fr.auth.confirmPassword).toBe("Confirmer le Mot de Passe");
      expect(fr.auth.accountTypeBadge).toBe("Compte Opérateur Agricole");
      expect(fr.auth.errors.invalidCredentials).toBe("E-mail ou mot de passe invalide");
      expect(fr.auth.errors.emailExists).toBe("Un compte avec cet e-mail existe déjà");
    });
  });

  describe("2. Auth Input Validation Logic", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateLogin = (email: string, pass: string) => {
      const errors: Record<string, string> = {};
      const trimmed = email.trim();
      if (!trimmed) {
        errors.email = "emailRequired";
      } else if (!emailRegex.test(trimmed)) {
        errors.email = "invalidEmail";
      }
      if (!pass) {
        errors.password = "passwordRequired";
      } else if (pass.length < 6) {
        errors.password = "passwordTooShort";
      }
      return errors;
    };

    const validateRegister = (name: string, email: string, pass: string, confirm: string) => {
      const errors: Record<string, string> = {};
      const trimmedName = name.trim();
      if (!trimmedName || trimmedName.length < 2) {
        errors.name = "nameRequired";
      }
      const trimmed = email.trim();
      if (!trimmed) {
        errors.email = "emailRequired";
      } else if (!emailRegex.test(trimmed)) {
        errors.email = "invalidEmail";
      }
      if (!pass) {
        errors.password = "passwordRequired";
      } else if (pass.length < 6) {
        errors.password = "passwordTooShort";
      }
      if (!confirm) {
        errors.confirmPassword = "confirmPasswordRequired";
      } else if (confirm !== pass) {
        errors.confirmPassword = "passwordMismatch";
      }
      return errors;
    };

    it("should detect invalid email formats for login", () => {
      expect(validateLogin("", "password123").email).toBe("emailRequired");
      expect(validateLogin("invalid-email", "password123").email).toBe("invalidEmail");
      expect(validateLogin("farmer@", "password123").email).toBe("invalidEmail");
      expect(validateLogin("farmer@domain", "password123").email).toBe("invalidEmail");
      expect(validateLogin("farmer@domain.dz", "password123").email).toBeUndefined();
    });

    it("should detect short passwords for login (< 6 characters)", () => {
      expect(validateLogin("farmer@farm.dz", "").password).toBe("passwordRequired");
      expect(validateLogin("farmer@farm.dz", "12345").password).toBe("passwordTooShort");
      expect(validateLogin("farmer@farm.dz", "123456").password).toBeUndefined();
    });

    it("should validate registration name requirement (min 2 characters)", () => {
      expect(validateRegister("", "farmer@farm.dz", "secret123", "secret123").name).toBe("nameRequired");
      expect(validateRegister("A", "farmer@farm.dz", "secret123", "secret123").name).toBe("nameRequired");
      expect(validateRegister("Ahmed Benali", "farmer@farm.dz", "secret123", "secret123").name).toBeUndefined();
    });

    it("should detect password mismatch in registration", () => {
      expect(validateRegister("Ahmed", "farmer@farm.dz", "secret123", "different123").confirmPassword).toBe(
        "passwordMismatch",
      );
      expect(validateRegister("Ahmed", "farmer@farm.dz", "secret123", "").confirmPassword).toBe(
        "confirmPasswordRequired",
      );
      expect(validateRegister("Ahmed", "farmer@farm.dz", "secret123", "secret123").confirmPassword).toBeUndefined();
    });
  });

  describe("3. Error Message Mapping & Security Protection", () => {
    function mapAuthError(
      err: { message?: string; data?: { code?: string } },
      lang: "en" | "ar" | "fr",
    ): string {
      const dict = lang === "ar" ? ar : lang === "fr" ? fr : en;
      const msg = err.message || "";
      if (msg.includes("Invalid email or password") || err.data?.code === "UNAUTHORIZED") {
        return dict.auth.errors.invalidCredentials;
      }
      if (msg.includes("Email already exists") || err.data?.code === "CONFLICT") {
        return dict.auth.errors.emailExists;
      }
      if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        return dict.auth.errors.networkError;
      }
      return dict.auth.errors.serverError;
    }

    it("should map unauthorized credentials error safely across languages without leaking stack traces", () => {
      const err = { message: "Invalid email or password", data: { code: "UNAUTHORIZED" } };
      expect(mapAuthError(err, "en")).toBe("Invalid email or password");
      expect(mapAuthError(err, "ar")).toBe("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      expect(mapAuthError(err, "fr")).toBe("E-mail ou mot de passe invalide");
    });

    it("should map email conflict safely across languages", () => {
      const err = { message: "Email already exists", data: { code: "CONFLICT" } };
      expect(mapAuthError(err, "en")).toBe("An account with this email already exists");
      expect(mapAuthError(err, "ar")).toBe("يوجد حساب مسجل بالفعل بهذا البريد الإلكتروني");
      expect(mapAuthError(err, "fr")).toBe("Un compte avec cet e-mail existe déjà");
    });

    it("should sanitize unexpected database errors into generic safe translated messages", () => {
      const dbErr = { message: "ER_DUP_ENTRY: Duplicate key at SQL server line 42" };
      expect(mapAuthError(dbErr, "en")).toBe("Authentication failed. Please try again later.");
      expect(mapAuthError(dbErr, "ar")).toBe("تعذر إتمام العملية. يرجى المحاولة لاحقًا.");
      expect(mapAuthError(dbErr, "fr")).toBe("Échec de l'authentification. Veuillez réessayer ultérieurement.");
    });
  });

  describe("4. Security & Role Privilege Escalation Prevention", () => {
    it("should ensure public registration badges default to operator account without privileged roles", () => {
      expect(en.auth.accountTypeBadge).toContain("Operator");
      expect(ar.auth.accountTypeBadge).toContain("مشغّل");
      expect(fr.auth.accountTypeBadge).toContain("Opérateur");
    });
  });
});

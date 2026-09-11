import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getInitialLanguage,
  getDirection,
  applyInterpolation,
  STORAGE_KEY,
  dictionaries,
  supportedLanguages,
  I18nProvider,
  useI18n,
} from "./index";
import { en } from "./locales/en";
import { ar } from "./locales/ar";
import { fr } from "./locales/fr";
import React from "react";
import { renderToString } from "react-dom/server";

describe("i18n System - Phase 5A Multilingual & RTL Foundation", () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalLocalStorage = globalThis.localStorage;

  beforeEach(() => {
    // Setup clean mock localStorage
    const store: Record<string, string> = {};
    const mockLocalStorage = {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        for (const k of Object.keys(store)) delete store[k];
      }),
    };

    // Setup mock document
    const mockDocument = {
      documentElement: {
        lang: "en",
        dir: "ltr",
        classList: {
          classes: new Set<string>(),
          add(cls: string) {
            this.classes.add(cls);
          },
          remove(cls: string) {
            this.classes.delete(cls);
          },
          contains(cls: string) {
            return this.classes.has(cls);
          },
        },
      },
      title: "",
    };

    const mockNav = { language: "en-US" };
    (globalThis as unknown as { window: unknown }).window = {
      localStorage: mockLocalStorage,
      navigator: mockNav,
    };
    (globalThis as unknown as { localStorage: unknown }).localStorage = mockLocalStorage;
    (globalThis as unknown as { document: unknown }).document = mockDocument;
  });

  afterEach(() => {
    (globalThis as unknown as { window: unknown }).window = originalWindow;
    (globalThis as unknown as { document: unknown }).document = originalDocument;
    (globalThis as unknown as { localStorage: unknown }).localStorage = originalLocalStorage;
    vi.restoreAllMocks();
  });

  describe("1. Key Availability & Dictionary Parity", () => {
    it("should export dictionaries for all supported languages (ar, en, fr)", () => {
      expect(dictionaries.en).toBeDefined();
      expect(dictionaries.ar).toBeDefined();
      expect(dictionaries.fr).toBeDefined();
      expect(supportedLanguages).toHaveLength(3);
    });

    it("should have matching top-level keys across en, ar, and fr", () => {
      const enKeys = Object.keys(en).sort();
      const arKeys = Object.keys(ar).sort();
      const frKeys = Object.keys(fr).sort();

      expect(arKeys).toEqual(enKeys);
      expect(frKeys).toEqual(enKeys);
    });

    it("should have comprehensive key availability in Arabic matching English", () => {
      function getDeepKeys(obj: Record<string, unknown>, prefix = ""): string[] {
        let keys: string[] = [];
        for (const key of Object.keys(obj)) {
          const fullPath = prefix ? `${prefix}.${key}` : key;
          const val = obj[key];
          if (typeof val === "object" && val !== null) {
            keys = keys.concat(getDeepKeys(val as Record<string, unknown>, fullPath));
          } else {
            keys.push(fullPath);
          }
        }
        return keys;
      }

      const enDeep = getDeepKeys(en as unknown as Record<string, unknown>).sort();
      const arDeep = getDeepKeys(ar as unknown as Record<string, unknown>).sort();
      const frDeep = getDeepKeys(fr as unknown as Record<string, unknown>).sort();

      expect(arDeep).toEqual(enDeep);
      expect(frDeep).toEqual(enDeep);
    });
  });

  describe("2. Direction and RTL Determination", () => {
    it("should return 'rtl' for Arabic", () => {
      expect(getDirection("ar")).toBe("rtl");
    });

    it("should return 'ltr' for English and French", () => {
      expect(getDirection("en")).toBe("ltr");
      expect(getDirection("fr")).toBe("ltr");
    });
  });

  describe("3. Language Persistence & Initial Language Detection", () => {
    it("should retrieve stored language from localStorage if valid", () => {
      localStorage.setItem(STORAGE_KEY, "ar");
      expect(getInitialLanguage()).toBe("ar");

      localStorage.setItem(STORAGE_KEY, "fr");
      expect(getInitialLanguage()).toBe("fr");

      localStorage.setItem(STORAGE_KEY, "en");
      expect(getInitialLanguage()).toBe("en");
    });

    it("should ignore invalid stored language and fallback to browser/default", () => {
      localStorage.setItem(STORAGE_KEY, "de_invalid");
      expect(getInitialLanguage()).toBe("en");
    });

    it("should detect Arabic browser language when localStorage is empty", () => {
      (window.navigator as unknown as { language: string }).language = "ar-DZ";
      expect(getInitialLanguage()).toBe("ar");
    });

    it("should detect French browser language when localStorage is empty", () => {
      (window.navigator as unknown as { language: string }).language = "fr-FR";
      expect(getInitialLanguage()).toBe("fr");
    });

    it("should fallback to English when browser language is unsupported", () => {
      (window.navigator as unknown as { language: string }).language = "ja-JP";
      expect(getInitialLanguage()).toBe("en");
    });
  });

  describe("4. Parameter Interpolation", () => {
    it("should replace single variable placeholder", () => {
      const template = "Managing {count} active fields";
      const result = applyInterpolation(template, { count: 5 });
      expect(result).toBe("Managing 5 active fields");
    });

    it("should replace multiple variable placeholders", () => {
      const template = "{greeting}, {name}!";
      const result = applyInterpolation(template, { greeting: "Hello", name: "Ahmed" });
      expect(result).toBe("Hello, Ahmed!");
    });

    it("should retain unprovided placeholders gracefully", () => {
      const template = "{present} and {missing}";
      const result = applyInterpolation(template, { present: "Done" });
      expect(result).toBe("Done and {missing}");
    });

    it("should return original string when no params are given", () => {
      const template = "Static string";
      expect(applyInterpolation(template)).toBe("Static string");
    });
  });

  describe("5. Fallback Logic & Translation Resolution", () => {
    it("should render correct translation in selected language", () => {
      function TestComponent() {
        const { t } = useI18n();
        return React.createElement("div", { id: "test-content" }, t("app.title"));
      }

      const html = renderToString(
        React.createElement(
          I18nProvider,
          null,
          React.createElement(TestComponent)
        )
      );

      expect(html).toContain("Q-Farming 2.0");
    });

    it("should fallback gracefully to key name if not found in any locale", () => {
      let resolved = "";
      function TestFallback() {
        const { t } = useI18n();
        resolved = t("non_existent_key_12345");
        return React.createElement("span", null, resolved);
      }

      renderToString(
        React.createElement(
          I18nProvider,
          null,
          React.createElement(TestFallback)
        )
      );

      expect(resolved).toBe("non_existent_key_12345");
    });
  });

  describe("6. Document Synchronization Attributes", () => {
    it("should provide correct context values for direction, language, and isRTL", () => {
      const captured: { current: ReturnType<typeof useI18n> | null } = { current: null };
      function ContextReader() {
        captured.current = useI18n();
        return null;
      }

      localStorage.setItem(STORAGE_KEY, "ar");
      renderToString(
        React.createElement(
          I18nProvider,
          null,
          React.createElement(ContextReader)
        )
      );

      expect(captured.current).not.toBeNull();
      expect(captured.current!.language).toBe("ar");
      expect(captured.current!.dir).toBe("rtl");
      expect(captured.current!.isRTL).toBe(true);
      expect(typeof captured.current!.setLanguage).toBe("function");
      expect(typeof captured.current!.t).toBe("function");
    });
  });
});

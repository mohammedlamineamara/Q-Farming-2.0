import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import type { Language, Direction, LanguageOption, Translations } from "./types";
import { en } from "./locales/en";
import { ar } from "./locales/ar";
import { fr } from "./locales/fr";

export type * from "./types";

export const STORAGE_KEY = "q_farming_language";

export const supportedLanguages: LanguageOption[] = [
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl", flag: "🇩🇿" },
  { code: "en", name: "English", nativeName: "English", dir: "ltr", flag: "🇬🇧" },
  { code: "fr", name: "French", nativeName: "Français", dir: "ltr", flag: "🇫🇷" },
];

export const dictionaries: Record<Language, Translations> = {
  en,
  ar,
  fr,
};

export function getInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return "en";
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "ar" || stored === "en" || stored === "fr") {
      return stored;
    }
  } catch {
    // localStorage may be inaccessible
  }

  try {
    const nav = window.navigator as (Navigator & { userLanguage?: string }) | undefined;
    const browserLang = (nav?.language || nav?.userLanguage || "").toLowerCase();
    if (browserLang.startsWith("ar")) return "ar";
    if (browserLang.startsWith("fr")) return "fr";
  } catch {
    // navigator might not be available
  }

  return "en";
}

export function getDirection(lang: Language): Direction {
  return lang === "ar" ? "rtl" : "ltr";
}

interface I18nContextType {
  language: Language;
  dir: Direction;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  translations: Translations;
  supportedLanguages: LanguageOption[];
}

export const I18nContext = createContext<I18nContextType | null>(null);

function getNestedValue(obj: Record<string, unknown> | unknown, path: string): unknown {
  if (!obj || typeof obj !== "object" || !path) return undefined;
  const parts = path.split(".");
  let curr: unknown = obj;
  for (const part of parts) {
    if (curr === undefined || curr === null || typeof curr !== "object") return undefined;
    curr = (curr as Record<string, unknown>)[part];
  }
  return curr;
}

export function applyInterpolation(template: string, params?: Record<string, string | number>): string {
  if (!params || typeof template !== "string") return template;
  return template.replace(/{(\w+)}/g, (_, key) => {
    return key in params ? String(params[key]) : `{${key}}`;
  });
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const dir = useMemo(() => getDirection(language), [language]);
  const isRTL = useMemo(() => dir === "rtl", [dir]);

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore storage errors
    }
  }, []);

  // Synchronize document attributes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      document.documentElement.dir = dir;
      
      if (isRTL) {
        document.documentElement.classList.add("rtl");
        document.documentElement.classList.remove("ltr");
      } else {
        document.documentElement.classList.add("ltr");
        document.documentElement.classList.remove("rtl");
      }

      // Update page title
      const currentDictionary = dictionaries[language] || en;
      document.title = `${currentDictionary.app.title} - ${currentDictionary.app.subtitle}`;
    }
  }, [language, dir, isRTL]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const currentDict = dictionaries[language] || en;
      let val = getNestedValue(currentDict, key);

      // Fallback to English if not found in current dictionary
      if (val === undefined || val === null) {
        val = getNestedValue(en, key);
      }

      if (val === undefined || val === null) {
        return key;
      }

      if (typeof val === "string") {
        return applyInterpolation(val, params);
      }

      return String(val);
    },
    [language]
  );

  const contextValue = useMemo(
    () => ({
      language,
      dir,
      isRTL,
      setLanguage,
      t,
      translations: dictionaries[language] || en,
      supportedLanguages,
    }),
    [language, dir, isRTL, setLanguage, t]
  );

  return React.createElement(I18nContext.Provider, { value: contextValue }, children);
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export const useTranslation = useI18n;

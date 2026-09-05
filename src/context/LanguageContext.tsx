"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { translate, DEFAULT_LANGUAGE, type Language } from "@/lib/i18n";

const COOKIE_NAME = "lang";
const STORAGE_KEY = "helphubbd-lang";

function isLanguage(value: string | undefined | null): value is Language {
  return value === "en" || value === "bn";
}

function readPersisted(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const cookie = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${COOKIE_NAME}=`));
    const cookieValue = cookie?.slice(COOKIE_NAME.length + 1);
    if (isLanguage(cookieValue)) return cookieValue;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLanguage(stored)) return stored;
  } catch {
    // ignore — fall back to default language
  }
  return DEFAULT_LANGUAGE;
}

const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Language {
  return readPersisted();
}

function getServerSnapshot(): Language {
  return DEFAULT_LANGUAGE;
}

function persist(next: Language): void {
  try {
    document.cookie = `${COOKIE_NAME}=${next}; path=/; max-age=31536000; samesite=lax`;
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignore — switching still applies for this session
  }
  emit();
}

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  toggle: () => void;
  t: (text: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Language) => {
    persist(next);
  }, []);

  const toggle = useCallback(() => {
    persist(lang === "en" ? "bn" : "en");
  }, [lang]);

  const t = useCallback((text: string) => translate(text, lang), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
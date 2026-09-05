import { messages as navMessages } from "./nav";
import { messages as categoriesMessages } from "./categories";
import { messages as homeMessages } from "./home";
import { messages as providersMessages } from "./providers";
import { messages as dashboardsMessages } from "./dashboards";
import { messages as authMessages } from "./auth";
import { messages as pagesMessages } from "./pages";

export type Language = "en" | "bn";

export const LANGS: ReadonlyArray<{ code: Language; label: string }> = [
  { code: "en", label: "English" },
  { code: "bn", label: "বাংলা" },
];

export const DEFAULT_LANGUAGE: Language = "en";

const messages: Record<string, string> = {
  ...navMessages,
  ...categoriesMessages,
  ...homeMessages,
  ...providersMessages,
  ...dashboardsMessages,
  ...authMessages,
  ...pagesMessages,
};

export function translate(text: string, lang: Language): string {
  if (lang === "en") return text;
  return messages[text] ?? text;
}
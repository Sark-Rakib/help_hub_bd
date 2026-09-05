import { cookies } from "next/headers";
import { translate, type Language } from "./i18n";

// Server-side language resolution for server components that render
// user-visible text. Requires per-request dynamic rendering.
export async function getServerLanguage(): Promise<Language> {
  const store = await cookies();
  const value = store.get("lang")?.value;
  return value === "bn" ? "bn" : "en";
}

export async function ts(text: string): Promise<string> {
  return translate(text, await getServerLanguage());
}
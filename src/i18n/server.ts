import { cookies } from "next/headers";
import { ar, en, Dict } from "./dictionaries";
import type { Locale } from "@/lib/format";

export async function getLocale(): Promise<Locale> {
  const v = (await cookies()).get("locale")?.value;
  return v === "en" ? "en" : "ar";
}

export const dictionaryFor = (locale: Locale): Dict => (locale === "en" ? en : ar);

export function makeT(dict: Dict) {
  return (key: string, vars?: Record<string, string | number>) => {
    let s = (dict as Record<string, string>)[key] ?? String(key);
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };
}

/** Server components: `const { t, locale } = await getT()` */
export async function getT() {
  const locale = await getLocale();
  return { t: makeT(dictionaryFor(locale)), locale, dir: locale === "ar" ? ("rtl" as const) : ("ltr" as const) };
}

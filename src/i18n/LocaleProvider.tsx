"use client";

import { createContext, useContext, useMemo } from "react";
import type { Dict } from "./dictionaries";
import type { Locale } from "@/lib/format";

interface Ctx {
  locale: Locale;
  dir: "rtl" | "ltr";
  t: (key: string, vars?: Record<string, string | number>) => string;
}
const LocaleContext = createContext<Ctx | null>(null);

export function LocaleProvider({ locale, dict, children }: { locale: Locale; dict: Dict; children: React.ReactNode }) {
  const value = useMemo<Ctx>(
    () => ({
      locale,
      dir: locale === "ar" ? "rtl" : "ltr",
      t: (key, vars) => {
        let s = (dict as Record<string, string>)[key] ?? String(key);
        if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
        return s;
      },
    }),
    [locale, dict],
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useT() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useT must be used inside <LocaleProvider>");
  return ctx;
}

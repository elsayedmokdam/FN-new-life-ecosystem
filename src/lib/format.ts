export type Locale = "ar" | "en";

const tag = (l: Locale) => (l === "ar" ? "ar-EG-u-nu-latn" : "en-GB");

export function formatDate(value?: string | number | Date | null, locale: Locale = "ar"): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(tag(locale), { day: "2-digit", month: "short", year: "numeric", timeZone: "Africa/Cairo" }).format(d);
}

export function formatDateTime(value?: string | number | Date | null, locale: Locale = "ar"): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(tag(locale), {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Cairo",
  }).format(d);
}

/** "2026-11-19" as written (no timezone conversion) */
export function formatDay(day?: string | null, locale: Locale = "ar"): string {
  if (!day) return "—";
  const [y, m, d] = day.split("-").map(Number);
  return new Intl.DateTimeFormat(tag(locale), { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}

export const todayISO = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Cairo" }).format(new Date());
export const nowTime = () =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Africa/Cairo" }).format(new Date());

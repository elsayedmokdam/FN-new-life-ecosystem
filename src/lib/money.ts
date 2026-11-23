// Decimal-safe money helpers (display + input parsing only: the API is the authority for every calculation).
// Amounts are INTEGERS in minor units (piasters, 1 EGP = 100). Rates are integer basis points (250 = 2.50%).

/** "1,234.5" -> 123450 (string based, never a float). `null` when invalid. */
export function parseMinor(input: string | number | null | undefined): number | null {
  const s = String(input ?? "").trim().replace(/[,\s]/g, "").replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
  const m = /^(-)?(\d+)(?:\.(\d{1,2}))?$/.exec(s);
  if (!m) return null;
  const minor = Number(m[2]) * 100 + Number((m[3] ?? "").padEnd(2, "0") || 0);
  if (!Number.isSafeInteger(minor)) return null;
  return m[1] ? -minor : minor;
}

/** 123450 -> "1,234.50" */
export function formatMinor(minor: number | null | undefined): string {
  const v = minor ?? 0;
  const abs = Math.abs(v);
  const whole = String(Math.trunc(abs / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${v < 0 ? "-" : ""}${whole}.${String(abs % 100).padStart(2, "0")}`;
}

/** 123450 -> "1234.50" (for editing inputs) */
export function minorToInput(minor: number | null | undefined): string {
  const v = minor ?? 0;
  const abs = Math.abs(v);
  return `${v < 0 ? "-" : ""}${Math.trunc(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}

/** "2.5" -> 250 (basis points). `null` when invalid / out of range. */
export function parseRateBps(input: string | number | null | undefined): number | null {
  const s = String(input ?? "").trim().replace(",", ".");
  const m = /^(\d{1,3})(?:\.(\d{1,2}))?$/.exec(s);
  if (!m) return null;
  const bps = Number(m[1]) * 100 + Number((m[2] ?? "").padEnd(2, "0") || 0);
  return bps <= 10000 ? bps : null;
}

/** 250 -> "2.50" */
export function formatRate(bps: number | null | undefined): string {
  const v = bps ?? 0;
  return `${Math.trunc(v / 100)}.${String(v % 100).padStart(2, "0")}`;
}

/** amount * rateBps / 10000 rounded half-up, exact (BigInt). Used ONLY for the live preview in the form. */
export function percentOf(amountMinor: number, rateBps: number): number {
  if (amountMinor < 0 || rateBps < 0) return 0;
  return Number((BigInt(amountMinor) * BigInt(rateBps) + BigInt(5000)) / BigInt(10000));
}

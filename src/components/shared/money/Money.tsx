"use client";

import { cn } from "@/lib/utils";
import { formatMinor } from "@/lib/money";
import { useAppSelector } from "@/redux/store/hooks";
import { useT } from "@/i18n/LocaleProvider";

interface MoneyProps {
  /** integer minor units (piasters) */
  value: number | null | undefined;
  /** colour: the semantic meaning of the amount */
  tone?: "withdrawal" | "deposit" | "debt" | "credit" | "commission" | "auto" | "none";
  /** prefix + for positive numbers */
  signed?: boolean;
  currency?: boolean;
  className?: string;
}

const TONES: Record<string, string> = {
  withdrawal: "text-withdrawal",
  deposit: "text-deposit",
  debt: "text-debt",
  credit: "text-credit",
  commission: "text-commission",
  none: "",
};

/** Every financial number of the app goes through this component, so Privacy Mode hides all of them at once. */
export default function Money({ value, tone = "none", signed = false, currency = true, className }: MoneyProps) {
  const privacy = useAppSelector((s) => s.ui.privacy);
  const { t } = useT();
  const v = value ?? 0;
  const resolved = tone === "auto" ? (v < 0 ? "withdrawal" : v > 0 ? "deposit" : "none") : tone;

  if (privacy) {
    return (
      <span className={cn("num select-none tracking-widest text-muted-foreground", className)} aria-label={t("privacy.hidden")}>
        ••••••
      </span>
    );
  }
  return (
    <span className={cn("num whitespace-nowrap font-semibold", TONES[resolved], className)}>
      {signed && v > 0 ? "+" : ""}
      {formatMinor(v)}
      {currency && <span className="ms-1 text-[0.8em] font-normal text-muted-foreground">{t("currency")}</span>}
    </span>
  );
}

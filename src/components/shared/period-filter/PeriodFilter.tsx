"use client";

import { useState } from "react";
import SegmentedTabs from "../segmented-tabs/SegmentedTabs";
import AppButton from "../app-button/AppButton";
import { useT } from "@/i18n/LocaleProvider";
import { Period } from "@/services/types/enums";

export interface PeriodValue {
  period: Period;
  from?: string;
  to?: string;
}

const PRESETS: Period[] = ["today", "yesterday", "this_week", "this_month", "last_month", "custom"];

/** Today · Yesterday · This week · This month · Last month · Custom range */
export default function PeriodFilter({ value, onChange }: { value: PeriodValue; onChange: (v: PeriodValue) => void }) {
  const { t } = useT();
  const [from, setFrom] = useState(value.from ?? "");
  const [to, setTo] = useState(value.to ?? "");
  const invalid = !from || !to || from > to;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="max-w-full overflow-x-auto">
        <SegmentedTabs<Period>
          value={value.period}
          onChange={(p) => (p === "custom" ? onChange({ period: p, from: from || undefined, to: to || undefined }) : onChange({ period: p }))}
          options={PRESETS.map((p) => ({ value: p, label: t(`period.${p}`) }))}
        />
      </div>
      {value.period === "custom" && (
        <div className="flex flex-wrap items-center gap-2">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-10 rounded-xl border border-input bg-card px-3 text-sm" aria-label={t("period.from")} />
          <span className="text-muted-foreground">→</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-10 rounded-xl border border-input bg-card px-3 text-sm" aria-label={t("period.to")} />
          <AppButton type="button" disabled={invalid} onClick={() => onChange({ period: "custom", from, to })} className="bg-main-color text-white hover:bg-main-color/90">{t("common.apply")}</AppButton>
        </div>
      )}
    </div>
  );
}

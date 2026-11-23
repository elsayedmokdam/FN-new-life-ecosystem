"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { PaginationMeta } from "@/services/types/api_interface";
import { useT } from "@/i18n/LocaleProvider";

interface Props {
  meta?: PaginationMeta;
  onPage: (page: number) => void;
  onLimit?: (limit: number) => void;
  disabled?: boolean;
}

export default function TablePagination({ meta, onPage, onLimit, disabled }: Props) {
  const { t, dir } = useT();
  if (!meta) return null;
  const Prev = dir === "rtl" ? FiChevronRight : FiChevronLeft;
  const Next = dir === "rtl" ? FiChevronLeft : FiChevronRight;
  const btn = "flex size-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
      <span>
        {t("table.page", { page: meta.page, total: meta.totalPages })} · {t("table.total", { n: meta.total })}
      </span>
      <div className="flex items-center gap-2">
        {onLimit && (
          <select value={meta.limit} onChange={(e) => onLimit(Number(e.target.value))} className="h-9 rounded-lg border border-border bg-card px-2 text-foreground" aria-label={t("table.perPage")}>
            {[10, 20, 50, 100].map((n) => (<option key={n} value={n}>{n}</option>))}
          </select>
        )}
        <button type="button" className={btn} disabled={disabled || meta.page <= 1} onClick={() => onPage(meta.page - 1)} aria-label={t("table.prev")}><Prev /></button>
        <button type="button" className={btn} disabled={disabled || meta.page >= meta.totalPages} onClick={() => onPage(meta.page + 1)} aria-label={t("table.next")}><Next /></button>
      </div>
    </div>
  );
}

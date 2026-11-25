"use client";

import { useT } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  // cards / machines / clients
  active:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  inactive:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  archived:
    "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
  disabled: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  // transactions
  completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  cancellation_pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  reversed:
    "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  approved:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  withdrawal: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  deposit:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  admin: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  employee:
    "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
};

export default function StatusBadge({
  status,
  label,
  className,
}: {
  status: string;
  label?: string;
  className?: string;
}) {
  const { t } = useT();
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold",
        STYLES[status] ?? STYLES.archived,
        className,
      )}
    >
      {label ?? t(`status.${status}`)}
    </span>
  );
}

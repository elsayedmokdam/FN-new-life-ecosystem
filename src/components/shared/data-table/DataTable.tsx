"use client";

import { useEffect, useMemo, useState } from "react";
import { FiChevronDown, FiChevronUp, FiColumns } from "react-icons/fi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Skeleton from "../skeleton/Skeleton";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/LocaleProvider";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  /** API sort field (enables click-to-sort) */
  sortKey?: string;
  align?: "start" | "end" | "center";
  className?: string;
  /** can be hidden from the "Columns" menu */
  hideable?: boolean;
  defaultHidden?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  /** "field:asc" | "field:desc" */
  sort?: string;
  onSort?: (sort: string) => void;
  onRowClick?: (row: T) => void;
  /** remembers the visible columns */
  storageKey?: string;
  empty?: React.ReactNode;
  toolbar?: React.ReactNode;
}

const ALIGN = { start: "text-start", end: "text-end", center: "text-center" } as const;

/** Generic data table: sortable headers, column visibility, skeleton loading, empty state, responsive scroll. */
export default function DataTable<T>({ columns, rows, rowKey, loading, sort, onSort, onRowClick, storageKey, empty, toolbar }: DataTableProps<T>) {
  const { t } = useT();
  const hideableCols = columns.filter((c) => c.hideable);
  const [hidden, setHidden] = useState<string[]>(() => columns.filter((c) => c.defaultHidden).map((c) => c.key));

  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = localStorage.getItem(`cols:${storageKey}`);
      // read after mount on purpose (localStorage does not exist on the server -> avoids a hydration mismatch)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setHidden(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  const toggle = (key: string) => {
    setHidden((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      if (storageKey) localStorage.setItem(`cols:${storageKey}`, JSON.stringify(next));
      return next;
    });
  };

  const visible = useMemo(() => columns.filter((c) => !hidden.includes(c.key)), [columns, hidden]);
  const [field, dir] = (sort ?? "").split(":");

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      {(toolbar || hideableCols.length > 0) && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-3">
          <div className="flex flex-1 flex-wrap items-center gap-2">{toolbar}</div>
          {hideableCols.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                  <FiColumns /> {t("table.columns")}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl p-1">
                {hideableCols.map((c) => (
                  <DropdownMenuItem key={c.key} onSelect={(e) => { e.preventDefault(); toggle(c.key); }} className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" readOnly checked={!hidden.includes(c.key)} className="accent-main-color" />
                    {c.header}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {visible.map((c) => {
                const active = c.sortKey && field === c.sortKey;
                return (
                  <TableHead key={c.key} className={cn("whitespace-nowrap", ALIGN[c.align ?? "start"], c.className)}>
                    {c.sortKey && onSort ? (
                      <button
                        type="button"
                        onClick={() => onSort(`${c.sortKey}:${active && dir === "asc" ? "desc" : "asc"}`)}
                        className="inline-flex cursor-pointer items-center gap-1 font-semibold hover:text-main-color"
                      >
                        {c.header}
                        {active ? dir === "asc" ? <FiChevronUp /> : <FiChevronDown /> : <FiChevronDown className="opacity-30" />}
                      </button>
                    ) : (
                      c.header
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  {visible.map((c) => (
                    <TableCell key={c.key}><Skeleton className="h-5 w-full min-w-12" /></TableCell>
                  ))}
                </TableRow>
              ))}
            {!loading &&
              rows.map((row) => (
                <TableRow key={rowKey(row)} onClick={onRowClick ? () => onRowClick(row) : undefined} className={cn(onRowClick && "cursor-pointer hover:bg-muted/50")}>
                  {visible.map((c) => (
                    <TableCell key={c.key} className={cn(ALIGN[c.align ?? "start"], c.className)}>{c.cell(row)}</TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {!loading && rows.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">{empty ?? t("table.empty")}</div>}
    </div>
  );
}

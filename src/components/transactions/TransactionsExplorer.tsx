"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import DataTable from "../shared/data-table/DataTable";
import TablePagination from "../shared/table-pagination/TablePagination";
import SearchInput from "../shared/search-input/SearchInput";
import FilterSelect from "../shared/filter-select/FilterSelect";
import { useTransactionColumns } from "./useTransactionColumns";
import { getTransactionsAction } from "@/services/actions/transactions.action";
import { Transaction } from "@/services/types/transaction_interface";
import { PaginationMeta } from "@/services/types/api_interface";
import { notify } from "@/services/utils/helpers/alerts";
import { useT } from "@/i18n/LocaleProvider";

interface Props {
  initial: { data: Transaction[]; meta: PaginationMeta };
  /** locks the list to one card / client / machine */
  cardId?: string;
  clientId?: string;
  machineId?: string;
  showCard?: boolean;
  showClient?: boolean;
  storageKey?: string;
}

/** Transactions table with search, filters, sorting and pagination (used by /transactions and the card details). */
export default function TransactionsExplorer({ initial, cardId, clientId, machineId, showCard = true, showClient = true, storageKey = "transactions" }: Props) {
  const { t } = useT();
  const router = useRouter();
  const [rows, setRows] = useState(initial.data);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(initial.meta);
  const [q, setQ] = useState({ search: "", type: "", status: "", period: "", from: "", to: "", sort: "transactionDate:desc", page: 1, limit: 10 });
  const [pending, startTransition] = useTransition();
  const first = useRef(true);
  const columns = useTransactionColumns({ showCard, showClient });

  const load = useCallback(
    (next: typeof q) => {
      startTransition(async () => {
        const res = await getTransactionsAction({
          page: String(next.page),
          limit: String(next.limit),
          sort: next.sort,
          search: next.search || undefined,
          type: next.type || undefined,
          status: next.status || undefined,
          period: next.period || undefined,
          from: next.period === "custom" ? next.from || undefined : undefined,
          to: next.period === "custom" ? next.to || undefined : undefined,
          cardId,
          clientId,
          machineId,
        });
        if (!res.ok) return notify.apiError(res.error);
        setRows(res.data.data.data);
        setMeta(res.data.data.meta);
      });
    },
    [cardId, clientId, machineId],
  );

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (q.period === "custom" && (!q.from || !q.to)) return;
    load(q);
  }, [q, load]);

  const set = (patch: Partial<typeof q>) => setQ((p) => ({ ...p, page: 1, ...patch }));
  const onSearch = useCallback((s: string) => setQ((p) => (p.search === s ? p : { ...p, search: s, page: 1 })), []);

  return (
    <>
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r._id}
        loading={pending && rows.length === 0}
        sort={q.sort}
        onSort={(sort) => set({ sort })}
        onRowClick={(r) => router.push(`/transactions/${r._id}`)}
        storageKey={storageKey}
        toolbar={
          <>
            <SearchInput onSearch={onSearch} placeholder={t("tx.searchPlaceholder")} className="w-full sm:w-64" />
            <FilterSelect value={q.type} onChange={(type) => set({ type })} all={t("tx.allTypes")} options={[{ value: "withdrawal", label: t("status.withdrawal") }, { value: "deposit", label: t("status.deposit") }]} />
            <FilterSelect value={q.status} onChange={(status) => set({ status })} all={t("tx.allStatuses")} options={(["completed", "cancellation_pending", "reversed"] as const).map((s) => ({ value: s, label: t(`status.${s}`) }))} />
            <FilterSelect value={q.period} onChange={(period) => set({ period })} all={t("period.all")} options={(["today", "yesterday", "this_week", "this_month", "last_month", "custom"] as const).map((p) => ({ value: p, label: t(`period.${p}`) }))} />
            {q.period === "custom" && (
              <>
                <input type="date" value={q.from} onChange={(e) => set({ from: e.target.value })} className="h-10 rounded-xl bg-muted px-3 text-sm" aria-label={t("period.from")} />
                <input type="date" value={q.to} onChange={(e) => set({ to: e.target.value })} className="h-10 rounded-xl bg-muted px-3 text-sm" aria-label={t("period.to")} />
              </>
            )}
          </>
        }
      />
      <TablePagination meta={meta} disabled={pending} onPage={(page) => setQ((p) => ({ ...p, page }))} onLimit={(limit) => set({ limit })} />
    </>
  );
}

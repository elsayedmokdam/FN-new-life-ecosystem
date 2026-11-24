"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import DataTable, { Column } from "../shared/data-table/DataTable";
import TablePagination from "../shared/table-pagination/TablePagination";
import SearchInput from "../shared/search-input/SearchInput";
import Money from "../shared/money/Money";
import StatusBadge from "../shared/status-badge/StatusBadge";
import { getClientsAction } from "@/services/actions/clients.action";
import { Client } from "@/services/types/client_interface";
import { PaginationMeta } from "@/services/types/api_interface";
import { notify } from "@/services/utils/helpers/alerts";
import { useT } from "@/i18n/LocaleProvider";

export default function ClientsView({
  initial,
}: {
  initial: { data: Client[]; meta: PaginationMeta };
}) {
  const { t } = useT();
  const router = useRouter();
  const [rows, setRows] = useState(initial.data);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(initial.meta);
  const [q, setQ] = useState({
    search: "",
    sort: "createdAt:desc",
    page: 1,
    limit: 10,
  });
  const [pending, startTransition] = useTransition();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    startTransition(async () => {
      const res = await getClientsAction({
        page: String(q.page),
        limit: String(q.limit),
        sort: q.sort,
        search: q.search || undefined,
      });
      if (!res.ok) return notify.apiError(res.error);
      setRows(res.data.data.data);
      setMeta(res.data.data.meta);
    });
  }, [q]);

  const onSearch = useCallback(
    (s: string) =>
      setQ((p) => (p.search === s ? p : { ...p, search: s, page: 1 })),
    [],
  );

  const columns: Column<Client>[] = [
    {
      key: "name",
      header: t("client.fullName"),
      sortKey: "fullName",
      cell: (c) => <span className="font-semibold">{c.fullName}</span>,
    },
    {
      key: "phone",
      header: t("client.phone"),
      cell: (c) => <span className="num">{c.phone}</span>,
    },
    {
      key: "cards",
      header: t("client.cardsCount"),
      sortKey: "cardsCount",
      align: "end",
      cell: (c) => <span className="num">{c.cardsCount}</span>,
    },
    {
      key: "manualBalance",
      header: t("client.manualBalance"),
      align: "end",
      cell: (c) => <Money value={c.manualBalance ?? 0} signed />,
      hideable: true,
      defaultHidden: true,
    },
    {
      key: "profit",
      header: t("client.actualProfit"),
      align: "end",
      cell: (c) => (
        <Money value={c.actualProfit ?? c.profit ?? 0} tone="commission" />
      ),
      hideable: true,
    },
    {
      key: "balance",
      header: t("client.totalBalance"),
      sortKey: "totalBalance",
      align: "end",
      cell: (c) => <Money value={c.totalBalance} />,
    },
    {
      key: "debt",
      header: t("client.totalDebt"),
      sortKey: "netDebt",
      align: "end",
      cell: (c) => (
        <Money
          value={c.totalDebt}
          tone={(c.totalDebt ?? 0) > 0 ? "debt" : "none"}
        />
      ),
    },
    {
      key: "credit",
      header: t("client.totalCredit"),
      align: "end",
      cell: (c) => (
        <Money
          value={c.totalCredit}
          tone={(c.totalCredit ?? 0) > 0 ? "credit" : "none"}
        />
      ),
    },
    {
      key: "email",
      header: t("client.email"),
      cell: (c) => c.email ?? "—",
      hideable: true,
      defaultHidden: true,
    },
    {
      key: "status",
      header: t("card.status"),
      cell: (c) => <StatusBadge status={c.status} />,
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(c) => c._id}
        loading={pending && rows.length === 0}
        sort={q.sort}
        onSort={(sort) => setQ((p) => ({ ...p, sort, page: 1 }))}
        onRowClick={(c) => router.push(`/clients/${c._id}`)}
        storageKey="clients"
        toolbar={
          <SearchInput
            onSearch={onSearch}
            placeholder={t("client.searchPlaceholder")}
            className="w-full sm:w-72"
          />
        }
      />
      <TablePagination
        meta={meta}
        disabled={pending}
        onPage={(page) => setQ((p) => ({ ...p, page }))}
        onLimit={(limit) => setQ((p) => ({ ...p, limit, page: 1 }))}
      />
    </div>
  );
}

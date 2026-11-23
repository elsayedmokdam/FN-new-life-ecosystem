"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import DataTable, { Column } from "../shared/data-table/DataTable";
import TablePagination from "../shared/table-pagination/TablePagination";
import SearchInput from "../shared/search-input/SearchInput";
import FilterSelect from "../shared/filter-select/FilterSelect";
import Money from "../shared/money/Money";
import StatusBadge from "../shared/status-badge/StatusBadge";
import { getCardsAction } from "@/services/actions/cards.action";
import { getClientsAction } from "@/services/actions/clients.action";
import { Card } from "@/services/types/card_interface";
import { Client } from "@/services/types/client_interface";
import { PaginationMeta } from "@/services/types/api_interface";
import { notify } from "@/services/utils/helpers/alerts";
import { formatDay } from "@/lib/format";
import { formatRate } from "@/lib/money";
import { useT } from "@/i18n/LocaleProvider";

interface Props {
  initial: { data: Card[]; meta: PaginationMeta };
  initialClientId?: string;
}

export default function CardsView({ initial, initialClientId }: Props) {
  const { t, locale } = useT();
  const router = useRouter();
  const [rows, setRows] = useState(initial.data);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(initial.meta);
  const [clients, setClients] = useState<Client[]>([]);
  const [q, setQ] = useState({
    search: "",
    status: "",
    clientId: initialClientId ?? "",
    sort: "createdAt:desc",
    page: 1,
    limit: 10,
  });
  const [pending, startTransition] = useTransition();
  const first = useRef(true);

  useEffect(() => {
    getClientsAction({ limit: "100", sort: "fullName:asc" }).then(
      (r) => r.ok && setClients(r.data.data.data),
    );
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      if (!initialClientId) return;
    }
    startTransition(async () => {
      const res = await getCardsAction({
        page: String(q.page),
        limit: String(q.limit),
        sort: q.sort,
        search: q.search || undefined,
        status: q.status || undefined,
        clientId: q.clientId || undefined,
      });
      if (!res.ok) return notify.apiError(res.error);
      setRows(res.data.data.data);
      setMeta(res.data.data.meta);
    });
  }, [q, initialClientId]);

  const set = (patch: Partial<typeof q>) =>
    setQ((p) => ({ ...p, page: 1, ...patch }));
  const onSearch = useCallback(
    (s: string) =>
      setQ((p) => (p.search === s ? p : { ...p, search: s, page: 1 })),
    [],
  );

  const columns: Column<Card>[] = [
    {
      key: "name",
      header: t("card.name"),
      sortKey: "cardName",
      cell: (c) => (
        <span className="font-semibold text-foreground">{c.cardName}</span>
      ),
    },
    {
      key: "client",
      header: t("card.client"),
      cell: (c) => (
        <div>
          <p className="font-medium">{c.client?.fullName}</p>
          <p className="num text-xs text-muted-foreground">{c.client?.phone}</p>
        </div>
      ),
    },
    {
      key: "number",
      header: t("card.number"),
      cell: (c) => (
        <span className="num text-muted-foreground">{c.maskedNumber}</span>
      ),
      hideable: true,
    },
    {
      key: "bank",
      header: t("card.bank"),
      cell: (c) => c.bankProvider ?? "—",
      hideable: true,
    },
    {
      key: "type",
      header: t("card.type"),
      cell: (c) => c.cardType ?? "—",
      hideable: true,
      defaultHidden: true,
    },
    {
      key: "opening",
      header: t("card.openingBalance"),
      sortKey: "openingBalance",
      align: "end",
      cell: (c) => <Money value={c.openingBalance} />,
      hideable: true,
      defaultHidden: true,
    },
    {
      key: "balance",
      header: t("card.balance"),
      sortKey: "balance",
      align: "end",
      cell: (c) => <Money value={c.balance} />,
    },
    {
      key: "debt",
      header: t("card.debt"),
      sortKey: "debt",
      align: "end",
      cell: (c) =>
        c.currentCredit > 0 ? (
          <Money value={c.currentCredit} tone="credit" />
        ) : (
          <Money
            value={c.currentDebt}
            tone={c.currentDebt > 0 ? "debt" : "none"}
          />
        ),
    },
    {
      key: "rate",
      header: t("card.rate"),
      align: "end",
      cell: (c) => (
        <span className="num">{formatRate(c.commissionRateBps)}%</span>
      ),
      hideable: true,
      defaultHidden: true,
    },
    {
      key: "withdrawals",
      header: t("card.totalWithdrawals"),
      sortKey: "totalWithdrawals",
      align: "end",
      cell: (c) => <Money value={c.totalWithdrawals} tone="withdrawal" />,
      hideable: true,
      defaultHidden: true,
    },
    {
      key: "deposits",
      header: t("card.totalDeposits"),
      sortKey: "totalDeposits",
      align: "end",
      cell: (c) => <Money value={c.totalDeposits} tone="deposit" />,
      hideable: true,
      defaultHidden: true,
    },
    {
      key: "intermediary",
      header: t("card.intermediaryName"),
      cell: (c) => c.intermediaryName ?? "—",
      hideable: true,
      defaultHidden: true,
    },
    {
      key: "status",
      header: t("card.status"),
      sortKey: "status",
      cell: (c) => <StatusBadge status={c.status} />,
    },
    {
      key: "created",
      header: t("common.createdAt"),
      sortKey: "createdAt",
      cell: (c) => formatDay(c.createdAt.slice(0, 10), locale),
      hideable: true,
      defaultHidden: true,
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
        onSort={(sort) => set({ sort })}
        onRowClick={(c) => router.push(`/cards/${c._id}`)}
        storageKey="cards"
        toolbar={
          <>
            <SearchInput
              onSearch={onSearch}
              placeholder={t("card.searchPlaceholder")}
              className="w-full sm:w-72"
            />
            <FilterSelect
              value={q.status}
              onChange={(status) => set({ status })}
              all={t("card.allStatuses")}
              options={(["active", "inactive", "archived"] as const).map(
                (s) => ({ value: s, label: t(`status.${s}`) }),
              )}
            />
            <FilterSelect
              value={q.clientId}
              onChange={(clientId) => set({ clientId })}
              all={t("card.allClients")}
              options={clients.map((c) => ({
                value: c._id,
                label: c.fullName,
              }))}
              className="max-w-48"
            />
          </>
        }
        empty={
          <div className="space-y-3">
            <p>{t("card.empty")}</p>
            <Link
              href="/cards/new"
              className="inline-flex items-center gap-2 rounded-xl bg-main-color px-4 py-2 text-sm font-semibold text-white"
            >
              <FiPlus /> {t("card.add")}
            </Link>
          </div>
        }
      />
      <TablePagination
        meta={meta}
        disabled={pending}
        onPage={(page) => setQ((p) => ({ ...p, page }))}
        onLimit={(limit) => set({ limit })}
      />
    </div>
  );
}

"use client";

import Link from "next/link";
import { Column } from "../shared/data-table/DataTable";
import Money from "../shared/money/Money";
import StatusBadge from "../shared/status-badge/StatusBadge";
import { Transaction } from "@/services/types/transaction_interface";
import { useT } from "@/i18n/LocaleProvider";
import { formatDay } from "@/lib/format";

interface Options {
  showCard?: boolean;
  showClient?: boolean;
  detailed?: boolean;
}

/** Column set shared by the transactions list, the card details page and the dashboard. */
export function useTransactionColumns({ showCard = true, showClient = true, detailed = true }: Options = {}): Column<Transaction>[] {
  const { t, locale } = useT();
  const cols: Column<Transaction>[] = [
    {
      key: "number",
      header: t("tx.number"),
      sortKey: "transactionNumber",
      cell: (r) => (
        <Link href={`/transactions/${r._id}`} className="font-semibold text-main-color hover:underline num" onClick={(e) => e.stopPropagation()}>
          {r.transactionNumber}
        </Link>
      ),
    },
    { key: "type", header: t("tx.type"), sortKey: "type", cell: (r) => <StatusBadge status={r.type} /> },
  ];
  if (showCard) cols.push({ key: "card", header: t("tx.card"), cell: (r) => r.card?.cardName ?? "—", hideable: true });
  if (showClient) cols.push({ key: "client", header: t("tx.client"), cell: (r) => r.client?.fullName ?? "—", hideable: true });
  cols.push(
    { key: "amount", header: t("tx.amount"), sortKey: "originalAmount", align: "end", cell: (r) => <Money value={r.originalAmount} tone={r.type === "withdrawal" ? "withdrawal" : "deposit"} /> },
    {
      key: "date",
      header: t("tx.date"),
      sortKey: "transactionDate",
      cell: (r) => (
        <span className="whitespace-nowrap">
          {formatDay(r.transactionDay, locale)} <span className="num text-muted-foreground">{r.transactionTime}</span>
        </span>
      ),
    },
  );
  if (detailed) {
    cols.push(
      { key: "machine", header: t("tx.machine"), cell: (r) => r.machine?.name ?? "—", hideable: true, defaultHidden: true },
      { key: "customerCommission", header: t("tx.customerCommission"), align: "end", cell: (r) => <Money value={r.customerCommission} tone="commission" currency={false} />, hideable: true, defaultHidden: true },
      { key: "net", header: t("tx.netAmount"), align: "end", cell: (r) => <Money value={r.netAmount} currency={false} />, hideable: true, defaultHidden: true },
    );
  }
  cols.push(
    { key: "createdBy", header: t("tx.createdBy"), cell: (r) => r.createdByUser?.name ?? "—", hideable: true },
    { key: "status", header: t("tx.status"), cell: (r) => <StatusBadge status={r.status} /> },
  );
  return cols;
}

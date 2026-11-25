"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiDownload,
  FiEdit2,
  FiMinusCircle,
  FiPlusCircle,
  FiFileText,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import StatCard from "../shared/stat-card/StatCard";
import Money from "../shared/money/Money";
import StatusBadge from "../shared/status-badge/StatusBadge";
import TransactionsExplorer from "../transactions/TransactionsExplorer";
import { setCardStatusAction } from "@/services/actions/cards.action";
import { Card, CardFinancialSummary } from "@/services/types/card_interface";
import { Transaction } from "@/services/types/transaction_interface";
import { PaginationMeta } from "@/services/types/api_interface";
import { CardStatus } from "@/services/types/enums";
import { confirmDialog, notify } from "@/services/utils/helpers/alerts";
import { formatDay } from "@/lib/format";
import { formatRate } from "@/lib/money";
import { useT } from "@/i18n/LocaleProvider";

interface Props {
  card: Card;
  summary: CardFinancialSummary;
  initialTx: { data: Transaction[]; meta: PaginationMeta };
}

function Info({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-foreground">
        {children || "—"}
      </dd>
    </div>
  );
}

export default function CardDetailsView({ card, summary, initialTx }: Props) {
  const { t, locale } = useT();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const active = card.status === "active";

  const changeStatus = async (status: CardStatus) => {
    if (status === card.status) return;
    const ok = await confirmDialog({
      title: t("card.changeStatus"),
      text: t("card.changeStatusText", { status: t(`status.${status}`) }),
      confirmText: t("common.confirm"),
      cancelText: t("common.cancel"),
      danger: status !== "active",
    });
    if (!ok) return;
    setBusy(true);
    const res = await setCardStatusAction(card._id, status);
    setBusy(false);
    if (!res.ok) return notify.apiError(res.error);
    notify.success(t("card.updated"));
    router.refresh();
  };

  const exp = (format: "pdf" | "excel") =>
    `/api/reports/export?format=${format}&report=card&id=${card._id}&period=this_month&lang=${locale}`;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* actions */}
      <div className="flex flex-wrap items-center gap-2">
        {active ? (
          <>
            <Link
              href={`/cards/${card._id}/transactions/new?type=withdrawal`}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              <FiMinusCircle /> {t("tx.newWithdrawal")}
            </Link>
            <Link
              href={`/cards/${card._id}/transactions/new?type=deposit`}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <FiPlusCircle /> {t("tx.newDeposit")}
            </Link>
          </>
        ) : (
          <p className="rounded-xl bg-amber-100 px-4 py-2.5 text-sm text-amber-900 dark:bg-amber-500/15 dark:text-amber-200">
            {t("card.notActiveHint")}
          </p>
        )}
        <Link
          href={`/cards/${card._id}/edit`}
          className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted"
        >
          <FiEdit2 /> {t("common.edit")}
        </Link>
        <select
          value={card.status}
          disabled={busy}
          onChange={(e) => changeStatus(e.target.value as CardStatus)}
          aria-label={t("card.status")}
          className="h-10 cursor-pointer rounded-xl border border-border bg-card px-3 text-sm"
        >
          {(["active", "inactive", "archived"] as const).map((s) => (
            <option key={s} value={s}>
              {t(`status.${s}`)}
            </option>
          ))}
        </select>
        <div className="ms-auto flex gap-2">
          <a
            href={exp("pdf")}
            className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm hover:bg-muted"
          >
            <FiDownload /> PDF
          </a>
          <a
            href={exp("excel")}
            className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm hover:bg-muted"
          >
            <FiFileText /> Excel
          </a>
        </div>
      </div>

      {/* info */}
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-muted-foreground">
            {t("card.info")}
          </h2>
          <dl className="grid grid-cols-2 gap-4">
            <Info label={t("card.name")}>{card.cardName}</Info>
            <Info label={t("card.number")}>
              <span className="num">{card.maskedNumber}</span>
            </Info>
            <Info label={t("card.bank")}>{card.bankProvider}</Info>
            <Info label={t("card.type")}>{card.cardType}</Info>
            <Info label={t("card.status")}>
              <StatusBadge status={card.status} />
            </Info>
            <Info label={t("common.createdAt")}>
              {formatDay(card.createdAt.slice(0, 10), locale)}
            </Info>
            <Info label={t("card.rate")}>
              <span className="num">{formatRate(card.commissionRateBps)}%</span>
            </Info>
          </dl>
          {card.notes && (
            <p className="mt-4 rounded-xl bg-muted p-3 text-sm text-muted-foreground">
              {card.notes}
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-muted-foreground">
            {t("card.clientInfo")}
          </h2>
          <dl className="grid grid-cols-2 gap-4">
            <Info label={t("client.fullName")}>
              <Link
                href={`/clients/${card.clientId}`}
                className="text-main-color hover:underline"
              >
                {card.client?.fullName}
              </Link>
            </Info>
            <Info label={t("client.phone")}>
              <span className="num">{card.client?.phone}</span>
            </Info>
            <Info label={t("client.email")}>{card.client?.email}</Info>
            <Info label={t("client.address")}>{card.client?.address}</Info>
          </dl>
          <Link
            href={`/cards?clientId=${card.clientId}`}
            className="mt-4 inline-block text-sm font-semibold text-main-color hover:underline"
          >
            {t("client.viewCards")}
          </Link>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-muted-foreground">
            {t("card.intermediary")}
          </h2>
          <dl className="grid grid-cols-2 gap-4">
            <Info label={t("card.intermediaryName")}>
              {card.intermediaryName}
            </Info>
            <Info label={t("card.intermediaryPhone")}>
              <span className="num">{card.intermediaryPhone}</span>
            </Info>
          </dl>
          {card.intermediaryNotes && (
            <p className="mt-4 rounded-xl bg-muted p-3 text-sm text-muted-foreground">
              {card.intermediaryNotes}
            </p>
          )}
        </section>
      </div>

      {/* finance */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-muted-foreground">
            {t("card.financial")}
          </h2>
          <span
            className={`flex items-center gap-1 text-xs ${summary.ledgerConsistent ? "text-emerald-600" : "text-red-600"}`}
          >
            {summary.ledgerConsistent ? <FiCheckCircle /> : <FiAlertTriangle />}{" "}
            {summary.ledgerConsistent
              ? t("card.ledgerOk")
              : t("card.ledgerBad")}
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title={t("card.openingBalance")}>
            <Money value={summary.openingBalance} />
          </StatCard>
          <StatCard title={t("card.balance")}>
            <Money value={summary.currentBalance} />
          </StatCard>
          <StatCard title={t("card.totalWithdrawals")}>
            <Money value={summary.totalWithdrawals} tone="withdrawal" />
          </StatCard>
          <StatCard title={t("card.totalDeposits")}>
            <Money value={summary.totalDeposits} tone="deposit" />
          </StatCard>
          <StatCard title={t("card.currentDebt")}>
            <Money
              value={summary.currentDebt}
              tone={summary.currentDebt > 0 ? "debt" : "none"}
            />
          </StatCard>
          <StatCard title={t("card.currentCredit")}>
            <Money
              value={summary.currentCredit}
              tone={summary.currentCredit > 0 ? "credit" : "none"}
            />
          </StatCard>
          <StatCard title={t("dash.bankCommissions")}>
            <Money value={summary.totalBankCommission} />
          </StatCard>
          <StatCard title={t("dash.intermediaryCommissions")}>
            <Money value={summary.totalIntermediaryCommission} />
          </StatCard>
          <StatCard title={t("dash.customerCommissions")}>
            <Money value={summary.totalCustomerCommission} tone="commission" />
          </StatCard>
        </div>
      </div>

      {/* history */}
      <div>
        <h2 className="mb-3 text-sm font-bold text-muted-foreground">
          {t("card.history")}
        </h2>
        <TransactionsExplorer
          initial={initialTx}
          cardId={card._id}
          showCard={false}
          showClient={false}
          storageKey="card-tx"
        />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiCheck, FiEdit2, FiSlash, FiX } from "react-icons/fi";
import Money from "../shared/money/Money";
import StatusBadge from "../shared/status-badge/StatusBadge";
import ReasonDialog from "../shared/modal/ReasonDialog";
import AppButton from "../shared/app-button/AppButton";
import { approveCancellationAction, rejectCancellationAction, requestCancellationAction } from "@/services/actions/transactions.action";
import { TransactionDetails } from "@/services/types/transaction_interface";
import { notify } from "@/services/utils/helpers/alerts";
import { formatDateTime, formatDay } from "@/lib/format";
import { formatRate } from "@/lib/money";
import { useT } from "@/i18n/LocaleProvider";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div className="flex items-start justify-between gap-4 border-b border-border/60 py-2.5 text-sm last:border-0"><dt className="text-muted-foreground">{label}</dt><dd className="text-end font-medium">{children || "—"}</dd></div>);
}

const FIELDS: Record<string, "money" | "rate" | "date" | "text"> = {
  originalAmount: "money", netAmount: "money", customerCommission: "money", bankCommission: "money", intermediaryCommission: "money",
  commissionRateBps: "rate", transactionDate: "date", notes: "text", machineId: "text", status: "text",
};

export default function TransactionDetailsView({ tx, isAdmin, viewerId }: { tx: TransactionDetails; isAdmin: boolean; viewerId: string }) {
  const { t, locale } = useT();
  const router = useRouter();
  const [dlg, setDlg] = useState<null | "request" | "approve" | "reject">(null);
  const [imgError, setImgError] = useState(false);

  const done = async (res: { ok: boolean; error?: never } | { ok: false; error: { message: string; issues?: string[] } }, msg: string) => {
    if (!res.ok) return notify.apiError((res as { error: { message: string; issues?: string[] } }).error);
    notify.success(msg);
    setDlg(null);
    router.refresh();
  };

  const showVal = (k: string, v: unknown) => {
    if (v === null || v === undefined || v === "") return "—";
    const kind = FIELDS[k] ?? "text";
    if (kind === "money") return <Money value={Number(v)} />;
    if (kind === "rate") return <span className="num">{formatRate(Number(v))}%</span>;
    if (kind === "date") return formatDateTime(String(v), locale);
    return String(v);
  };

  const cancellable = tx.status === "completed";
  const pending = tx.status === "cancellation_pending";
  void viewerId;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={tx.type} /> <StatusBadge status={tx.status} />
        <div className="ms-auto flex flex-wrap gap-2">
          {cancellable && <Link href={`/transactions/${tx._id}/edit`} className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted"><FiEdit2 /> {t("common.edit")}</Link>}
          {cancellable && <AppButton variant="outline" onClick={() => setDlg("request")} className="text-destructive"><FiSlash /> {t("tx.requestCancel")}</AppButton>}
          {pending && isAdmin && (
            <>
              <AppButton onClick={() => setDlg("approve")} className="bg-emerald-600 text-white hover:bg-emerald-700"><FiCheck /> {t("tx.approve")}</AppButton>
              <AppButton onClick={() => setDlg("reject")} className="bg-red-600 text-white hover:bg-red-700"><FiX /> {t("tx.reject")}</AppButton>
            </>
          )}
        </div>
      </div>

      {pending && <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">{t("tx.pendingNote")}</p>}
      {tx.status === "reversed" && <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">{t("tx.reversedNote")}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-2 text-sm font-bold text-muted-foreground">{tx.transactionNumber}</h2>
          <dl>
            <Row label={t("tx.card")}><Link href={`/cards/${tx.cardId}`} className="text-main-color hover:underline">{tx.card?.cardName}</Link></Row>
            <Row label={t("tx.client")}><Link href={`/clients/${tx.clientId}`} className="text-main-color hover:underline">{tx.client?.fullName}</Link></Row>
            <Row label={t("tx.machine")}>{tx.machine?.name}</Row>
            <Row label={t("tx.date")}>{formatDay(tx.transactionDay, locale)} <span className="num">{tx.transactionTime}</span></Row>
            <Row label={t("tx.recordedAt")}>{formatDateTime(tx.createdAt, locale)}</Row>
            <Row label={t("tx.createdBy")}>{tx.createdByUser?.name}</Row>
            {tx.updatedByUser && <Row label={t("tx.updatedBy")}>{tx.updatedByUser.name} <span className="text-xs text-muted-foreground">(#{tx.revision})</span></Row>}
            <Row label={t("tx.notes")}>{tx.notes}</Row>
          </dl>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-2 text-sm font-bold text-muted-foreground">{t("tx.financials")}</h2>
          <dl>
            <Row label={t("tx.amount")}><Money value={tx.originalAmount} tone={tx.type === "withdrawal" ? "withdrawal" : "deposit"} /></Row>
            <Row label={t("tx.netAmount")}><Money value={tx.netAmount} /></Row>
            {tx.type === "withdrawal" && <Row label={t("tx.rate")}><span className="num">{formatRate(tx.commissionRateBps)}%</span> {tx.commissionOverridden && <span className="text-xs text-muted-foreground">({t("tx.manual")})</span>}</Row>}
            <Row label={t("tx.customerCommission")}><Money value={tx.customerCommission} tone="commission" /></Row>
            <Row label={t("tx.bankCommission")}><Money value={tx.bankCommission} /></Row>
            <Row label={t("tx.intermediaryCommission")}><Money value={tx.intermediaryCommission} /></Row>
            <Row label={t("tx.balanceChange")}><Money value={tx.effects.balance} tone="auto" signed /></Row>
            <Row label={t("tx.debtChange")}><Money value={tx.effects.debt} tone={tx.effects.debt > 0 ? "debt" : "credit"} signed /></Row>
          </dl>
        </section>
      </div>

      {tx.cancellation && (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-muted-foreground">{t("tx.cancellation")} <StatusBadge status={tx.cancellation.status} /></h2>
          <dl>
            <Row label={t("tx.reason")}>{tx.cancellation.reason}</Row>
            <Row label={t("tx.requestedBy")}>{tx.cancellation.requestedBy?.name} · {formatDateTime(tx.cancellation.requestedAt, locale)}</Row>
            {tx.cancellation.decidedBy && <Row label={t("tx.decidedBy")}>{tx.cancellation.decidedBy.name} · {formatDateTime(tx.cancellation.decidedAt, locale)}</Row>}
            <Row label={t("tx.decisionNote")}>{tx.cancellation.decisionNote}</Row>
          </dl>
        </section>
      )}

      {tx.hasReceipt && !imgError && (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-bold text-muted-foreground">{t("tx.receipt")}</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/api/receipts/${tx._id}`} alt={t("tx.receipt")} onError={() => setImgError(true)} className="max-h-[480px] rounded-xl border border-border object-contain" />
        </section>
      )}

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-bold text-muted-foreground">{t("tx.history")}</h2>
        <ol className="space-y-4">
          {tx.history.map((h) => (
            <li key={h._id} className="border-s-2 border-main-color/40 ps-4 text-sm">
              <p className="font-semibold">{t(`activity.${h.action}`)} <span className="font-normal text-muted-foreground">— {h.user?.name} · {formatDateTime(h.createdAt, locale)}</span></p>
              {h.reason && <p className="text-muted-foreground">{t("tx.reason")}: {h.reason}</p>}
              {h.oldValues && h.newValues && (
                <ul className="mt-1 space-y-0.5 text-xs">
                  {Object.keys(h.newValues).filter((k) => JSON.stringify((h.oldValues as Record<string, unknown>)[k]) !== JSON.stringify((h.newValues as Record<string, unknown>)[k])).map((k) => (
                    <li key={k} className="flex flex-wrap items-center gap-2"><span className="text-muted-foreground">{t(`field.${k}`)}:</span><span className="line-through opacity-70">{showVal(k, (h.oldValues as Record<string, unknown>)[k])}</span>→<b>{showVal(k, (h.newValues as Record<string, unknown>)[k])}</b></li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>

      <ReasonDialog open={dlg === "request"} onClose={() => setDlg(null)} title={t("tx.requestCancel")} label={t("tx.reason")} confirmText={t("tx.sendRequest")} danger onConfirm={async (reason) => done(await requestCancellationAction(tx._id, { reason }), t("tx.requestSent"))} />
      <ReasonDialog open={dlg === "approve"} onClose={() => setDlg(null)} title={t("tx.approve")} label={t("tx.decisionNote")} confirmText={t("tx.approve")} required={false} onConfirm={async (note) => done(await approveCancellationAction(tx._id, note ? { note } : {}), t("tx.approved"))} />
      <ReasonDialog open={dlg === "reject"} onClose={() => setDlg(null)} title={t("tx.reject")} label={t("tx.rejectReason")} confirmText={t("tx.reject")} danger onConfirm={async (note) => done(await rejectCancellationAction(tx._id, { note }), t("tx.rejected"))} />
    </div>
  );
}

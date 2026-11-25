"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiCheck, FiX } from "react-icons/fi";
import Money from "../shared/money/Money";
import StatusBadge from "../shared/status-badge/StatusBadge";
import AppButton from "../shared/app-button/AppButton";
import ReasonDialog from "../shared/modal/ReasonDialog";
import IsEmpty from "../shared/is-empty/IsEmpty";
import {
  approveCancellationAction,
  rejectCancellationAction,
} from "@/services/actions/transactions.action";
import { CancellationRequestItem } from "@/services/types/transaction_interface";
import { notify } from "@/services/utils/helpers/alerts";
import { formatDateTime } from "@/lib/format";
import { useT } from "@/i18n/LocaleProvider";
import { FiInbox } from "react-icons/fi";

/** Admin-only list of pending cancellation requests with approve / reject. */
export default function CancellationRequestsView({
  items,
}: {
  items: CancellationRequestItem[];
}) {
  const { t, locale } = useT();
  const router = useRouter();
  const [target, setTarget] = useState<{
    id: string;
    mode: "approve" | "reject";
  } | null>(null);

  const run = async (note: string) => {
    if (!target) return;
    const res =
      target.mode === "approve"
        ? await approveCancellationAction(target.id, note ? { note } : {})
        : await rejectCancellationAction(target.id, { note });
    if (!res.ok) return notify.apiError(res.error);
    notify.success(
      target.mode === "approve" ? t("tx.approved") : t("tx.rejected"),
    );
    setTarget(null);
    router.refresh();
  };

  if (items.length === 0)
    return (
      <IsEmpty
        icon={<FiInbox />}
        title={t("tx.noRequests")}
        description={t("tx.noRequestsText")}
      />
    );

  return (
    <div className="space-y-3">
      {items.map((r) => (
        <div
          key={r._id}
          className="rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <Link
                href={`/transactions/${r.transaction?._id}`}
                className="font-bold text-main-color hover:underline num"
              >
                {r.transaction?.transactionNumber}
              </Link>
              <p className="text-sm text-muted-foreground">
                {r.transaction?.card?.cardName} ·{" "}
                {r.transaction?.client?.fullName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {r.transaction && <StatusBadge status={r.transaction.type} />}
              <Money
                value={r.transaction?.originalAmount}
                tone={
                  r.transaction?.type === "withdrawal"
                    ? "withdrawal"
                    : "deposit"
                }
              />
            </div>
          </div>
          <p className="mt-3 rounded-xl bg-muted p-3 text-sm">
            <b>{t("tx.reason")}:</b> {r.reason}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              {t("tx.requestedBy")}: {r.requestedBy?.name} ·{" "}
              {formatDateTime(r.requestedAt, locale)}
            </p>
            <div className="flex gap-2">
              <AppButton
                onClick={() =>
                  setTarget({ id: r.transaction!._id, mode: "approve" })
                }
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <FiCheck /> {t("tx.approve")}
              </AppButton>
              <AppButton
                onClick={() =>
                  setTarget({ id: r.transaction!._id, mode: "reject" })
                }
                className="bg-red-600 text-white hover:bg-red-700"
              >
                <FiX /> {t("tx.reject")}
              </AppButton>
            </div>
          </div>
        </div>
      ))}
      <ReasonDialog
        open={target?.mode === "approve"}
        onClose={() => setTarget(null)}
        title={t("tx.approve")}
        label={t("tx.decisionNote")}
        confirmText={t("tx.approve")}
        required={false}
        onConfirm={run}
      />
      <ReasonDialog
        open={target?.mode === "reject"}
        onClose={() => setTarget(null)}
        title={t("tx.reject")}
        label={t("tx.rejectReason")}
        confirmText={t("tx.reject")}
        danger
        onConfirm={run}
      />
    </div>
  );
}

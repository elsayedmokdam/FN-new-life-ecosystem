"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import DataTable, { Column } from "../shared/data-table/DataTable";
import TablePagination from "../shared/table-pagination/TablePagination";
import FilterSelect from "../shared/filter-select/FilterSelect";
import Modal from "../shared/modal/Modal";
import { getActivityLogsAction } from "@/services/actions/activityLogs.action";
import { ActivityLog } from "@/services/types/notification_interface";
import { PaginationMeta } from "@/services/types/api_interface";
import { notify } from "@/services/utils/helpers/alerts";
import { formatDateTime } from "@/lib/format";
import { useT } from "@/i18n/LocaleProvider";

const ACTIONS = ["login","login_failed","otp_failed","logout","user_created","user_updated","user_status_changed","user_password_reset","client_created","client_updated","card_created","card_updated","card_status_changed","machine_created","machine_updated","machine_status_changed","transaction_created","transaction_updated","cancellation_requested","cancellation_approved","cancellation_rejected","settings_updated","commission_settings_updated"];
const ENTITIES = ["user", "client", "card", "machine", "transaction", "settings"];

export default function ActivityLogsView({ initial }: { initial: { data: ActivityLog[]; meta: PaginationMeta } }) {
  const { t, locale } = useT();
  const [rows, setRows] = useState(initial.data);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(initial.meta);
  const [q, setQ] = useState({ action: "", entityType: "", from: "", to: "", page: 1, limit: 20 });
  const [detail, setDetail] = useState<ActivityLog | null>(null);
  const [pending, startTransition] = useTransition();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    startTransition(async () => {
      const res = await getActivityLogsAction({ page: String(q.page), limit: String(q.limit), action: q.action || undefined, entityType: q.entityType || undefined, from: q.from || undefined, to: q.to || undefined });
      if (!res.ok) return notify.apiError(res.error);
      setRows(res.data.data.data);
      setMeta(res.data.data.meta);
    });
  }, [q]);

  const set = (patch: Partial<typeof q>) => setQ((p) => ({ ...p, page: 1, ...patch }));

  const columns: Column<ActivityLog>[] = [
    { key: "time", header: t("activity.time"), cell: (l) => <span className="whitespace-nowrap">{formatDateTime(l.createdAt, locale)}</span> },
    { key: "user", header: t("activity.user"), cell: (l) => l.user?.name ?? "—" },
    { key: "action", header: t("activity.action"), cell: (l) => <span className="font-semibold">{t(`activity.${l.action}`)}</span> },
    { key: "entity", header: t("activity.entity"), cell: (l) => l.entityType ?? "—", hideable: true },
    { key: "reason", header: t("tx.reason"), cell: (l) => <span className="text-muted-foreground">{l.reason ?? "—"}</span>, hideable: true },
    { key: "ip", header: "IP", cell: (l) => <span className="num text-muted-foreground">{l.ipAddress ?? "—"}</span>, hideable: true, defaultHidden: true },
  ];

  return (
    <div className="p-4 md:p-6">
      <DataTable columns={columns} rows={rows} rowKey={(l) => l._id} loading={pending && rows.length === 0} onRowClick={setDetail} storageKey="activity"
        toolbar={
          <>
            <FilterSelect value={q.action} onChange={(action) => set({ action })} all={t("activity.allActions")} options={ACTIONS.map((a) => ({ value: a, label: t(`activity.${a}`) }))} />
            <FilterSelect value={q.entityType} onChange={(entityType) => set({ entityType })} all={t("activity.allEntities")} options={ENTITIES.map((e) => ({ value: e, label: e }))} />
            <input type="date" value={q.from} onChange={(e) => set({ from: e.target.value, to: q.to || e.target.value })} className="h-10 rounded-xl bg-muted px-3 text-sm" aria-label={t("period.from")} />
            <input type="date" value={q.to} onChange={(e) => set({ to: e.target.value, from: q.from || e.target.value })} className="h-10 rounded-xl bg-muted px-3 text-sm" aria-label={t("period.to")} />
          </>
        }
      />
      <TablePagination meta={meta} disabled={pending} onPage={(page) => setQ((p) => ({ ...p, page }))} onLimit={(limit) => set({ limit })} />

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail ? t(`activity.${detail.action}`) : ""} size="lg">
        {detail && (
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">{detail.user?.name} · {formatDateTime(detail.createdAt, locale)} {detail.ipAddress && <span className="num">· {detail.ipAddress}</span>}</p>
            {detail.reason && <p><b>{t("tx.reason")}:</b> {detail.reason}</p>}
            <div className="grid gap-3 md:grid-cols-2">
              <div><p className="mb-1 font-semibold">{t("activity.before")}</p><pre dir="ltr" className="max-h-72 overflow-auto rounded-xl bg-muted p-3 text-xs">{JSON.stringify(detail.oldValues ?? null, null, 2)}</pre></div>
              <div><p className="mb-1 font-semibold">{t("activity.after")}</p><pre dir="ltr" className="max-h-72 overflow-auto rounded-xl bg-muted p-3 text-xs">{JSON.stringify(detail.newValues ?? null, null, 2)}</pre></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

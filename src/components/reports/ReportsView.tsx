"use client";

import { useMemo, useState, useTransition } from "react";
import { FiDownload, FiFileText, FiPrinter, FiSearch } from "react-icons/fi";
import StatCard from "../shared/stat-card/StatCard";
import Money from "../shared/money/Money";
import StatusBadge from "../shared/status-badge/StatusBadge";
import DataTable, { Column } from "../shared/data-table/DataTable";
import AppButton from "../shared/app-button/AppButton";
import CardPicker from "../shared/card-picker/CardPicker";
import ClientPicker from "../shared/client-picker/ClientPicker";
import { getReportAction } from "@/services/actions/reports.action";
import { Card } from "@/services/types/card_interface";
import { Machine } from "@/services/types/machine_interface";
import { Employee } from "@/services/types/user_interface";
import { ReportKind } from "@/services/types/enums";
import { Report, ReportRow } from "@/services/types/report_interface";
import { notify } from "@/services/utils/helpers/alerts";
import { formatDay, todayISO } from "@/lib/format";
import { formatRate } from "@/lib/money";
import { useT } from "@/i18n/LocaleProvider";

const KINDS: ReportKind[] = ["daily", "monthly", "custom", "card", "client", "employee", "machine", "withdrawals", "deposits", "commissions", "debts", "balances"];
const RANGE_KINDS: ReportKind[] = ["custom", "card", "client", "employee", "machine", "withdrawals", "deposits", "commissions"];

interface Props {
  machines: Machine[];
  employees: Employee[];
  self: { id: string; name: string };
  isAdmin: boolean;
}

export default function ReportsView({ machines, employees, self, isAdmin }: Props) {
  const { t, locale } = useT();
  const [kind, setKind] = useState<ReportKind>("daily");
  const [date, setDate] = useState(todayISO());
  const [month, setMonth] = useState(todayISO().slice(0, 7));
  const [from, setFrom] = useState(todayISO().slice(0, 8) + "01");
  const [to, setTo] = useState(todayISO());
  const [card, setCard] = useState<Card | null>(null);
  const [clientId, setClientId] = useState("");
  const [machineId, setMachineId] = useState("");
  const [userId, setUserId] = useState(isAdmin ? "" : self.id);
  const [report, setReport] = useState<Report | null>(null);
  const [pending, startTransition] = useTransition();

  const needsId = kind === "card" ? !card : kind === "client" ? !clientId : kind === "machine" ? !machineId : kind === "employee" ? !userId : false;
  const rangeInvalid = RANGE_KINDS.includes(kind) && (!from || !to || from > to);

  const params = useMemo(() => {
    const p: Record<string, string> = {};
    if (kind === "daily") p.date = date;
    if (kind === "monthly") p.month = month;
    if (RANGE_KINDS.includes(kind)) { p.from = from; p.to = to; }
    if (kind === "card" && card) p.id = card._id;
    if (kind === "client") p.id = clientId;
    if (kind === "machine") p.id = machineId;
    if (kind === "employee") p.id = userId;
    return p;
  }, [kind, date, month, from, to, card, clientId, machineId, userId]);

  const run = () =>
    startTransition(async () => {
      const res = await getReportAction(kind, params);
      if (!res.ok) return notify.apiError(res.error);
      setReport(res.data.data);
    });

  const exportUrl = (format: "pdf" | "excel") => `/api/reports/export?${new URLSearchParams({ format, report: kind, lang: locale, ...params })}`;

  const txColumns: Column<ReportRow>[] = [
    { key: "n", header: t("tx.number"), cell: (r) => <span className="num font-semibold">{r.transactionNumber}</span> },
    { key: "d", header: t("tx.date"), cell: (r) => <span className="whitespace-nowrap">{formatDay(r.date, locale)} <span className="num text-muted-foreground">{r.time}</span></span> },
    { key: "t", header: t("tx.type"), cell: (r) => <StatusBadge status={r.type} /> },
    { key: "c", header: t("tx.card"), cell: (r) => r.cardName },
    { key: "cl", header: t("tx.client"), cell: (r) => r.clientName },
    { key: "m", header: t("tx.machine"), cell: (r) => r.machineName, hideable: true, defaultHidden: true },
    { key: "a", header: t("tx.amount"), align: "end", cell: (r) => <Money value={r.originalAmount} tone={r.type === "withdrawal" ? "withdrawal" : "deposit"} /> },
    { key: "r", header: t("tx.rate"), align: "end", cell: (r) => <span className="num">{formatRate(r.commissionRateBps)}%</span>, hideable: true },
    { key: "cc", header: t("tx.customerCommission"), align: "end", cell: (r) => <Money value={r.customerCommission} tone="commission" currency={false} />, hideable: true },
    { key: "bc", header: t("tx.bankCommission"), align: "end", cell: (r) => <Money value={r.bankCommission} currency={false} />, hideable: true },
    { key: "ic", header: t("tx.intermediaryCommission"), align: "end", cell: (r) => <Money value={r.intermediaryCommission} currency={false} />, hideable: true },
    { key: "u", header: t("tx.createdBy"), cell: (r) => r.createdBy, hideable: true },
    { key: "s", header: t("tx.status"), cell: (r) => <StatusBadge status={r.status} /> },
  ];

  const s = report?.summary;
  const input = "h-10 rounded-xl border border-input bg-card px-3 text-sm";

  return (
    <div className="space-y-6 p-4 md:p-6">
      <section className="no-print space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <label className="text-sm"><span className="mb-1 block font-medium">{t("report.type")}</span>
            <select value={kind} onChange={(e) => { setKind(e.target.value as ReportKind); setReport(null); }} className={`${input} min-w-52`}>
              {KINDS.map((k) => (<option key={k} value={k}>{t(`report.${k === "employee" ? "employee_" : k}`)}</option>))}
            </select>
          </label>
          {kind === "daily" && <label className="text-sm"><span className="mb-1 block font-medium">{t("report.date")}</span><input type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} className={input} /></label>}
          {kind === "monthly" && <label className="text-sm"><span className="mb-1 block font-medium">{t("report.month")}</span><input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className={input} /></label>}
          {RANGE_KINDS.includes(kind) && (
            <>
              <label className="text-sm"><span className="mb-1 block font-medium">{t("period.from")}</span><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={input} /></label>
              <label className="text-sm"><span className="mb-1 block font-medium">{t("period.to")}</span><input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={input} /></label>
            </>
          )}
          {kind === "machine" && (
            <label className="text-sm"><span className="mb-1 block font-medium">{t("tx.machine")}</span>
              <select value={machineId} onChange={(e) => setMachineId(e.target.value)} className={`${input} min-w-44`}><option value="">—</option>{machines.map((m) => (<option key={m._id} value={m._id}>{m.name}</option>))}</select></label>
          )}
          {kind === "employee" && (
            <label className="text-sm"><span className="mb-1 block font-medium">{t("report.employee")}</span>
              <select value={userId} disabled={!isAdmin} onChange={(e) => setUserId(e.target.value)} className={`${input} min-w-44`}>
                {!isAdmin ? <option value={self.id}>{self.name}</option> : <><option value="">—</option>{employees.map((u) => (<option key={u._id} value={u._id}>{u.name}</option>))}</>}
              </select></label>
          )}
        </div>
        {kind === "card" && <div className="max-w-xl"><CardPicker selected={card} onSelect={setCard} /></div>}
        {kind === "client" && <div className="max-w-xl"><ClientPicker value={clientId} onChange={setClientId} /></div>}
        <div className="flex flex-wrap gap-2">
          <AppButton onClick={run} loading={pending} disabled={needsId || rangeInvalid} className="bg-main-color text-white hover:bg-main-color/90"><FiSearch /> {t("report.generate")}</AppButton>
          <a aria-disabled={needsId || rangeInvalid} href={needsId || rangeInvalid ? undefined : exportUrl("pdf")} className={`flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold ${needsId || rangeInvalid ? "pointer-events-none opacity-40" : "hover:bg-muted"}`}><FiDownload /> PDF</a>
          <a aria-disabled={needsId || rangeInvalid} href={needsId || rangeInvalid ? undefined : exportUrl("excel")} className={`flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold ${needsId || rangeInvalid ? "pointer-events-none opacity-40" : "hover:bg-muted"}`}><FiFileText /> Excel</a>
          {report && <AppButton variant="outline" onClick={() => window.print()}><FiPrinter /> {t("report.print")}</AppButton>}
        </div>
      </section>

      {!report && <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">{t("report.hint")}</p>}

      {report && s && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold">{t(`report.${report.kind === "employee" ? "employee_" : report.kind}`)}</h2>
            {report.period && <p className="text-sm text-muted-foreground">{formatDay(report.period.from, locale)} → {formatDay(report.period.to, locale)}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {s.totalWithdrawals !== undefined && <StatCard title={t("dash.totalWithdrawals")}><Money value={s.totalWithdrawals} tone="withdrawal" /></StatCard>}
            {s.totalDeposits !== undefined && <StatCard title={t("dash.totalDeposits")}><Money value={s.totalDeposits} tone="deposit" /></StatCard>}
            {s.netTransactions !== undefined && <StatCard title={t("dash.netTransactions")} hint={t("dash.netHint")}><Money value={s.netTransactions} tone="auto" signed /></StatCard>}
            {s.transactionCount !== undefined && <StatCard title={t("report.count")}>{s.transactionCount}</StatCard>}
            {s.totalCardBalances !== undefined && <StatCard title={t("dash.totalCardBalances")}><Money value={s.totalCardBalances} /></StatCard>}
            {s.totalClientDebt !== undefined && <StatCard title={t("dash.totalClientDebt")}><Money value={s.totalClientDebt} tone="debt" /></StatCard>}
            {s.totalClientCredit !== undefined && <StatCard title={t("dash.totalClientCredit")}><Money value={s.totalClientCredit} tone="credit" /></StatCard>}
            {s.totalBankCommission !== undefined && <StatCard title={t("dash.bankCommissions")}><Money value={s.totalBankCommission} /></StatCard>}
            {s.totalIntermediaryCommission !== undefined && <StatCard title={t("dash.intermediaryCommissions")}><Money value={s.totalIntermediaryCommission} /></StatCard>}
            {s.totalCustomerCommission !== undefined && <StatCard title={t("dash.customerCommissions")}><Money value={s.totalCustomerCommission} tone="commission" /></StatCard>}
            {s.netCommissionRevenue !== undefined && <StatCard title={t("dash.netCommissionRevenue")} hint={t("dash.provisional")} className="border-dashed"><Money value={s.netCommissionRevenue} /></StatCard>}
          </div>
          {s.netCommissionRevenue !== undefined && <p className="text-xs text-amber-700 dark:text-amber-300">{t("report.provisionalNote")}</p>}

          {report.table ? (
            <DataTable
              columns={(report.kind === "debts"
                ? [
                    { key: "name", header: t("client.fullName"), cell: (r: Record<string, string | number>) => String(r.name ?? "—") },
                    { key: "phone", header: t("client.phone"), cell: (r: Record<string, string | number>) => <span className="num">{r.phone}</span> },
                    { key: "cards", header: t("client.cardsCount"), align: "end", cell: (r: Record<string, string | number>) => <span className="num">{r.cards}</span> },
                    { key: "balance", header: t("card.balance"), align: "end", cell: (r: Record<string, string | number>) => <Money value={Number(r.balance)} /> },
                    { key: "debt", header: t("card.debt"), align: "end", cell: (r: Record<string, string | number>) => <Money value={Number(r.debt)} tone="debt" /> },
                    { key: "credit", header: t("card.currentCredit"), align: "end", cell: (r: Record<string, string | number>) => <Money value={Number(r.credit)} tone="credit" /> },
                  ]
                : [
                    { key: "cardName", header: t("card.name"), cell: (r: Record<string, string | number>) => String(r.cardName) },
                    { key: "clientName", header: t("card.client"), cell: (r: Record<string, string | number>) => String(r.clientName) },
                    { key: "bank", header: t("card.bank"), cell: (r: Record<string, string | number>) => String(r.bank) },
                    { key: "status", header: t("card.status"), cell: (r: Record<string, string | number>) => <StatusBadge status={String(r.status)} /> },
                    { key: "balance", header: t("card.balance"), align: "end", cell: (r: Record<string, string | number>) => <Money value={Number(r.balance)} /> },
                    { key: "debt", header: t("card.debt"), align: "end", cell: (r: Record<string, string | number>) => <Money value={Number(r.debt)} tone="debt" /> },
                    { key: "credit", header: t("card.currentCredit"), align: "end", cell: (r: Record<string, string | number>) => <Money value={Number(r.credit)} tone="credit" /> },
                  ]) as Column<Record<string, string | number>>[]}
              rows={report.table.rows}
              rowKey={(r) => String(r.clientId ?? r.cardId)}
            />
          ) : (
            <>
              <DataTable columns={txColumns} rows={report.transactions} rowKey={(r) => r._id} storageKey="report-tx" />
              {report.truncated && <p className="text-xs text-muted-foreground">{t("report.truncated", { shown: report.transactions.length, total: report.totalRows ?? 0 })}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}

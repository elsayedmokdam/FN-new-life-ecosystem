"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { FiArchive, FiClock, FiCreditCard, FiDollarSign, FiDownload, FiPercent, FiRepeat, FiTrendingDown, FiTrendingUp, FiUsers, FiUserCheck } from "react-icons/fi";
import PeriodFilter, { PeriodValue } from "../shared/period-filter/PeriodFilter";
import StatCard from "../shared/stat-card/StatCard";
import Money from "../shared/money/Money";
import DataTable from "../shared/data-table/DataTable";
import Skeleton from "../shared/skeleton/Skeleton";
import DashboardChartsView from "./DashboardCharts";
import { useTransactionColumns } from "../transactions/useTransactionColumns";
import { getDashboardChartsAction, getDashboardSummaryAction } from "@/services/actions/dashboard.action";
import { DashboardCharts, DashboardSummary } from "@/services/types/dashboard_interface";
import { Transaction } from "@/services/types/transaction_interface";
import { notify } from "@/services/utils/helpers/alerts";
import { useT } from "@/i18n/LocaleProvider";
import { formatDay } from "@/lib/format";
import { useRouter } from "next/navigation";

interface Props {
  summary: DashboardSummary;
  charts: DashboardCharts;
  recent: Transaction[];
}

const grid = "grid gap-4 sm:grid-cols-2 xl:grid-cols-4";

export default function DashboardView({ summary: s0, charts: c0, recent }: Props) {
  const { t, locale } = useT();
  const router = useRouter();
  const [summary, setSummary] = useState(s0);
  const [charts, setCharts] = useState(c0);
  const [period, setPeriod] = useState<PeriodValue>({ period: "this_month" });
  const [pending, startTransition] = useTransition();
  const columns = useTransactionColumns({ detailed: false });

  const change = (p: PeriodValue) => {
    setPeriod(p);
    startTransition(async () => {
      const params = { period: p.period, ...(p.period === "custom" ? { from: p.from, to: p.to } : {}) };
      const [a, b] = await Promise.all([getDashboardSummaryAction(params), getDashboardChartsAction(params)]);
      if (!a.ok) return notify.apiError(a.error);
      if (!b.ok) return notify.apiError(b.error);
      setSummary(a.data.data);
      setCharts(b.data.data);
    });
  };

  const f = summary.financial;
  const o = summary.operational;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PeriodFilter value={period} onChange={change} />
        <p className="text-xs text-muted-foreground">
          {formatDay(summary.period.from, locale)} → {formatDay(summary.period.to, locale)}
        </p>
      </div>

      <div className={pending ? "pointer-events-none opacity-60 transition" : "transition"}>
        <h2 className="mb-3 text-sm font-bold text-muted-foreground">{t("dash.financial")}</h2>
        <div className={grid}>
          <StatCard title={t("dash.totalWithdrawals")} icon={<FiTrendingDown />} accent="bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300"><Money value={f.totalWithdrawals} tone="withdrawal" /></StatCard>
          <StatCard title={t("dash.totalDeposits")} icon={<FiTrendingUp />} accent="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"><Money value={f.totalDeposits} tone="deposit" /></StatCard>
          <StatCard title={t("dash.netTransactions")} icon={<FiRepeat />} hint={t("dash.netHint")}><Money value={f.netTransactions} tone="auto" signed /></StatCard>
          <StatCard title={t("dash.totalClientDebt")} icon={<FiDollarSign />} accent="bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300" hint={t("dash.snapshotHint")}><Money value={f.totalClientDebt} tone="debt" /></StatCard>
          <StatCard title={t("dash.customerCommissions")} icon={<FiPercent />} accent="bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"><Money value={f.totalCustomerCommission} tone="commission" /></StatCard>
        </div>

        <h2 className="mb-3 mt-8 text-sm font-bold text-muted-foreground">{t("dash.operational")}</h2>
        <div className={grid}>
          <StatCard title={t("dash.totalCards")} icon={<FiCreditCard />}>{o.totalCards}</StatCard>
          <StatCard title={t("dash.activeCards")} icon={<FiCreditCard />}>{o.activeCards}</StatCard>
          <StatCard title={t("dash.inactiveCards")} icon={<FiCreditCard />}>{o.inactiveCards}</StatCard>
          <StatCard title={t("dash.archivedCards")} icon={<FiArchive />}>{o.archivedCards}</StatCard>
          <StatCard title={t("dash.totalClients")} icon={<FiUsers />}>{o.totalClients}</StatCard>
          <StatCard title={t("dash.activeEmployees")} icon={<FiUserCheck />}>{o.activeEmployees}</StatCard>
          <StatCard title={t("dash.withdrawalTx")} icon={<FiTrendingDown />}>{o.totalWithdrawalTransactions}</StatCard>
          <StatCard title={t("dash.depositTx")} icon={<FiTrendingUp />}>{o.totalDepositTransactions}</StatCard>
          <Link href="/transactions?tab=requests" className="sm:col-span-2 xl:col-span-1">
            <StatCard title={t("dash.pendingCancellations")} icon={<FiClock />} accent="bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300" className="h-full transition hover:border-main-color">{o.pendingCancellationRequests}</StatCard>
          </Link>
        </div>

        <h2 className="mb-3 mt-8 text-sm font-bold text-muted-foreground">{t("dash.charts")}</h2>
        {pending ? <Skeleton className="h-64 w-full" /> : <DashboardChartsView data={charts} />}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-muted-foreground">{t("dash.recent")}</h2>
          <Link href="/transactions" className="flex items-center gap-1 text-sm font-semibold text-main-color hover:underline"><FiDownload className="hidden" />{t("dash.viewAll")}</Link>
        </div>
        <DataTable columns={columns} rows={recent} rowKey={(r) => r._id} onRowClick={(r) => router.push(`/transactions/${r._id}`)} />
      </div>
    </div>
  );
}

"use client";

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardCharts as ChartsData } from "@/services/types/dashboard_interface";
import { useT } from "@/i18n/LocaleProvider";
import { useAppSelector } from "@/redux/store/hooks";
import { formatMinor } from "@/lib/money";
import { cn } from "@/lib/utils";

const C = { withdrawal: "#dc2626", deposit: "#059669", commission: "#7c3aed", bank: "#0284c7", inter: "#d97706", main: "#2563eb" };
const egp = (minor: number) => minor / 100; // chart axis only (display), never used for calculations
const short = (d: string) => d.slice(5);

function Panel({ title, children, empty }: { title: string; children: React.ReactNode; empty: boolean }) {
  const { t } = useT();
  const privacy = useAppSelector((s) => s.ui.privacy);
  return (
    <div className="relative rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-bold text-foreground">{title}</h3>
      <div dir="ltr" className={cn("h-64 w-full", privacy && "pointer-events-none select-none blur-md")}>
        {empty ? <div className="flex h-full items-center justify-center text-sm text-muted-foreground">{t("table.empty")}</div> : children}
      </div>
      {privacy && <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-muted-foreground">{t("privacy.hidden")}</div>}
    </div>
  );
}

export default function DashboardChartsView({ data }: { data: ChartsData }) {
  const { t } = useT();
  const tip = (v: unknown) => formatMinor(Math.round(Number(v) * 100));
  const nz = (rows: object[], keys: string[]) => rows.some((r) => keys.some((k) => Number((r as Record<string, unknown>)[k]) > 0));

  const wd = data.withdrawalsVsDeposits.map((r) => ({ ...r, date: short(r.date), withdrawals: egp(r.withdrawals), deposits: egp(r.deposits) }));
  const com = data.commissions.map((r) => ({ date: short(r.date), customer: egp(r.customerCommission), bank: egp(r.bankCommission), intermediary: egp(r.intermediaryCommission) }));
  const monthly = data.monthlyVolume.map((r) => ({ ...r, withdrawals: egp(r.withdrawals), deposits: egp(r.deposits) }));
  const balances = data.cardBalanceDistribution.map((r) => ({ name: r.name, value: egp(r.value) }));
  const debts = data.clientDebtDistribution.map((r) => ({ name: r.name, value: egp(r.value) }));
  const grid = <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />;

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Panel title={t("chart.wd")} empty={!nz(wd, ["withdrawals", "deposits"])}>
        <ResponsiveContainer><LineChart data={wd}>{grid}<XAxis dataKey="date" fontSize={11} /><YAxis fontSize={11} width={60} /><Tooltip formatter={tip} /><Legend />
          <Line type="monotone" dataKey="withdrawals" name={t("chart.withdrawals")} stroke={C.withdrawal} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="deposits" name={t("chart.deposits")} stroke={C.deposit} strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer>
      </Panel>

      <Panel title={t("chart.daily")} empty={!nz(data.dailyVolume, ["count"])}>
        <ResponsiveContainer><BarChart data={data.dailyVolume.map((r) => ({ ...r, date: short(r.date) }))}>{grid}<XAxis dataKey="date" fontSize={11} /><YAxis fontSize={11} allowDecimals={false} width={40} /><Tooltip />
          <Bar dataKey="count" name={t("chart.count")} fill={C.main} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
      </Panel>

      <Panel title={t("chart.monthly")} empty={!nz(monthly, ["withdrawals", "deposits"])}>
        <ResponsiveContainer><BarChart data={monthly}>{grid}<XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} width={60} /><Tooltip formatter={tip} /><Legend />
          <Bar dataKey="withdrawals" name={t("chart.withdrawals")} fill={C.withdrawal} radius={[4, 4, 0, 0]} />
          <Bar dataKey="deposits" name={t("chart.deposits")} fill={C.deposit} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
      </Panel>

      <Panel title={t("chart.commissions")} empty={!nz(com, ["customer", "bank", "intermediary"])}>
        <ResponsiveContainer><BarChart data={com}>{grid}<XAxis dataKey="date" fontSize={11} /><YAxis fontSize={11} width={60} /><Tooltip formatter={tip} /><Legend />
          <Bar dataKey="customer" name={t("chart.customerCommission")} stackId="a" fill={C.commission} />
          <Bar dataKey="bank" name={t("chart.bankCommission")} stackId="a" fill={C.bank} />
          <Bar dataKey="intermediary" name={t("chart.intermediaryCommission")} stackId="a" fill={C.inter} /></BarChart></ResponsiveContainer>
      </Panel>

      <Panel title={t("chart.balances")} empty={balances.length === 0}>
        <ResponsiveContainer><BarChart data={balances} layout="vertical" margin={{ left: 20 }}>{grid}<XAxis type="number" fontSize={11} /><YAxis type="category" dataKey="name" fontSize={11} width={90} /><Tooltip formatter={tip} />
          <Bar dataKey="value" name={t("chart.balance")} fill={C.main} radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer>
      </Panel>

      <Panel title={t("chart.debts")} empty={debts.length === 0}>
        <ResponsiveContainer><BarChart data={debts} layout="vertical" margin={{ left: 20 }}>{grid}<XAxis type="number" fontSize={11} /><YAxis type="category" dataKey="name" fontSize={11} width={90} /><Tooltip formatter={tip} />
          <Bar dataKey="value" name={t("chart.debt")} fill={C.inter} radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer>
      </Panel>
    </div>
  );
}

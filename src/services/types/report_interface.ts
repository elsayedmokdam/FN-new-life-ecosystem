import { FinancialTotals } from "./dashboard_interface";
import { ReportKind, TransactionStatus, TransactionType } from "./enums";

export interface ReportRow {
  _id: string;
  transactionNumber: string;
  date: string;
  time: string;
  type: TransactionType;
  cardName: string;
  clientName: string;
  machineName: string;
  originalAmount: number;
  netAmount: number;
  commissionRateBps: number;
  intermediaryCommissionRateBps?: number | null;
  machineCommissionType?: "egypt_and_ahly" | "other_banks";
  customerCommission: number;
  bankCommission: number;
  intermediaryCommission: number;
  totalCommission: number;
  createdBy: string;
  status: TransactionStatus;
  notes: string;
}

export interface Report {
  kind: ReportKind;
  businessName: string;
  currency: string;
  timezone: string;
  generatedAt: string;
  period: { from: string; to: string } | null;
  summary: Partial<FinancialTotals>;
  transactions: ReportRow[];
  totalRows?: number;
  truncated: boolean;
  table?: { key: string; rows: Record<string, string | number>[] };
}

export interface ReportParams {
  period?: string;
  from?: string;
  to?: string;
  date?: string;
  month?: string;
  type?: string;
  cardId?: string;
  clientId?: string;
  machineId?: string;
  userId?: string;
  id?: string;
}

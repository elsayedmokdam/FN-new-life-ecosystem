import { ReversalStatus, TransactionStatus, TransactionType } from "./enums";

export interface Transaction {
  _id: string;
  transactionNumber: string;
  cardId: string;
  clientId: string;
  machineId?: string;
  card?: { _id: string; cardName: string; maskedNumber: string; status: string };
  client?: { _id: string; fullName: string; phone: string };
  machine?: { _id: string; name: string };
  createdByUser?: { _id: string; name: string };
  updatedByUser?: { _id: string; name: string };
  type: TransactionType;
  originalAmount: number;
  netAmount: number;
  commissionRateBps: number;
  commissionOverridden: boolean;
  customerCommission: number;
  bankCommission: number;
  intermediaryCommission: number;
  transactionDate: string;
  transactionDay: string;
  transactionTime: string;
  status: TransactionStatus;
  notes?: string;
  hasReceipt: boolean;
  receiptMeta?: { originalName?: string; mimeType?: string; size?: number };
  rules?: { netAmountMode: string; bankCommissionPaidBy: string; intermediaryTreatment: string };
  effects: { balance: number; debt: number };
  revision: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cancellation {
  _id: string;
  status: ReversalStatus;
  reason: string;
  requestedBy?: { _id: string; name: string };
  requestedAt: string;
  decidedBy?: { _id: string; name: string };
  decidedAt?: string;
  decisionNote?: string;
}

export interface TransactionHistoryItem {
  _id: string;
  action: string;
  user?: { _id: string; name: string };
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  reason?: string;
  createdAt: string;
}

export interface TransactionDetails extends Transaction {
  cancellation?: Cancellation;
  history: TransactionHistoryItem[];
}

export interface CancellationRequestItem extends Cancellation {
  transaction?: Transaction;
}

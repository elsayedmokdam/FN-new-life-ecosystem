import { CardStatus } from "./enums";
import { NewClientPayload } from "./client_interface";

/** All money values are INTEGERS in minor units (piasters). */
export interface Card {
  _id: string;
  cardName: string;
  clientId: string;
  client?: { _id: string; fullName: string; phone: string; email?: string; address?: string; notes?: string };
  maskedNumber: string;
  cardLast4: string;
  bankProvider?: string;
  cardType?: string;
  openingBalance: number;
  balance: number;
  netDebt: number;
  currentDebt: number;
  currentCredit: number;
  totalWithdrawals: number;
  totalDeposits: number;
  totalCustomerCommission: number;
  totalBankCommission: number;
  totalIntermediaryCommission: number;
  commissionRateBps?: number;
  intermediaryName?: string;
  intermediaryPhone?: string;
  intermediaryNotes?: string;
  notes?: string;
  status: CardStatus;
  createdAt: string;
}

export interface CardFinancialSummary {
  cardId: string;
  openingBalance: number;
  currentBalance: number;
  totalWithdrawals: number;
  totalDeposits: number;
  netDebt: number;
  currentDebt: number;
  currentCredit: number;
  totalBankCommission: number;
  totalIntermediaryCommission: number;
  totalCustomerCommission: number;
  commissionRateBps: number;
  ledgerConsistent: boolean;
}

export interface CreateCardPayload {
  cardName: string;
  clientId?: string;
  newClient?: NewClientPayload;
  cardNumber: string;
  bankProvider?: string;
  cardType?: string;
  openingBalance?: number;
  intermediaryName?: string;
  intermediaryPhone?: string;
  intermediaryNotes?: string;
  notes?: string;
  status?: CardStatus;
}

export type UpdateCardPayload = Partial<
  Pick<CreateCardPayload, "cardName" | "bankProvider" | "cardType" | "intermediaryName" | "intermediaryPhone" | "intermediaryNotes" | "notes" | "status">
>;

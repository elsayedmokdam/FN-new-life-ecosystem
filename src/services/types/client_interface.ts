import { Card } from "./card_interface";
import { EntityStatus } from "./enums";

export interface Client {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  manualBalance?: number;
  profit?: number;
  actualProfit?: number;
  status: EntityStatus;
  createdAt: string;
  cardsCount?: number;
  totalBalance?: number;
  netDebt?: number;
  totalDebt?: number;
  totalCredit?: number;
}

export interface ClientDetails extends Client {
  cards: Card[];
  totals: {
    cardsCount: number;
    totalBalance: number;
    netDebt: number;
    totalDebt: number;
    totalCredit: number;
    profit?: number;
    actualProfit?: number;
  };
}

export interface NewClientPayload {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface UpdateClientPayload extends Partial<NewClientPayload> {
  manualBalance?: number;
  status?: EntityStatus;
}

export interface AdjustClientDebtPayload {
  cardId: string;
  debt: number;
  reason: string;
}

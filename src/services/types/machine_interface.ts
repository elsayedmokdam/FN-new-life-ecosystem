import { EntityStatus } from "./enums";

export interface Machine {
  _id: string;
  name: string;
  type?: string;
  egyptAndAhlyCommissionRateBps?: number;
  otherBanksCommissionRateBps?: number;
  description?: string;
  status: EntityStatus;
  createdAt: string;
  transactionCount?: number;
  volume?: number;
  withdrawalCount?: number;
  withdrawalVolume?: number;
}

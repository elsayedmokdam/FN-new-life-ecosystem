import { EntityStatus } from "./enums";

export interface Machine {
  _id: string;
  name: string;
  type?: string;
  description?: string;
  status: EntityStatus;
  createdAt: string;
  transactionCount?: number;
  volume?: number;
}

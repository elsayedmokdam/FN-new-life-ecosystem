import { BankPaidBy, IntermediaryTreatment, NetAmountMode } from "./enums";

export interface CommissionSettings {
  defaultCommissionRateBps: number;
  rules: { netAmountMode: NetAmountMode; bankCommissionPaidBy: BankPaidBy; intermediaryTreatment: IntermediaryTreatment };
  rulesConfirmed: boolean;
  cardRequiredFields: string[];
  updatedAt?: string;
}

export interface SystemSettings {
  cardRequiredFields: string[];
  businessName: string;
  currency: string;
  timezone: string;
  weekStartDay: number;
}

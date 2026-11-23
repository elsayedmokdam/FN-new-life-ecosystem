import * as zod from "zod";
import { nameRule, rateRule, TFn } from "./common";

export const machineSchema = (t: TFn) =>
  zod.object({ name: nameRule(t), type: zod.string().max(50).optional(), description: zod.string().max(500).optional() });

export const commissionSettingsSchema = (t: TFn) =>
  zod.object({
    defaultCommissionRate: rateRule(t),
    netAmountMode: zod.enum(["original_amount", "original_minus_bank"]),
    bankCommissionPaidBy: zod.enum(["business", "customer"]),
    intermediaryTreatment: zod.enum(["business_cost", "added_to_debt"]),
    rulesConfirmed: zod.boolean(),
  });

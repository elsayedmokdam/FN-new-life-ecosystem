import * as zod from "zod";
import { dateRule, moneyRule, rateRule, TFn, timeRule } from "./common";

export const transactionSchema = (t: TFn) =>
  zod.object({
    cardId: zod.string(t("validation.required")).min(1, t("validation.required")),
    type: zod.enum(["withdrawal", "deposit"]),
    originalAmount: moneyRule(t, { positive: true }),
    transactionDate: dateRule(t),
    transactionTime: timeRule(t),
    machineId: zod.string().optional(),
    bankCommission: moneyRule(t, { optional: true }),
    intermediaryCommission: moneyRule(t, { optional: true }),
    commissionRate: rateRule(t, true),
    customerCommission: moneyRule(t, { optional: true }),
    notes: zod.string().max(2000).optional(),
  });

export const editTransactionSchema = (t: TFn) =>
  zod.object({
    reason: zod.string(t("validation.required")).trim().min(3, t("validation.reasonMin")).max(1000),
    originalAmount: moneyRule(t, { positive: true }),
    transactionDate: dateRule(t),
    transactionTime: timeRule(t),
    machineId: zod.string().optional(),
    bankCommission: moneyRule(t, { optional: true }),
    intermediaryCommission: moneyRule(t, { optional: true }),
    commissionRate: rateRule(t, true),
    customerCommission: moneyRule(t, { optional: true }),
    notes: zod.string().max(2000).optional(),
  });

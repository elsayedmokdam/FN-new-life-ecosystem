import * as zod from "zod";
import { nameRule, rateRule, TFn } from "./common";

export const machineSchema = (t: TFn) =>
  zod.object({
    name: nameRule(t),
    type: zod.string().max(50).optional(),
    egyptAndAhlyCommissionRate: rateRule(t, true),
    otherBanksCommissionRate: rateRule(t, true),
    description: zod.string().max(500).optional(),
  });

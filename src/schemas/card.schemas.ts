import * as zod from "zod";
import { cardNumberRule, moneyRule, nameRule, phoneRule, TFn } from "./common";

/** `required`: the card fields the administrator marked as mandatory in the system settings. */
export const cardSchema = (t: TFn, required: string[] = [], mode: "create" | "edit" = "create") =>
  zod
    .object({
      cardName: nameRule(t),
      clientMode: zod.enum(["existing", "new"]),
      clientId: zod.string().optional(),
      newClientName: zod.string().optional(),
      newClientPhone: zod.string().optional(),
      newClientEmail: zod.string().optional(),
      newClientAddress: zod.string().optional(),
      newClientNotes: zod.string().optional(),
      cardNumber: mode === "create" ? cardNumberRule(t) : zod.string().optional(),
      bankProvider: zod.string().max(100).optional(),
      cardType: zod.string().max(50).optional(),
      openingBalance: mode === "create" ? moneyRule(t, { optional: true }) : zod.string().optional(),
      intermediaryName: zod.string().max(100).optional(),
      intermediaryPhone: zod.string().max(30).optional(),
      intermediaryNotes: zod.string().max(1000).optional(),
      notes: zod.string().max(2000).optional(),
      status: zod.enum(["active", "inactive", "archived"]),
    })
    .superRefine((d, ctx) => {
      if (mode === "create") {
        if (d.clientMode === "existing" && !d.clientId) ctx.addIssue({ code: "custom", path: ["clientId"], message: t("validation.clientRequired") });
        if (d.clientMode === "new") {
          if (!d.newClientName || d.newClientName.trim().length < 2) ctx.addIssue({ code: "custom", path: ["newClientName"], message: t("validation.required") });
          if (!phoneRule(t).safeParse(d.newClientPhone ?? "").success) ctx.addIssue({ code: "custom", path: ["newClientPhone"], message: t("validation.phone") });
          if (d.newClientEmail && !zod.email().safeParse(d.newClientEmail).success) ctx.addIssue({ code: "custom", path: ["newClientEmail"], message: t("validation.email") });
        }
      }
      for (const key of required) {
        const v = (d as Record<string, unknown>)[key];
        if (!v || String(v).trim() === "") ctx.addIssue({ code: "custom", path: [key], message: t("validation.required") });
      }
    });

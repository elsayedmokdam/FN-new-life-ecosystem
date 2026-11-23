import * as zod from "zod";
import { parseMinor, parseRateBps } from "@/lib/money";

export type TFn = (key: string, vars?: Record<string, string | number>) => string;

// These rules mirror the API's `generalValidationFields` so users see the error before the request is sent.
export const emailRule = (t: TFn) => zod.string(t("validation.required")).trim().pipe(zod.email(t("validation.email")));

export const passwordRule = (t: TFn) =>
  zod
    .string(t("validation.required"))
    .min(8, t("validation.passwordMin"))
    .max(64, t("validation.passwordMax"))
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, t("validation.passwordComplex"));

export const otpRule = (t: TFn) => zod.string(t("validation.required")).regex(/^[0-9]{6}$/, t("validation.otp"));

export const phoneRule = (t: TFn) =>
  zod.string(t("validation.required")).trim().regex(/^\+?[0-9]{8,15}$/, t("validation.phone"));

export const nameRule = (t: TFn, min = 2) =>
  zod.string(t("validation.required")).trim().min(min, t("validation.minChars", { n: min })).max(100, t("validation.maxChars", { n: 100 }));

/** decimal string with up to 2 decimals ("1234.50"). Empty allowed when `optional`. */
export const moneyRule = (t: TFn, { optional = false, positive = false }: { optional?: boolean; positive?: boolean } = {}) =>
  zod
    .string()
    .refine((v) => (optional && v.trim() === "") || parseMinor(v) !== null, t("validation.amount"))
    .refine((v) => !positive || (optional && v.trim() === "") || (parseMinor(v) ?? 0) > 0, t("validation.amountPositive"))
    .refine((v) => (optional && v.trim() === "") || (parseMinor(v) ?? 0) >= 0, t("validation.amountNegative"));

export const rateRule = (t: TFn, optional = false) =>
  zod.string().refine((v) => (optional && v.trim() === "") || parseRateBps(v) !== null, t("validation.rate"));

export const dateRule = (t: TFn) => zod.string(t("validation.required")).regex(/^\d{4}-\d{2}-\d{2}$/, t("validation.date"));

export const timeRule = (t: TFn) => zod.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, t("validation.time")).or(zod.literal(""));

export const cardNumberRule = (t: TFn) =>
  zod
    .string(t("validation.required"))
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine((v) => /^[0-9]{12,19}$/.test(v), t("validation.cardNumber"));

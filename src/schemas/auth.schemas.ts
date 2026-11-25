import * as zod from "zod";
import { emailRule, otpRule, passwordRule, TFn } from "./common";

export const signinSchema = (t: TFn) => zod.object({ email: emailRule(t), password: zod.string(t("validation.required")).min(1, t("validation.required")) });

export const otpSchema = (t: TFn) => zod.object({ otp: otpRule(t) });

export const changePasswordSchema = (t: TFn) =>
  zod
    .object({
      currentPassword: zod.string(t("validation.required")).min(1, t("validation.required")),
      newPassword: passwordRule(t),
      confirmPassword: zod.string(t("validation.required")),
    })
    .refine((d) => d.newPassword === d.confirmPassword, { path: ["confirmPassword"], message: t("validation.passwordMatch") });

export const createEmployeeSchema = (t: TFn) =>
  zod
    .object({
      name: zod.string(t("validation.required")).trim().min(3, t("validation.minChars", { n: 3 })).max(60),
      email: emailRule(t),
      password: passwordRule(t),
      confirmPassword: zod.string(t("validation.required")),
    })
    .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: t("validation.passwordMatch") });

export const resetPasswordSchema = (t: TFn) =>
  zod
    .object({ newPassword: passwordRule(t), confirmPassword: zod.string(t("validation.required")) })
    .refine((d) => d.newPassword === d.confirmPassword, { path: ["confirmPassword"], message: t("validation.passwordMatch") });

export const forgotPasswordSchema = (t: TFn) =>
  zod.object({ email: emailRule(t) });

export const passwordResetOtpSchema = (t: TFn) =>
  zod.object({ otp: otpRule(t) });

export const passwordResetSchema = (t: TFn) =>
  zod
    .object({
      newPassword: passwordRule(t),
      confirmPassword: zod.string(t("validation.required")),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
      path: ["confirmPassword"],
      message: t("validation.passwordMatch"),
    });

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MdEmail } from "react-icons/md";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";
import AppForm from "../shared/app-form/AppForm";
import AppInput from "../shared/app-input/AppInput";
import { FormField } from "../shared/app-form/app_form.interface";
import { $SCHEMAS_REPOSITORY } from "@/schemas/schemas.repo";
import {
  forgotPasswordAction,
  resendPasswordResetOtpAction,
  resetPasswordAction,
  verifyPasswordResetOtpAction,
} from "@/services/actions/auth.action";
import { PasswordResetVerification } from "@/services/types/auth_interface";
import { notify } from "@/services/utils/helpers/alerts";
import { useCooldown } from "@/hooks/useCooldown";
import { useT } from "@/i18n/LocaleProvider";

type Step = "email" | "otp" | "password";

export default function ForgotPasswordForm() {
  const { t } = useT();
  const router = useRouter();
  const cooldown = useCooldown(60);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [verification, setVerification] =
    useState<PasswordResetVerification | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [resending, setResending] = useState(false);

  const emailFields: FormField[] = useMemo(
    () => [
      {
        name: "email",
        type: "input",
        label: t("auth.email"),
        placeholder: "you@example.com",
        props: {
          type: "email",
          autoComplete: "email",
          dir: "ltr",
          className: "rounded-xl",
          icon: <MdEmail className="size-4 text-muted-foreground/70" />,
        },
      },
    ],
    [t],
  );

  const otpFields: FormField[] = useMemo(
    () => [
      {
        name: "otp",
        type: "input",
        label: t("auth.otp"),
        placeholder: "••••••",
        props: {
          type: "text",
          inputMode: "numeric",
          maxLength: 6,
          autoComplete: "one-time-code",
          dir: "ltr",
          autoFocus: true,
          className: "rounded-xl text-center font-mono text-lg tracking-widest",
          icon: <FaShieldAlt className="size-4 text-muted-foreground/70" />,
        },
      },
    ],
    [t],
  );

  const passwordFields: FormField[] = useMemo(
    () => [
      {
        name: "newPassword",
        type: "input",
        label: t("auth.newPassword"),
        placeholder: "••••••••",
        props: {
          type: showPassword ? "text" : "password",
          autoComplete: "new-password",
          dir: "ltr",
          className: "rounded-xl",
          icon: <FaLock className="size-4 text-muted-foreground/70" />,
          endIcon: (
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={t("auth.togglePassword")}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            >
              {showPassword ? (
                <FaEyeSlash className="size-4" />
              ) : (
                <FaEye className="size-4" />
              )}
            </button>
          ),
        },
      },
      {
        name: "confirmPassword",
        type: "input",
        label: t("auth.confirmPassword"),
        placeholder: "••••••••",
        props: {
          type: showPassword ? "text" : "password",
          autoComplete: "new-password",
          dir: "ltr",
          className: "rounded-xl",
          icon: <FaLock className="size-4 text-muted-foreground/70" />,
          endIcon: (
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={t("auth.togglePassword")}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            >
              {showPassword ? (
                <FaEyeSlash className="size-4" />
              ) : (
                <FaEye className="size-4" />
              )}
            </button>
          ),
        },
      },
    ],
    [showPassword, t],
  );

  async function requestCode(data: { email: string }) {
    const result = await forgotPasswordAction({ email: data.email });
    if (!result.ok) return notify.apiError(result.error);

    const challenge = result.data.data;
    if (
      !challenge?.challengeId ||
      !/^[0-9a-fA-F]{24}$/.test(challenge.challengeId)
    ) {
      notify.error(t("auth.missingResetChallenge"));
      return;
    }
    setEmail(data.email);
    setChallengeId(challenge.challengeId);
    setStep("otp");
    cooldown.start();
    notify.success(t("auth.resetCodeSent"));
  }

  async function verifyCode(data: { otp: string }) {
    const result = await verifyPasswordResetOtpAction({
      challengeId,
      otp: data.otp,
    });
    if (!result.ok) return notify.apiError(result.error);

    const verifiedReset = result.data.data;
    if (
      !verifiedReset?.challengeId ||
      verifiedReset.challengeId !== challengeId ||
      !/^[0-9a-f]{64}$/.test(verifiedReset.resetToken) ||
      !Number.isFinite(verifiedReset.expiresInSeconds) ||
      verifiedReset.expiresInSeconds <= 0
    ) {
      notify.error(t("auth.missingResetChallenge"));
      return;
    }

    setVerification(verifiedReset);
    setStep("password");
    notify.success(t("auth.resetVerified"));
  }

  async function resendCode() {
    if (!challengeId) {
      notify.error(t("auth.missingResetChallenge"));
      return;
    }
    setResending(true);
    const result = await resendPasswordResetOtpAction({ challengeId });
    setResending(false);
    if (!result.ok) return notify.apiError(result.error);
    cooldown.start();
    notify.success(t("auth.otpResent"));
  }

  async function submitPassword(data: {
    newPassword: string;
    confirmPassword: string;
  }) {
    if (!verification) {
      notify.error(t("auth.missingResetChallenge"));
      return;
    }
    const result = await resetPasswordAction({
      challengeId: verification.challengeId,
      resetToken: verification.resetToken,
      ...data,
    });
    if (!result.ok) return notify.apiError(result.error);
    notify.success(t("auth.passwordReset"));
    router.push("/signin");
  }

  if (step === "otp") {
    return (
      <>
        <p className="mb-5 text-center text-sm text-muted-foreground">
          {t("auth.resetCodeHint", { email })}
        </p>
        <AppForm
          fields={otpFields}
          components={{ input: AppInput }}
          defaultValues={{ otp: "" }}
          onSubmit={verifyCode}
          buttonText={t("auth.verify")}
          schema={$SCHEMAS_REPOSITORY.PASSWORD_RESET_OTP_FORM(t)}
        />
        <div className="mt-4 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setStep("email")}
            className="cursor-pointer text-muted-foreground hover:text-main-color"
          >
            {t("auth.back")}
          </button>
          <button
            type="button"
            disabled={cooldown.active || resending}
            onClick={resendCode}
            className="cursor-pointer font-semibold text-main-color disabled:cursor-not-allowed disabled:text-muted-foreground"
          >
            {resending
              ? t("common.loading")
              : cooldown.active
              ? t("auth.resendIn", { s: cooldown.remaining })
              : t("auth.resend")}
          </button>
        </div>
      </>
    );
  }

  if (step === "password") {
    return (
      <>
        {verification && (
          <p className="mb-5 text-center text-sm text-muted-foreground">
            {t("auth.resetTokenExpires", {
              minutes: Math.ceil(verification.expiresInSeconds / 60),
            })}
          </p>
        )}
        <AppForm
          fields={passwordFields}
          components={{ input: AppInput }}
          defaultValues={{ newPassword: "", confirmPassword: "" }}
          onSubmit={submitPassword}
          formClassName="space-y-4"
          layoutClassName="space-y-4"
          buttonText={t("auth.resetPassword")}
          schema={$SCHEMAS_REPOSITORY.PASSWORD_RESET_FORM(t)}
        />
      </>
    );
  }

  return (
    <AppForm
      fields={emailFields}
      components={{ input: AppInput }}
      defaultValues={{ email: "" }}
      onSubmit={requestCode}
      formClassName="space-y-4"
      layoutClassName="space-y-4"
      buttonText={t("auth.sendResetCode")}
      schema={$SCHEMAS_REPOSITORY.FORGOT_PASSWORD_FORM(t)}
    />
  );
}

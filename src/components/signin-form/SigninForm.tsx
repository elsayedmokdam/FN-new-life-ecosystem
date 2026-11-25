"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import AppForm from "../shared/app-form/AppForm";
import AppInput from "../shared/app-input/AppInput";
import AppButton from "../shared/app-button/AppButton";
import { FormField } from "../shared/app-form/app_form.interface";
import { $SCHEMAS_REPOSITORY } from "@/schemas/schemas.repo";
import { loginAction, resendOtpAction } from "@/services/actions/auth.action";
import { OtpChallenge } from "@/services/types/auth_interface";
import { notify } from "@/services/utils/helpers/alerts";
import { safeRedirect } from "@/services/utils/helpers/safeRedirect";
import { useCooldown } from "@/hooks/useCooldown";
import { useT } from "@/i18n/LocaleProvider";

/**
 * Two-step sign-in. Step 1: e-mail + password -> the API e-mails a one-time code (no session yet).
 * Step 2: the code is exchanged for the session through NextAuth (the token lives in an httpOnly cookie).
 */
export default function SigninForm({ callbackUrl }: { callbackUrl?: string }) {
  const { t } = useT();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [challenge, setChallenge] = useState<OtpChallenge | null>(null);
  const cooldown = useCooldown(60);
  const [resending, setResending] = useState(false);

  const fields: FormField[] = useMemo(
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
      {
        name: "password",
        type: "input",
        label: t("auth.password"),
        placeholder: "••••••••",
        props: {
          type: showPassword ? "text" : "password",
          autoComplete: "current-password",
          dir: "ltr",
          className: "rounded-xl",
          icon: <FaLock className="size-4 text-muted-foreground/70" />,
          endIcon: (
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
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
          dir: "ltr",
          autoComplete: "one-time-code",
          autoFocus: true,
          className: "rounded-xl text-center font-mono text-lg tracking-widest",
          icon: <FaShieldAlt className="size-4 text-muted-foreground/70" />,
        },
      },
    ],
    [t],
  );

  const schema = useMemo(() => $SCHEMAS_REPOSITORY.SIGNIN_FORM(t), [t]);
  const otpSchema = useMemo(() => $SCHEMAS_REPOSITORY.OTP_FORM(t), [t]);

  async function onSubmit(data: { email: string; password: string }) {
    const res = await loginAction(data);
    if (!res.ok) return notify.apiError(res.error);
    setChallenge(res.data.data);
    cooldown.start();
    notify.success(t("auth.otpSent"));
  }

  async function onSubmitOtp(data: { otp: string }) {
    const res = await signIn("credentials", {
      challengeId: challenge?.challengeId,
      otp: data.otp,
      redirect: false,
    });
    if (res?.error) return notify.error(res.error);
    notify.success(t("auth.welcome"));
    router.push(safeRedirect(callbackUrl));
    router.refresh();
  }

  async function resend() {
    if (!challenge) return;
    setResending(true);
    const res = await resendOtpAction({ challengeId: challenge.challengeId });
    setResending(false);
    if (!res.ok) return notify.apiError(res.error);
    setChallenge(res.data.data);
    cooldown.start();
    notify.success(t("auth.otpResent"));
  }

  if (challenge) {
    return (
      <>
        <p className="mb-5 text-center text-sm text-muted-foreground">
          {t("auth.otpHint", {
            email: challenge.email,
            minutes: Math.ceil(challenge.expiresInSeconds / 60),
          })}
        </p>
        <AppForm
          key="otp"
          fields={otpFields}
          components={{ input: AppInput }}
          onSubmit={onSubmitOtp}
          buttonText={t("auth.verify")}
          schema={otpSchema}
        />
        <div className="mt-4 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setChallenge(null)}
            className="cursor-pointer text-muted-foreground hover:text-main-color"
          >
            {t("auth.back")}
          </button>
          <AppButton
            type="button"
            variant="ghost"
            loading={resending}
            disabled={cooldown.active}
            onClick={resend}
            className="text-xs text-main-color"
          >
            {cooldown.active
              ? t("auth.resendIn", { s: cooldown.remaining })
              : t("auth.resend")}
          </AppButton>
        </div>
      </>
    );
  }

  return (
    <>
      <AppForm
        key="credentials"
        fields={fields}
        components={{ input: AppInput }}
        defaultValues={{ email: "", password: "" }}
        onSubmit={onSubmit}
        formClassName="space-y-4"
        layoutClassName="space-y-4"
        buttonText={t("auth.continue")}
        schema={schema}
      />
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => router.push("/forgot-password")}
          className="cursor-pointer text-sm font-semibold text-main-color hover:underline"
        >
          {t("auth.forgotPassword")}
        </button>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/forgot-password-form/ForgotPasswordForm";
import AuthLayout from "@/components/shared/auth-layout/AuthLayout";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Forgot password" };

export default async function ForgotPasswordPage() {
  const { t } = await getT();
  return (
    <AuthLayout
      appName={t("app.name")}
      title={t("auth.forgotTitle")}
      subtitle={t("auth.forgotSubtitle")}
      tagline={t("auth.tagline")}
      highlights={[t("auth.h1"), t("auth.h2"), t("auth.h3")]}
      footer={
        <a
          href="/signin"
          className="font-semibold text-main-color hover:underline"
        >
          {t("auth.back")}
        </a>
      }
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

import type { Metadata } from "next";
import SigninForm from "@/components/signin-form/SigninForm";
import AuthLayout from "@/components/shared/auth-layout/AuthLayout";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Sign in" };

export default async function SigninPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const { t } = await getT();
  return (
    <AuthLayout
      appName={t("app.name")}
      title={t("auth.title")}
      subtitle={t("auth.subtitle")}
      tagline={t("auth.tagline")}
      highlights={[t("auth.h1"), t("auth.h2"), t("auth.h3")]}
      footer={t("auth.noRegistration")}
    >
      <SigninForm callbackUrl={callbackUrl} />
    </AuthLayout>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import AppForm from "../shared/app-form/AppForm";
import AppInput from "../shared/app-input/AppInput";
import StatusBadge from "../shared/status-badge/StatusBadge";
import { $SCHEMAS_REPOSITORY } from "@/schemas/schemas.repo";
import { changePasswordAction } from "@/services/actions/auth.action";
import { notify } from "@/services/utils/helpers/alerts";
import { formatDateTime } from "@/lib/format";
import { useT } from "@/i18n/LocaleProvider";

export default function ProfileView({ user, sessionExpires }: { user: { name: string; email: string; role: string }; sessionExpires?: number }) {
  const { t, locale } = useT();
  const router = useRouter();
  return (
    <div className="mx-auto grid max-w-4xl gap-6 p-4 md:p-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-8">
        <div className="mb-5 flex items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground">{user.name.slice(0, 1).toUpperCase()}</span>
          <div><p className="text-lg font-bold">{user.name}</p><p dir="ltr" className="text-sm text-muted-foreground">{user.email}</p></div>
        </div>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">{t("profile.role")}</dt><dd><StatusBadge status={user.role} label={t(`role.${user.role}`)} /></dd></div>
          {sessionExpires && <div className="flex justify-between"><dt className="text-muted-foreground">{t("profile.sessionEnds")}</dt><dd className="font-medium">{formatDateTime(sessionExpires, locale)}</dd></div>}
        </dl>
        <p className="mt-5 rounded-xl bg-muted p-3 text-xs text-muted-foreground">{t("profile.sessionNote")}</p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-8">
        <h2 className="mb-4 text-lg font-bold">{t("profile.changePassword")}</h2>
        <AppForm
          fields={[
            { name: "currentPassword", type: "input", label: t("profile.currentPassword"), props: { dir: "ltr", type: "password", autoComplete: "current-password" } },
            { name: "newPassword", type: "input", label: t("emp.newPassword"), props: { dir: "ltr", type: "password", autoComplete: "new-password" } },
            { name: "confirmPassword", type: "input", label: t("emp.confirmPassword"), props: { dir: "ltr", type: "password", autoComplete: "new-password" } },
          ]}
          components={{ input: AppInput }}
          schema={$SCHEMAS_REPOSITORY.CHANGE_PASSWORD_FORM(t)}
          defaultValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
          buttonText={t("common.save")}
          onSubmit={async (d: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
            const res = await changePasswordAction(d);
            if (!res.ok) return notify.apiError(res.error);
            notify.success(t("profile.passwordChanged"));
            await signOut({ redirect: false });
            router.push("/signin");
            router.refresh();
          }}
        />
      </section>
    </div>
  );
}

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
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa6";
import { useState } from "react";

export default function ProfileView({
  user,
  sessionExpires,
}: {
  user: { name: string; email: string; role: string };
  sessionExpires?: number;
}) {
  const { t, locale } = useT();
  const router = useRouter();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="mx-auto grid max-w-4xl gap-6 p-4 md:p-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-8">
        <div className="mb-5 flex items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <p className="text-lg font-bold">{user.name}</p>
            <p dir="ltr" className="text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t("profile.role")}</dt>
            <dd>
              <StatusBadge status={user.role} label={t(`role.${user.role}`)} />
            </dd>
          </div>
          {sessionExpires && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                {t("profile.sessionEnds")}
              </dt>
              <dd className="font-medium">
                {formatDateTime(sessionExpires, locale)}
              </dd>
            </div>
          )}
        </dl>
        <p className="mt-5 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
          {t("profile.sessionNote")}
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-8">
        <h2 className="mb-4 text-lg font-bold">
          {t("profile.changePassword")}
        </h2>
        <AppForm
          fields={[
            {
              name: "currentPassword",
              type: "input",
              label: t("profile.currentPassword"),
              props: {
                dir: "ltr",
                type: showCurrentPassword ? "text" : "password",
                autoComplete: "current-password",
                icon: <FaLock className="size-4 text-muted-foreground/70" />,
                endIcon: (
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    aria-label={t("auth.togglePassword")}
                    className="flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                  >
                    {showCurrentPassword ? (
                      <FaEyeSlash className="size-4" />
                    ) : (
                      <FaEye className="size-4" />
                    )}
                  </button>
                ),
              },
            },
            {
              name: "newPassword",
              type: "input",
              label: t("emp.newPassword"),
              props: {
                dir: "ltr",
                type: showNewPassword ? "text" : "password",
                autoComplete: "new-password",
                icon: <FaLock className="size-4 text-muted-foreground/70" />,
                endIcon: (
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    aria-label={t("auth.togglePassword")}
                    className="flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                  >
                    {showNewPassword ? (
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
              label: t("emp.confirmPassword"),
              props: {
                dir: "ltr",
                type: showConfirmPassword ? "text" : "password",
                autoComplete: "new-password",
                icon: <FaLock className="size-4 text-muted-foreground/70" />,
                endIcon: (
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={t("auth.togglePassword")}
                    className="flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="size-4" />
                    ) : (
                      <FaEye className="size-4" />
                    )}
                  </button>
                ),
              },
            },
          ]}
          components={{ input: AppInput }}
          schema={$SCHEMAS_REPOSITORY.CHANGE_PASSWORD_FORM(t)}
          defaultValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          buttonText={t("common.save")}
          onSubmit={async (d: {
            currentPassword: string;
            newPassword: string;
            confirmPassword: string;
          }) => {
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

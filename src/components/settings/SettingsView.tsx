"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppCheckbox from "../shared/app-checkbox/AppCheckbox";
import AppButton from "../shared/app-button/AppButton";
import { updateSystemSettingsAction } from "@/services/actions/settings.action";
import { SystemSettings } from "@/services/types/settings_interface";
import { notify } from "@/services/utils/helpers/alerts";
import { useT } from "@/i18n/LocaleProvider";

const CARD_FIELDS = [
  "bankProvider",
  "cardType",
  "intermediaryName",
  "intermediaryPhone",
  "notes",
] as const;

export default function SettingsView({
  settings,
}: {
  settings: SystemSettings;
}) {
  const { t } = useT();
  const router = useRouter();
  const [required, setRequired] = useState<string[]>(
    settings.cardRequiredFields,
  );
  const [saving, setSaving] = useState(false);
  const weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-8">
        <h2 className="text-lg font-bold">{t("settings.systemInfo")}</h2>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">
              {t("settings.businessName")}
            </dt>
            <dd className="font-medium">{settings.businessName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("settings.currency")}</dt>
            <dd className="font-medium">{settings.currency}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("settings.timezone")}</dt>
            <dd className="font-medium">{settings.timezone}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">
              {t("settings.weekStartDay")}
            </dt>
            <dd className="font-medium">
              {t(
                `settings.weekday.${weekdays[settings.weekStartDay] ?? "sun"}`,
              )}
            </dd>
          </div>
        </dl>
      </section>
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-8">
        <h2 className="text-lg font-bold">{t("settings.cardFields")}</h2>
        <p className="mb-5 mt-1 text-sm text-muted-foreground">
          {t("settings.cardFieldsText")}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {CARD_FIELDS.map((f) => (
            <AppCheckbox
              key={f}
              label={t(`settings.field.${f}`)}
              value={required.includes(f)}
              onChange={(on) =>
                setRequired((p) => (on ? [...p, f] : p.filter((x) => x !== f)))
              }
            />
          ))}
        </div>
        <AppButton
          loading={saving}
          className="mt-5 bg-main-color text-white hover:bg-main-color/90"
          onClick={async () => {
            setSaving(true);
            const res = await updateSystemSettingsAction({
              cardRequiredFields: required,
            });
            setSaving(false);
            if (!res.ok) return notify.apiError(res.error);
            notify.success(t("settings.saved"));
            router.refresh();
          }}
        >
          {t("common.save")}
        </AppButton>
      </section>
    </div>
  );
}

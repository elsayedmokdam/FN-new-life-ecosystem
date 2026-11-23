"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiAlertTriangle } from "react-icons/fi";
import AppForm from "../shared/app-form/AppForm";
import AppInput from "../shared/app-input/AppInput";
import AppSelectOptions from "../shared/app-select-options/AppSelectOptions";
import AppCheckbox from "../shared/app-checkbox/AppCheckbox";
import AppButton from "../shared/app-button/AppButton";
import { $SCHEMAS_REPOSITORY } from "@/schemas/schemas.repo";
import { updateCommissionSettingsAction, updateSystemSettingsAction } from "@/services/actions/settings.action";
import { CommissionSettings } from "@/services/types/settings_interface";
import { notify } from "@/services/utils/helpers/alerts";
import { formatRate, parseRateBps } from "@/lib/money";
import { useT } from "@/i18n/LocaleProvider";

const CARD_FIELDS = ["bankProvider", "cardType", "intermediaryName", "intermediaryPhone", "notes"] as const;

export default function SettingsView({ settings }: { settings: CommissionSettings }) {
  const { t } = useT();
  const router = useRouter();
  const [required, setRequired] = useState<string[]>(settings.cardRequiredFields);
  const [saving, setSaving] = useState(false);

  const opt = (keys: string[], ns: string) => keys.map((k) => ({ value: k, label: t(`${ns}.${k}`) }));

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-8">
        <h2 className="text-lg font-bold">{t("settings.commission")}</h2>
        <p className="mb-5 mt-1 text-sm text-muted-foreground">{t("settings.commissionText")}</p>

        {!settings.rulesConfirmed && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
            <FiAlertTriangle className="mt-0.5 size-5 shrink-0" />
            <p>{t("settings.rulesUnconfirmed")}</p>
          </div>
        )}

        <AppForm
          fields={[
            { name: "defaultCommissionRate", type: "input", label: t("settings.defaultRate"), props: { dir: "ltr", inputMode: "decimal" } },
            { name: "netAmountMode", type: "select", label: t("settings.netAmountMode"), props: { values: opt(["original_amount", "original_minus_bank"], "settings.net") } },
            { name: "bankCommissionPaidBy", type: "select", label: t("settings.bankPaidBy"), props: { values: opt(["business", "customer"], "settings.bank") } },
            { name: "intermediaryTreatment", type: "select", label: t("settings.intermediaryTreatment"), props: { values: opt(["business_cost", "added_to_debt"], "settings.inter") } },
            { name: "rulesConfirmed", type: "checkbox", props: { label: t("settings.confirmRules"), hint: t("settings.confirmRulesHint") } },
          ]}
          components={{ input: AppInput, select: AppSelectOptions, checkbox: AppCheckbox }}
          schema={$SCHEMAS_REPOSITORY.COMMISSION_SETTINGS_FORM(t)}
          defaultValues={{ defaultCommissionRate: formatRate(settings.defaultCommissionRateBps), ...settings.rules, rulesConfirmed: settings.rulesConfirmed }}
          layoutClassName="space-y-5"
          buttonText={t("common.save")}
          buttonClassName="bg-main-color text-white font-semibold px-6 py-6 rounded-xl w-full sm:w-auto flex items-center justify-center gap-2 transition"
          onSubmit={async (d: { defaultCommissionRate: string; netAmountMode: string; bankCommissionPaidBy: string; intermediaryTreatment: string; rulesConfirmed: boolean }) => {
            const res = await updateCommissionSettingsAction({
              defaultCommissionRateBps: parseRateBps(d.defaultCommissionRate) ?? 0,
              netAmountMode: d.netAmountMode,
              bankCommissionPaidBy: d.bankCommissionPaidBy,
              intermediaryTreatment: d.intermediaryTreatment,
              rulesConfirmed: d.rulesConfirmed,
            });
            if (!res.ok) return notify.apiError(res.error);
            notify.success(t("settings.saved"));
            router.refresh();
          }}
        />
        <p className="mt-4 rounded-xl bg-muted p-3 text-xs text-muted-foreground">{t("settings.historyNote")}</p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-8">
        <h2 className="text-lg font-bold">{t("settings.cardFields")}</h2>
        <p className="mb-5 mt-1 text-sm text-muted-foreground">{t("settings.cardFieldsText")}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {CARD_FIELDS.map((f) => (
            <AppCheckbox key={f} label={t(`settings.field.${f}`)} value={required.includes(f)} onChange={(on) => setRequired((p) => (on ? [...p, f] : p.filter((x) => x !== f)))} />
          ))}
        </div>
        <AppButton loading={saving} className="mt-5 bg-main-color text-white hover:bg-main-color/90" onClick={async () => {
          setSaving(true);
          const res = await updateSystemSettingsAction({ cardRequiredFields: required });
          setSaving(false);
          if (!res.ok) return notify.apiError(res.error);
          notify.success(t("settings.saved"));
          router.refresh();
        }}>{t("common.save")}</AppButton>
      </section>
    </div>
  );
}

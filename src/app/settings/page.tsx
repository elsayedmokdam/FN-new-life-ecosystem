import type { Metadata } from "next";
import { FiSettings } from "react-icons/fi";
import PageHeader from "@/components/shared/page-header/PageHeader";
import SettingsView from "@/components/settings/SettingsView";
import ApiError from "@/components/shared/api-error/ApiError";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { t } = await getT();
  const res = await $SERVICE_REPOSITORY.Settings.getSystemSettings();
  return (
    <>
      <PageHeader icon={<FiSettings />} title={t("nav.settings")} subtitle={t("settings.subtitle")} />
      {res.ok ? <SettingsView settings={res.data.data} /> : <ApiError error={res.error} />}
    </>
  );
}

import type { Metadata } from "next";
import { FiPlus } from "react-icons/fi";
import PageHeader from "@/components/shared/page-header/PageHeader";
import CardForm from "@/components/cards/CardForm";
import ApiError from "@/components/shared/api-error/ApiError";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Add card" };

export default async function NewCardPage({ searchParams }: { searchParams: Promise<{ clientId?: string }> }) {
  const { clientId } = await searchParams;
  const { t } = await getT();
  const settings = await $SERVICE_REPOSITORY.Settings.getSystemSettings();
  return (
    <>
      <PageHeader icon={<FiPlus />} title={t("card.add")} subtitle={t("card.addSubtitle")} />
      {settings.ok ? <CardForm requiredFields={settings.data.data.cardRequiredFields} initialClientId={clientId} /> : <ApiError error={settings.error} />}
    </>
  );
}

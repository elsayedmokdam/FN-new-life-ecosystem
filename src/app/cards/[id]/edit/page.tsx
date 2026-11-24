import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FiEdit2 } from "react-icons/fi";
import PageHeader from "@/components/shared/page-header/PageHeader";
import CardForm from "@/components/cards/CardForm";
import ApiError from "@/components/shared/api-error/ApiError";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { isObjectId } from "@/services/utils/helpers/validators";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Edit card" };

export default async function EditCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isObjectId(id)) notFound();
  const { t } = await getT();
  const [card, settings] = await Promise.all([
    $SERVICE_REPOSITORY.Cards.getCard(id),
    $SERVICE_REPOSITORY.Settings.getSystemSettings(),
  ]);
  if (!card.ok && card.error.status === 404) notFound();
  return (
    <>
      <PageHeader
        icon={<FiEdit2 />}
        title={t("card.edit")}
        subtitle={card.ok ? card.data.data.cardName : undefined}
      />
      {card.ok && settings.ok ? (
        <CardForm
          card={card.data.data}
          requiredFields={settings.data.data.cardRequiredFields}
        />
      ) : (
        <ApiError
          error={
            !card.ok ? card.error : !settings.ok ? settings.error : undefined
          }
        />
      )}
    </>
  );
}

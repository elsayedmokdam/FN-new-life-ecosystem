import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FiCreditCard } from "react-icons/fi";
import PageHeader from "@/components/shared/page-header/PageHeader";
import CardDetailsView from "@/components/cards/CardDetailsView";
import ApiError from "@/components/shared/api-error/ApiError";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { firstError } from "@/services/utils/helpers/firstError";
import { isObjectId } from "@/services/utils/helpers/validators";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Card details" };

export default async function CardDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isObjectId(id)) notFound();
  const { t } = await getT();
  const [card, summary, tx] = await Promise.all([
    $SERVICE_REPOSITORY.Cards.getCard(id),
    $SERVICE_REPOSITORY.Cards.getCardSummary(id),
    $SERVICE_REPOSITORY.Transactions.getTransactions({
      cardId: id,
      page: "1",
      limit: "10",
      sort: "transactionDate:desc",
    }),
  ]);
  if (!card.ok && card.error.status === 404) notFound();
  return (
    <>
      <PageHeader
        icon={<FiCreditCard />}
        title={card.ok ? card.data.data.cardName : t("card.details")}
        subtitle={card.ok ? card.data.data.client?.fullName : undefined}
      />
      {card.ok && summary.ok && tx.ok ? (
        <CardDetailsView
          card={card.data.data}
          summary={summary.data.data}
          initialTx={tx.data.data}
        />
      ) : (
        <ApiError error={firstError(card, summary, tx)} />
      )}
    </>
  );
}

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { FiRepeat } from "react-icons/fi";
import PageHeader from "@/components/shared/page-header/PageHeader";
import TransactionForm from "@/components/transactions/TransactionForm";
import ApiError from "@/components/shared/api-error/ApiError";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { firstError } from "@/services/utils/helpers/firstError";
import { isObjectId } from "@/services/utils/helpers/validators";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Add transaction" };

export default async function CardNewTransactionPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ type?: string }> }) {
  const { id } = await params;
  const { type } = await searchParams;
  if (!isObjectId(id)) notFound();
  const { t } = await getT();
  const [card, machines, settings] = await Promise.all([
    $SERVICE_REPOSITORY.Cards.getCard(id),
    $SERVICE_REPOSITORY.Machines.getMachines({ status: "active", limit: "200" }),
    $SERVICE_REPOSITORY.Settings.getCommissionSettings(),
  ]);
  if (!card.ok && card.error.status === 404) notFound();
  if (card.ok && card.data.data.status !== "active") redirect(`/cards/${id}`);
  return (
    <>
      <PageHeader icon={<FiRepeat />} title={t("tx.add")} subtitle={card.ok ? `${card.data.data.cardName} · ${card.data.data.client?.fullName ?? ""}` : undefined} />
      {card.ok && machines.ok && settings.ok ? (
        <TransactionForm card={card.data.data} machines={machines.data.data.data} settings={settings.data.data} initialType={type === "deposit" ? "deposit" : "withdrawal"} />
      ) : (
        <ApiError error={firstError(card, machines, settings)} />
      )}
    </>
  );
}

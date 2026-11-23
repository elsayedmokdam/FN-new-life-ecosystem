import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FiRepeat } from "react-icons/fi";
import PageHeader from "@/components/shared/page-header/PageHeader";
import TransactionForm from "@/components/transactions/TransactionForm";
import ApiError from "@/components/shared/api-error/ApiError";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { isObjectId } from "@/services/utils/helpers/validators";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Add transaction" };

export default async function NewTransactionPage({ searchParams }: { searchParams: Promise<{ cardId?: string; type?: string }> }) {
  const { cardId, type } = await searchParams;
  if (cardId && isObjectId(cardId)) redirect(`/cards/${cardId}/transactions/new${type ? `?type=${type}` : ""}`);
  const { t } = await getT();
  const [machines, settings] = await Promise.all([
    $SERVICE_REPOSITORY.Machines.getMachines({ status: "active", limit: "200" }),
    $SERVICE_REPOSITORY.Settings.getCommissionSettings(),
  ]);
  return (
    <>
      <PageHeader icon={<FiRepeat />} title={t("tx.add")} subtitle={t("tx.addSubtitle")} />
      {machines.ok && settings.ok ? <TransactionForm machines={machines.data.data.data} settings={settings.data.data} initialType={type === "deposit" ? "deposit" : "withdrawal"} /> : <ApiError error={!machines.ok ? machines.error : !settings.ok ? settings.error : undefined} />}
    </>
  );
}

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { FiEdit2 } from "react-icons/fi";
import PageHeader from "@/components/shared/page-header/PageHeader";
import TransactionForm from "@/components/transactions/TransactionForm";
import ApiError from "@/components/shared/api-error/ApiError";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { firstError } from "@/services/utils/helpers/firstError";
import { isObjectId } from "@/services/utils/helpers/validators";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Edit transaction" };

export default async function EditTransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isObjectId(id)) notFound();
  const { t } = await getT();
  const [tx, machines, settings] = await Promise.all([
    $SERVICE_REPOSITORY.Transactions.getTransaction(id),
    $SERVICE_REPOSITORY.Machines.getMachines({ limit: "200" }),
    $SERVICE_REPOSITORY.Settings.getCommissionSettings(),
  ]);
  if (!tx.ok && tx.error.status === 404) notFound();
  if (tx.ok && tx.data.data.status !== "completed") redirect(`/transactions/${id}`);
  return (
    <>
      <PageHeader icon={<FiEdit2 />} title={t("tx.edit")} subtitle={tx.ok ? tx.data.data.transactionNumber : undefined} />
      {tx.ok && machines.ok && settings.ok ? (
        <TransactionForm transaction={tx.data.data} machines={machines.data.data.data} settings={settings.data.data} />
      ) : (
        <ApiError error={firstError(tx, machines, settings)} />
      )}
    </>
  );
}

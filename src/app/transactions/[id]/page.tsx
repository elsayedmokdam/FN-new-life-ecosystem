import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FiRepeat } from "react-icons/fi";
import PageHeader from "@/components/shared/page-header/PageHeader";
import TransactionDetailsView from "@/components/transactions/TransactionDetailsView";
import ApiError from "@/components/shared/api-error/ApiError";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { getMyToken } from "@/services/utils/helpers/getMyToken";
import { isObjectId } from "@/services/utils/helpers/validators";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Transaction" };

export default async function TransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isObjectId(id)) notFound();
  const { t } = await getT();
  const [tx, token] = await Promise.all([$SERVICE_REPOSITORY.Transactions.getTransaction(id), getMyToken()]);
  if (!tx.ok && tx.error.status === 404) notFound();
  return (
    <>
      <PageHeader icon={<FiRepeat />} title={tx.ok ? tx.data.data.transactionNumber : t("tx.details")} subtitle={t("tx.details")} />
      {tx.ok ? <TransactionDetailsView tx={tx.data.data} isAdmin={token?.role === "admin"} viewerId={token?.userId ?? ""} /> : <ApiError error={tx.error} />}
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { FiPlus, FiRepeat } from "react-icons/fi";
import PageHeader from "@/components/shared/page-header/PageHeader";
import TransactionsPageView from "@/components/transactions/TransactionsPageView";
import ApiError from "@/components/shared/api-error/ApiError";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { getMyToken } from "@/services/utils/helpers/getMyToken";
import { isObjectId } from "@/services/utils/helpers/validators";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Transactions" };

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
    machineId?: string;
    cardId?: string;
    clientId?: string;
  }>;
}) {
  const sp = await searchParams;
  const { t } = await getT();
  const token = await getMyToken();
  const isAdmin = token?.role === "admin";
  const pick = (v?: string) => (v && isObjectId(v) ? v : undefined);
  const machineId = pick(sp.machineId),
    cardId = pick(sp.cardId),
    clientId = pick(sp.clientId);

  const [list, requests] = await Promise.all([
    $SERVICE_REPOSITORY.Transactions.getTransactions({
      page: "1",
      limit: "10",
      sort: "transactionDate:desc",
      machineId,
      cardId,
      clientId,
    }),
    isAdmin
      ? $SERVICE_REPOSITORY.Transactions.getCancellationRequests({
          limit: "50",
        })
      : Promise.resolve(null),
  ]);
  return (
    <>
      <PageHeader
        icon={<FiRepeat />}
        title={t("nav.transactions")}
        subtitle={t("tx.subtitle")}
        actions={
          <Link
            href="/transactions/new"
            className="flex items-center gap-2 rounded-xl bg-main-color px-4 py-2.5 text-sm font-semibold text-white"
          >
            <FiPlus /> <span className="hidden sm:inline">{t("tx.add")}</span>
          </Link>
        }
      />
      {list.ok ? (
        <TransactionsPageView
          initial={list.data.data}
          requests={requests?.ok ? requests.data.data.data : []}
          isAdmin={isAdmin}
          initialTab={sp.tab === "requests" ? "requests" : "all"}
          machineId={machineId}
          cardId={cardId}
          clientId={clientId}
        />
      ) : (
        <ApiError error={list.error} />
      )}
    </>
  );
}

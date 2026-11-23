import type { Metadata } from "next";
import Link from "next/link";
import { FiCreditCard, FiPlus } from "react-icons/fi";
import PageHeader from "@/components/shared/page-header/PageHeader";
import CardsView from "@/components/cards/CardsView";
import ApiError from "@/components/shared/api-error/ApiError";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Cards" };

export default async function CardsPage({ searchParams }: { searchParams: Promise<{ clientId?: string }> }) {
  const { clientId } = await searchParams;
  const { t } = await getT();
  const res = await $SERVICE_REPOSITORY.Cards.getCards({ page: "1", limit: "10", sort: "createdAt:desc", clientId });
  return (
    <>
      <PageHeader
        icon={<FiCreditCard />}
        title={t("nav.cards")}
        subtitle={t("card.subtitle")}
        actions={<Link href="/cards/new" className="flex items-center gap-2 rounded-xl bg-main-color px-4 py-2.5 text-sm font-semibold text-white"><FiPlus /> <span className="hidden sm:inline">{t("card.add")}</span></Link>}
      />
      {res.ok ? <CardsView initial={res.data.data} initialClientId={clientId} /> : <ApiError error={res.error} />}
    </>
  );
}

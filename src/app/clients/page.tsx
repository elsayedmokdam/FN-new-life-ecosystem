import type { Metadata } from "next";
import { FiUsers } from "react-icons/fi";
import PageHeader from "@/components/shared/page-header/PageHeader";
import ClientsView from "@/components/clients/ClientsView";
import ApiError from "@/components/shared/api-error/ApiError";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Clients" };

export default async function ClientsPage() {
  const { t } = await getT();
  const res = await $SERVICE_REPOSITORY.Clients.getClients({ page: "1", limit: "10", sort: "createdAt:desc" });
  return (
    <>
      <PageHeader icon={<FiUsers />} title={t("nav.clients")} subtitle={t("client.subtitle")} />
      {res.ok ? <ClientsView initial={res.data.data} /> : <ApiError error={res.error} />}
    </>
  );
}

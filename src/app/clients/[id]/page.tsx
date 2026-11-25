import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FiUsers } from "react-icons/fi";
import PageHeader from "@/components/shared/page-header/PageHeader";
import ClientDetailsView from "@/components/clients/ClientDetailsView";
import ApiError from "@/components/shared/api-error/ApiError";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { isObjectId } from "@/services/utils/helpers/validators";
import { getT } from "@/i18n/server";
import { getMyToken } from "@/services/utils/helpers/getMyToken";

export const metadata: Metadata = { title: "Client" };

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isObjectId(id)) notFound();
  const { t } = await getT();
  const [res, token] = await Promise.all([
    $SERVICE_REPOSITORY.Clients.getClient(id),
    getMyToken(),
  ]);
  if (!res.ok && res.error.status === 404) notFound();
  return (
    <>
      <PageHeader
        icon={<FiUsers />}
        title={res.ok ? res.data.data.fullName : t("nav.clients")}
        subtitle={t("client.details")}
      />
      {res.ok ? (
        <ClientDetailsView
          client={res.data.data}
          isAdmin={token?.role === "admin"}
        />
      ) : (
        <ApiError error={res.error} />
      )}
    </>
  );
}

import type { Metadata } from "next";
import { FiCpu } from "react-icons/fi";
import PageHeader from "@/components/shared/page-header/PageHeader";
import MachinesView from "@/components/machines/MachinesView";
import ApiError from "@/components/shared/api-error/ApiError";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Machines" };

export default async function MachinesPage() {
  const { t } = await getT();
  const res = await $SERVICE_REPOSITORY.Machines.getMachines({ limit: "200" });
  return (
    <>
      <PageHeader
        icon={<FiCpu />}
        title={t("nav.machines")}
        subtitle={t("machine.subtitle")}
      />
      {res.ok ? (
        <MachinesView machines={res.data.data.data} />
      ) : (
        <ApiError error={res.error} />
      )}
    </>
  );
}

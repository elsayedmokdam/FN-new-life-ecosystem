import type { Metadata } from "next";
import { FiBarChart2 } from "react-icons/fi";
import PageHeader from "@/components/shared/page-header/PageHeader";
import ReportsView from "@/components/reports/ReportsView";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { getMyToken } from "@/services/utils/helpers/getMyToken";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Reports" };

export default async function ReportsPage() {
  const { t } = await getT();
  const token = await getMyToken();
  const isAdmin = token?.role === "admin";
  const [machines, users] = await Promise.all([
    $SERVICE_REPOSITORY.Machines.getMachines({ limit: "200" }),
    isAdmin ? $SERVICE_REPOSITORY.Users.getUsers({ limit: "100" }) : Promise.resolve(null),
  ]);
  return (
    <>
      <PageHeader icon={<FiBarChart2 />} title={t("nav.reports")} subtitle={t("report.subtitle")} />
      <ReportsView machines={machines.ok ? machines.data.data.data : []} employees={users?.ok ? users.data.data.data : []} self={{ id: token?.userId ?? "", name: (token?.name as string) ?? "" }} isAdmin={isAdmin} />
    </>
  );
}

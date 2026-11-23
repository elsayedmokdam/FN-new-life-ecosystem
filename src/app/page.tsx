import type { Metadata } from "next";
import { FiHome } from "react-icons/fi";
import PageHeader from "@/components/shared/page-header/PageHeader";
import DashboardView from "@/components/dashboard/DashboardView";
import ApiError from "@/components/shared/api-error/ApiError";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { firstError } from "@/services/utils/helpers/firstError";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { t } = await getT();
  const [summary, charts, recent] = await Promise.all([
    $SERVICE_REPOSITORY.Dashboard.getDashboardSummary({ period: "this_month" }),
    $SERVICE_REPOSITORY.Dashboard.getDashboardCharts({ period: "this_month" }),
    $SERVICE_REPOSITORY.Dashboard.getRecentTransactions(),
  ]);

  return (
    <>
      <PageHeader icon={<FiHome />} title={t("nav.dashboard")} subtitle={t("dash.subtitle")} />
      {summary.ok && charts.ok && recent.ok ? (
        <DashboardView summary={summary.data.data} charts={charts.data.data} recent={recent.data.data} />
      ) : (
        <ApiError error={firstError(summary, charts, recent)} />
      )}
    </>
  );
}

import type { Metadata } from "next";
import { FiActivity } from "react-icons/fi";
import PageHeader from "@/components/shared/page-header/PageHeader";
import ActivityLogsView from "@/components/activity/ActivityLogsView";
import ApiError from "@/components/shared/api-error/ApiError";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Activity logs" };

export default async function ActivityLogsPage() {
  const { t } = await getT();
  const res = await $SERVICE_REPOSITORY.ActivityLogs.getActivityLogs({
    page: "1",
    limit: "20",
  });
  return (
    <>
      <PageHeader
        icon={<FiActivity />}
        title={t("nav.activityLogs")}
        subtitle={t("activity.subtitle")}
      />
      {res.ok ? (
        <ActivityLogsView initial={res.data.data} />
      ) : (
        <ApiError error={res.error} />
      )}
    </>
  );
}

import type { Metadata } from "next";
import { FiBell } from "react-icons/fi";
import PageHeader from "@/components/shared/page-header/PageHeader";
import NotificationsView from "@/components/notifications/NotificationsView";
import ApiError from "@/components/shared/api-error/ApiError";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const { t } = await getT();
  const res = await $SERVICE_REPOSITORY.Notifications.getNotifications({
    page: "1",
    limit: "15",
  });
  return (
    <>
      <PageHeader
        icon={<FiBell />}
        title={t("nav.notifications")}
        subtitle={t("notif.subtitle")}
      />
      {res.ok ? (
        <NotificationsView initial={res.data.data} />
      ) : (
        <ApiError error={res.error} />
      )}
    </>
  );
}

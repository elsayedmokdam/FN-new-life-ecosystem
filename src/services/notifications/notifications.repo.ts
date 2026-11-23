import { getNotificationsService } from "./getNotifications.service";
import { markNotificationReadService } from "./markNotificationRead.service";
import { markAllNotificationsReadService } from "./markAllNotificationsRead.service";

export const NotificationsRepo = {
  getNotifications: getNotificationsService,
  markNotificationRead: markNotificationReadService,
  markAllNotificationsRead: markAllNotificationsReadService,
};

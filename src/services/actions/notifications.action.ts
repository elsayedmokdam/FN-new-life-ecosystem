"use server";

import $SERVICE_REPOSITORY from "../service.repo";
import { HttpResult } from "../utils/http";
import { invalidIdResult, isObjectId } from "../utils/helpers/validators";
import { ApiResponse, Paginated, ListParams, PaginationMeta } from "../types/api_interface";
import { AppNotification } from "../types/notification_interface";

export async function getNotificationsAction(params: ListParams & { unread?: string } = {}): Promise<HttpResult<ApiResponse<Paginated<AppNotification> & { meta: PaginationMeta & { unreadCount: number } }>>> {
  return $SERVICE_REPOSITORY.Notifications.getNotifications(params);
}

export async function markNotificationReadAction(id: string): Promise<HttpResult<ApiResponse<AppNotification>>> {
  if (!isObjectId(id)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Notifications.markNotificationRead(id);
}

export async function markAllNotificationsReadAction(): Promise<HttpResult<ApiResponse>> {
  return $SERVICE_REPOSITORY.Notifications.markAllNotificationsRead();
}

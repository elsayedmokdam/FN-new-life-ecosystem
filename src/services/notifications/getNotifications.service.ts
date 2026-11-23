import { BASE_URL } from "../config";
import { ApiResponse, Paginated, ListParams, PaginationMeta } from "../types/api_interface";
import { AppNotification } from "../types/notification_interface";
import { toQuery } from "../utils/helpers/query";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/notifications";

/** My notifications. */
export const getNotificationsService = async (params: ListParams & { unread?: string } = {}): Promise<HttpResult<ApiResponse<Paginated<AppNotification> & { meta: PaginationMeta & { unreadCount: number } }>>> => {
  const token = await getAccessToken();
  return httpClient.get<ApiResponse<Paginated<AppNotification> & { meta: PaginationMeta & { unreadCount: number } }>>(
    `${BASE_URL}/notifications${toQuery(params)}`,
    { requiredAuthToken: true, token },
  );
};

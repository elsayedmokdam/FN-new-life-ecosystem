import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { AppNotification } from "../types/notification_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/notifications/${id}/read";

/** Mark one notification as read. */
export const markNotificationReadService = async (id: string): Promise<HttpResult<ApiResponse<AppNotification>>> => {
  const token = await getAccessToken();
  return httpClient.patch<ApiResponse<AppNotification>>(
    `${BASE_URL}/notifications/${id}/read`,
    undefined,
    { requiredAuthToken: true, token },
  );
};

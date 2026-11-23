import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/notifications/read-all";

/** Mark every notification as read. */
export const markAllNotificationsReadService = async (): Promise<HttpResult<ApiResponse>> => {
  const token = await getAccessToken();
  return httpClient.patch<ApiResponse>(
    `${BASE_URL}/notifications/read-all`,
    undefined,
    { requiredAuthToken: true, token },
  );
};

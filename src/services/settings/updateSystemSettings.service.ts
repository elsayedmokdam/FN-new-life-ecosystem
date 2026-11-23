import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/settings/system";

/** Admin: configure the required card fields. */
export const updateSystemSettingsService = async (payload: { cardRequiredFields: string[] }): Promise<HttpResult<ApiResponse<{ cardRequiredFields: string[] }>>> => {
  const token = await getAccessToken();
  return httpClient.patch<ApiResponse<{ cardRequiredFields: string[] }>>(
    `${BASE_URL}/settings/system`,
    payload,
    { requiredAuthToken: true, token },
  );
};

import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { SystemSettings } from "../types/settings_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/settings/system";

/** System settings. */
export const getSystemSettingsService = async (): Promise<HttpResult<ApiResponse<SystemSettings>>> => {
  const token = await getAccessToken();
  return httpClient.get<ApiResponse<SystemSettings>>(
    `${BASE_URL}/settings/system`,
    { requiredAuthToken: true, token },
  );
};

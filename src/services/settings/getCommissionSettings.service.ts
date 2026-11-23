import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { CommissionSettings } from "../types/settings_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/settings/commissions";

/** Default commission rate + (provisional) commission rules. */
export const getCommissionSettingsService = async (): Promise<HttpResult<ApiResponse<CommissionSettings>>> => {
  const token = await getAccessToken();
  return httpClient.get<ApiResponse<CommissionSettings>>(
    `${BASE_URL}/settings/commissions`,
    { requiredAuthToken: true, token },
  );
};

import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { CommissionSettings } from "../types/settings_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/settings/commissions";

/** Admin: change the commission settings. */
export const updateCommissionSettingsService = async (payload: Partial<{ defaultCommissionRateBps: number; netAmountMode: string; bankCommissionPaidBy: string; intermediaryTreatment: string; rulesConfirmed: boolean }>): Promise<HttpResult<ApiResponse<CommissionSettings>>> => {
  const token = await getAccessToken();
  return httpClient.patch<ApiResponse<CommissionSettings>>(
    `${BASE_URL}/settings/commissions`,
    payload,
    { requiredAuthToken: true, token },
  );
};

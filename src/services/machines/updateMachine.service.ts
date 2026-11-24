import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { Machine } from "../types/machine_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/machines/${id}";

/** Edit a machine. */
export const updateMachineService = async (id: string, payload: { name?: string; type?: string; egyptAndAhlyCommissionRateBps?: number; otherBanksCommissionRateBps?: number; description?: string }): Promise<HttpResult<ApiResponse<Machine>>> => {
  const token = await getAccessToken();
  return httpClient.patch<ApiResponse<Machine>>(
    `${BASE_URL}/machines/${id}`,
    payload,
    { requiredAuthToken: true, token },
  );
};

import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { Machine } from "../types/machine_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/machines/${id}/status";

/** Activate / deactivate a machine. */
export const setMachineStatusService = async (id: string, status: "active" | "inactive"): Promise<HttpResult<ApiResponse<Machine>>> => {
  const token = await getAccessToken();
  return httpClient.patch<ApiResponse<Machine>>(
    `${BASE_URL}/machines/${id}/status`,
    { status },
    { requiredAuthToken: true, token },
  );
};

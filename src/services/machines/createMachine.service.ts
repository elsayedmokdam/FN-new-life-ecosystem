import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { Machine } from "../types/machine_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/machines";

/** Add a machine. */
export const createMachineService = async (payload: { name: string; type?: string; description?: string; status?: string }): Promise<HttpResult<ApiResponse<Machine>>> => {
  const token = await getAccessToken();
  return httpClient.post<ApiResponse<Machine>>(
    `${BASE_URL}/machines`,
    payload,
    { requiredAuthToken: true, token },
  );
};

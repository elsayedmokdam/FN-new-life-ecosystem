import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { Employee } from "../types/user_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/users/${id}/status";

/** Disable / re-enable an employee. */
export const setUserStatusService = async (id: string, status: "active" | "disabled"): Promise<HttpResult<ApiResponse<Employee>>> => {
  const token = await getAccessToken();
  return httpClient.patch<ApiResponse<Employee>>(
    `${BASE_URL}/users/${id}/status`,
    { status },
    { requiredAuthToken: true, token },
  );
};

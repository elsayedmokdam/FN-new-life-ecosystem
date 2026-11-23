import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/users/${id}/reset-password";

/** Reset an employee password. */
export const resetUserPasswordService = async (id: string, payload: { newPassword: string; confirmPassword: string }): Promise<HttpResult<ApiResponse>> => {
  const token = await getAccessToken();
  return httpClient.post<ApiResponse>(
    `${BASE_URL}/users/${id}/reset-password`,
    payload,
    { requiredAuthToken: true, token },
  );
};

import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { ChangePasswordPayload } from "../types/auth_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/change-password";

/** Change my password (other devices are signed out). */
export const changePasswordService = async (payload: ChangePasswordPayload): Promise<HttpResult<ApiResponse>> => {
  const token = await getAccessToken();
  return httpClient.patch<ApiResponse>(
    `${BASE_URL}/auth/change-password`,
    payload,
    { requiredAuthToken: true, token },
  );
};

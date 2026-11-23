import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/logout";

/** Invalidates the current session on the API. */
export const logoutService = async (): Promise<HttpResult<ApiResponse>> => {
  const token = await getAccessToken();
  return httpClient.post<ApiResponse>(
    `${BASE_URL}/auth/logout`,
    undefined,
    { requiredAuthToken: true, token },
  );
};

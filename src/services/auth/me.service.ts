import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { SessionUser } from "../types/auth_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/me";

/** Current user. `token` is only passed while the session cookie does not exist yet (sign-in). */
export const meService = async (token?: string): Promise<HttpResult<ApiResponse<SessionUser>>> => {
  const accessToken = token ?? (await getAccessToken());
  return httpClient.get<ApiResponse<SessionUser>>(
    `${BASE_URL}/auth/me`,
    { requiredAuthToken: true, token: accessToken },
  );
};

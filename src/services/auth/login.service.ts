import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { LoginPayload, OtpChallenge } from "../types/auth_interface";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/login";

/** Step 1: email + password. The API e-mails a one-time code; no session exists yet. */
export const loginService = async (payload: LoginPayload): Promise<HttpResult<ApiResponse<OtpChallenge>>> => {
  return httpClient.post<ApiResponse<OtpChallenge>>(
    `${BASE_URL}/auth/login`,
    payload,
  );
};

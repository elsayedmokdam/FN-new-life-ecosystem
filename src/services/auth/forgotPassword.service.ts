import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { ForgotPasswordPayload, PasswordResetChallenge } from "../types/auth_interface";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/forgot-password";

export const forgotPasswordService = async (
  payload: ForgotPasswordPayload,
): Promise<HttpResult<ApiResponse<PasswordResetChallenge>>> =>
  httpClient.post<ApiResponse<PasswordResetChallenge>>(
    `${BASE_URL}${ROUTE_URL}`,
    payload,
  );

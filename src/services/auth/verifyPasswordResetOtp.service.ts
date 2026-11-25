import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { PasswordResetVerification, VerifyPasswordResetOtpPayload } from "../types/auth_interface";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/verify-password-reset-otp";

export const verifyPasswordResetOtpService = async (
  payload: VerifyPasswordResetOtpPayload,
): Promise<HttpResult<ApiResponse<PasswordResetVerification>>> =>
  httpClient.post<ApiResponse<PasswordResetVerification>>(
    `${BASE_URL}${ROUTE_URL}`,
    payload,
  );

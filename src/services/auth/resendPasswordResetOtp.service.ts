import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/resend-password-reset-otp";

export const resendPasswordResetOtpService = async (
  payload: { challengeId: string },
): Promise<HttpResult<ApiResponse>> =>
  httpClient.post<ApiResponse>(`${BASE_URL}${ROUTE_URL}`, payload);

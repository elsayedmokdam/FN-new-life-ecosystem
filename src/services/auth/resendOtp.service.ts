import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { OtpChallenge } from "../types/auth_interface";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/resend-otp";

/** Sends a new OTP for the pending login (limited by the API). */
export const resendOtpService = async (payload: { challengeId: string }): Promise<HttpResult<ApiResponse<OtpChallenge>>> => {
  return httpClient.post<ApiResponse<OtpChallenge>>(
    `${BASE_URL}/auth/resend-otp`,
    payload,
  );
};

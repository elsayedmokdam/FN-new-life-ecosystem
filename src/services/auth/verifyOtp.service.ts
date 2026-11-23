import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { SessionPayload, VerifyOtpPayload } from "../types/auth_interface";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/verify-otp";

/** Step 2: exchanges the e-mailed OTP for the session token (valid 30 minutes). */
export const verifyOtpService = async (payload: VerifyOtpPayload): Promise<HttpResult<ApiResponse<SessionPayload>>> => {
  return httpClient.post<ApiResponse<SessionPayload>>(
    `${BASE_URL}/auth/verify-otp`,
    payload,
  );
};

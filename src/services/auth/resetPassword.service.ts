import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { ResetPasswordPayload } from "../types/auth_interface";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/reset-password";

export const resetPasswordService = async (
  payload: ResetPasswordPayload,
): Promise<HttpResult<ApiResponse>> =>
  httpClient.post<ApiResponse>(`${BASE_URL}${ROUTE_URL}`, payload);

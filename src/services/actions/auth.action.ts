"use server";

import $SERVICE_REPOSITORY from "../service.repo";
import { HttpResult } from "../utils/http";
import { ApiResponse } from "../types/api_interface";
import { ChangePasswordPayload, LoginPayload, OtpChallenge, SessionPayload, VerifyOtpPayload, SessionUser } from "../types/auth_interface";

export async function loginAction(payload: LoginPayload): Promise<HttpResult<ApiResponse<OtpChallenge>>> {
  return $SERVICE_REPOSITORY.Auth.login(payload);
}

export async function verifyOtpAction(payload: VerifyOtpPayload): Promise<HttpResult<ApiResponse<SessionPayload>>> {
  return $SERVICE_REPOSITORY.Auth.verifyOtp(payload);
}

export async function resendOtpAction(payload: { challengeId: string }): Promise<HttpResult<ApiResponse<OtpChallenge>>> {
  return $SERVICE_REPOSITORY.Auth.resendOtp(payload);
}

export async function logoutAction(): Promise<HttpResult<ApiResponse>> {
  return $SERVICE_REPOSITORY.Auth.logout();
}

export async function meAction(token?: string): Promise<HttpResult<ApiResponse<SessionUser>>> {
  return $SERVICE_REPOSITORY.Auth.me(token);
}

export async function changePasswordAction(payload: ChangePasswordPayload): Promise<HttpResult<ApiResponse>> {
  return $SERVICE_REPOSITORY.Auth.changePassword(payload);
}

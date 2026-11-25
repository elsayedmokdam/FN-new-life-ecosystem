"use server";

import $SERVICE_REPOSITORY from "../service.repo";
import { HttpResult } from "../utils/http";
import { ApiResponse } from "../types/api_interface";
import {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  OtpChallenge,
  PasswordResetChallenge,
  PasswordResetVerification,
  ResetPasswordPayload,
  SessionPayload,
  VerifyOtpPayload,
  VerifyPasswordResetOtpPayload,
  SessionUser,
} from "../types/auth_interface";

export async function loginAction(
  payload: LoginPayload,
): Promise<HttpResult<ApiResponse<OtpChallenge>>> {
  return $SERVICE_REPOSITORY.Auth.login(payload);
}

export async function verifyOtpAction(
  payload: VerifyOtpPayload,
): Promise<HttpResult<ApiResponse<SessionPayload>>> {
  return $SERVICE_REPOSITORY.Auth.verifyOtp(payload);
}

export async function resendOtpAction(payload: {
  challengeId: string;
}): Promise<HttpResult<ApiResponse<OtpChallenge>>> {
  return $SERVICE_REPOSITORY.Auth.resendOtp(payload);
}

export async function logoutAction(): Promise<HttpResult<ApiResponse>> {
  return $SERVICE_REPOSITORY.Auth.logout();
}

export async function meAction(
  token?: string,
): Promise<HttpResult<ApiResponse<SessionUser>>> {
  return $SERVICE_REPOSITORY.Auth.me(token);
}

export async function changePasswordAction(
  payload: ChangePasswordPayload,
): Promise<HttpResult<ApiResponse>> {
  return $SERVICE_REPOSITORY.Auth.changePassword(payload);
}

export async function forgotPasswordAction(
  payload: ForgotPasswordPayload,
): Promise<HttpResult<ApiResponse<PasswordResetChallenge>>> {
  return $SERVICE_REPOSITORY.Auth.forgotPassword(payload);
}

export async function verifyPasswordResetOtpAction(
  payload: VerifyPasswordResetOtpPayload,
): Promise<HttpResult<ApiResponse<PasswordResetVerification>>> {
  return $SERVICE_REPOSITORY.Auth.verifyPasswordResetOtp(payload);
}

export async function resendPasswordResetOtpAction(payload: {
  challengeId: string;
}): Promise<HttpResult<ApiResponse>> {
  return $SERVICE_REPOSITORY.Auth.resendPasswordResetOtp(payload);
}

export async function resetPasswordAction(
  payload: ResetPasswordPayload,
): Promise<HttpResult<ApiResponse>> {
  return $SERVICE_REPOSITORY.Auth.resetPassword(payload);
}

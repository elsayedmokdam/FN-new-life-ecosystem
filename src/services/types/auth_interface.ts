import { RoleType, UserStatus } from "./enums";

export interface LoginPayload {
  email: string;
  password: string;
}

/** Step 1 of the login: the API validated the password and e-mailed an OTP (no session yet). */
export interface OtpChallenge {
  challengeId: string;
  email: string;
  expiresInSeconds: number;
  resendAvailableInSeconds: number;
}

export interface VerifyOtpPayload {
  challengeId: string;
  otp: string;
}

export interface SessionUser {
  _id: string;
  name: string;
  email: string;
  role: RoleType;
  status: UserStatus;
}

export interface SessionPayload {
  access_token: string;
  expiresAt: string;
  user: SessionUser;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

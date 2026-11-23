import { RoleType, UserStatus } from "./enums";

export interface Employee {
  _id: string;
  name: string;
  email: string;
  role: RoleType;
  status: UserStatus;
  lastLoginAt?: string;
  createdAt: string;
}

export interface CreateEmployeePayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

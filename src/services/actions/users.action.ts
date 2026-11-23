"use server";

import $SERVICE_REPOSITORY from "../service.repo";
import { HttpResult } from "../utils/http";
import { invalidIdResult, isObjectId } from "../utils/helpers/validators";
import { ApiResponse, Paginated, ListParams } from "../types/api_interface";
import { CreateEmployeePayload, Employee } from "../types/user_interface";

export async function getUsersAction(params: ListParams & { status?: string } = {}): Promise<HttpResult<ApiResponse<Paginated<Employee>>>> {
  return $SERVICE_REPOSITORY.Users.getUsers(params);
}

export async function createUserAction(payload: CreateEmployeePayload): Promise<HttpResult<ApiResponse<Employee>>> {
  return $SERVICE_REPOSITORY.Users.createUser(payload);
}

export async function updateUserAction(id: string, payload: { name?: string; email?: string }): Promise<HttpResult<ApiResponse<Employee>>> {
  if (!isObjectId(id)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Users.updateUser(id, payload);
}

export async function setUserStatusAction(id: string, status: "active" | "disabled"): Promise<HttpResult<ApiResponse<Employee>>> {
  if (!isObjectId(id)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Users.setUserStatus(id, status);
}

export async function resetUserPasswordAction(id: string, payload: { newPassword: string; confirmPassword: string }): Promise<HttpResult<ApiResponse>> {
  if (!isObjectId(id)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Users.resetUserPassword(id, payload);
}

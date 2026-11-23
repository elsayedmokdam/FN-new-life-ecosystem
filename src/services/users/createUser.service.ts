import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { CreateEmployeePayload, Employee } from "../types/user_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/users";

/** Create an employee account (admin only). */
export const createUserService = async (payload: CreateEmployeePayload): Promise<HttpResult<ApiResponse<Employee>>> => {
  const token = await getAccessToken();
  return httpClient.post<ApiResponse<Employee>>(
    `${BASE_URL}/users`,
    payload,
    { requiredAuthToken: true, token },
  );
};

import { BASE_URL } from "../config";
import { ApiResponse, Paginated, ListParams } from "../types/api_interface";
import { Employee } from "../types/user_interface";
import { toQuery } from "../utils/helpers/query";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/users";

/** Employees (admin only). */
export const getUsersService = async (params: ListParams & { status?: string } = {}): Promise<HttpResult<ApiResponse<Paginated<Employee>>>> => {
  const token = await getAccessToken();
  return httpClient.get<ApiResponse<Paginated<Employee>>>(
    `${BASE_URL}/users${toQuery(params)}`,
    { requiredAuthToken: true, token },
  );
};

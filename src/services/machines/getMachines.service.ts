import { BASE_URL } from "../config";
import { ApiResponse, Paginated, ListParams } from "../types/api_interface";
import { Machine } from "../types/machine_interface";
import { toQuery } from "../utils/helpers/query";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/machines";

/** Machines / providers. */
export const getMachinesService = async (params: ListParams & { status?: string } = {}): Promise<HttpResult<ApiResponse<Paginated<Machine>>>> => {
  const token = await getAccessToken();
  return httpClient.get<ApiResponse<Paginated<Machine>>>(
    `${BASE_URL}/machines${toQuery(params)}`,
    { requiredAuthToken: true, token },
  );
};

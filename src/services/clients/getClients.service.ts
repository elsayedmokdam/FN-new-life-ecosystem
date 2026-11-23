import { BASE_URL } from "../config";
import { ApiResponse, Paginated, ListParams } from "../types/api_interface";
import { Client } from "../types/client_interface";
import { toQuery } from "../utils/helpers/query";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/clients";

/** Clients with their aggregated balance / debt. */
export const getClientsService = async (params: ListParams & { status?: string } = {}): Promise<HttpResult<ApiResponse<Paginated<Client>>>> => {
  const token = await getAccessToken();
  return httpClient.get<ApiResponse<Paginated<Client>>>(
    `${BASE_URL}/clients${toQuery(params)}`,
    { requiredAuthToken: true, token },
  );
};

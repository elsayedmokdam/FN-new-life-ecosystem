import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { ClientDetails } from "../types/client_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/clients/${id}";

/** One client with its cards and totals. */
export const getClientService = async (id: string): Promise<HttpResult<ApiResponse<ClientDetails>>> => {
  const token = await getAccessToken();
  return httpClient.get<ApiResponse<ClientDetails>>(
    `${BASE_URL}/clients/${id}`,
    { requiredAuthToken: true, token },
  );
};

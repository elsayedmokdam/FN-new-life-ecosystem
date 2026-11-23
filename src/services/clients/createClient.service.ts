import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { Client, NewClientPayload } from "../types/client_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/clients";

/** Create a client. */
export const createClientService = async (payload: NewClientPayload): Promise<HttpResult<ApiResponse<Client>>> => {
  const token = await getAccessToken();
  return httpClient.post<ApiResponse<Client>>(
    `${BASE_URL}/clients`,
    payload,
    { requiredAuthToken: true, token },
  );
};

import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { Client, UpdateClientPayload } from "../types/client_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/clients/${id}";

/** Edit a client. */
export const updateClientService = async (id: string, payload: UpdateClientPayload): Promise<HttpResult<ApiResponse<Client>>> => {
  const token = await getAccessToken();
  return httpClient.patch<ApiResponse<Client>>(
    `${BASE_URL}/clients/${id}`,
    payload,
    { requiredAuthToken: true, token },
  );
};

import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { AdjustClientDebtPayload, Client } from "../types/client_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/clients/${id}/debt";

/** Manually set a client's manual balance/debt adjustment. */
export const adjustClientDebtService = async (
  id: string,
  payload: AdjustClientDebtPayload,
): Promise<HttpResult<ApiResponse<Client>>> => {
  const token = await getAccessToken();
  return httpClient.patch<ApiResponse<Client>>(
    `${BASE_URL}/clients/${id}/debt`,
    payload,
    { requiredAuthToken: true, token },
  );
};

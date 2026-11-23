import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { TransactionDetails } from "../types/transaction_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/transactions/${id}/cancellation-request";

/** Ask the administrator to cancel a transaction. */
export const requestCancellationService = async (id: string, payload: { reason: string }): Promise<HttpResult<ApiResponse<TransactionDetails>>> => {
  const token = await getAccessToken();
  return httpClient.post<ApiResponse<TransactionDetails>>(
    `${BASE_URL}/transactions/${id}/cancellation-request`,
    payload,
    { requiredAuthToken: true, token },
  );
};

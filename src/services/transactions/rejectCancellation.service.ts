import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { TransactionDetails } from "../types/transaction_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/transactions/${id}/reject-cancellation";

/** Admin: reject a cancellation request. */
export const rejectCancellationService = async (id: string, payload: { note: string }): Promise<HttpResult<ApiResponse<TransactionDetails>>> => {
  const token = await getAccessToken();
  return httpClient.post<ApiResponse<TransactionDetails>>(
    `${BASE_URL}/transactions/${id}/reject-cancellation`,
    payload,
    { requiredAuthToken: true, token },
  );
};

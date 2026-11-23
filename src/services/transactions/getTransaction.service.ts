import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { TransactionDetails } from "../types/transaction_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/transactions/${id}";

/** Transaction details with cancellation info and audit history. */
export const getTransactionService = async (id: string): Promise<HttpResult<ApiResponse<TransactionDetails>>> => {
  const token = await getAccessToken();
  return httpClient.get<ApiResponse<TransactionDetails>>(
    `${BASE_URL}/transactions/${id}`,
    { requiredAuthToken: true, token },
  );
};

import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { TransactionDetails } from "../types/transaction_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/transactions/${id}";

/** Edit a transaction (reason is mandatory; history is kept). */
export const updateTransactionService = async (id: string, form: FormData): Promise<HttpResult<ApiResponse<TransactionDetails>>> => {
  const token = await getAccessToken();
  return httpClient.patchForm<ApiResponse<TransactionDetails>>(
    `${BASE_URL}/transactions/${id}`,
    form,
    { requiredAuthToken: true, token },
  );
};

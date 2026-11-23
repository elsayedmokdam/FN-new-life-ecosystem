import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { TransactionDetails } from "../types/transaction_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/transactions";

/** Record a withdrawal / deposit (multipart: optional `receipt` image). */
export const createTransactionService = async (form: FormData): Promise<HttpResult<ApiResponse<TransactionDetails>>> => {
  const token = await getAccessToken();
  return httpClient.postForm<ApiResponse<TransactionDetails>>(
    `${BASE_URL}/transactions`,
    form,
    { requiredAuthToken: true, token },
  );
};

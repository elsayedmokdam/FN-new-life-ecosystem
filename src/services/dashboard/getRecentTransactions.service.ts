import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { Transaction } from "../types/transaction_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/dashboard/recent-transactions";

/** Latest recorded transactions. */
export const getRecentTransactionsService = async (): Promise<HttpResult<ApiResponse<Transaction[]>>> => {
  const token = await getAccessToken();
  return httpClient.get<ApiResponse<Transaction[]>>(
    `${BASE_URL}/dashboard/recent-transactions`,
    { requiredAuthToken: true, token },
  );
};

import { BASE_URL } from "../config";
import { ApiResponse, Paginated, ListParams } from "../types/api_interface";
import { Transaction } from "../types/transaction_interface";
import { toQuery } from "../utils/helpers/query";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/transactions";

/** Transactions list. */
export const getTransactionsService = async (params: ListParams & { type?: string; status?: string; cardId?: string; clientId?: string; machineId?: string; createdBy?: string; period?: string; from?: string; to?: string } = {}): Promise<HttpResult<ApiResponse<Paginated<Transaction>>>> => {
  const token = await getAccessToken();
  return httpClient.get<ApiResponse<Paginated<Transaction>>>(
    `${BASE_URL}/transactions${toQuery(params)}`,
    { requiredAuthToken: true, token },
  );
};

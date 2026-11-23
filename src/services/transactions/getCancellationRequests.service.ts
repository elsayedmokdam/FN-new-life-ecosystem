import { BASE_URL } from "../config";
import { ApiResponse, Paginated, ListParams } from "../types/api_interface";
import { CancellationRequestItem } from "../types/transaction_interface";
import { toQuery } from "../utils/helpers/query";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/transactions/cancellation-requests";

/** Admin: cancellation requests. */
export const getCancellationRequestsService = async (params: ListParams & { status?: string } = {}): Promise<HttpResult<ApiResponse<Paginated<CancellationRequestItem>>>> => {
  const token = await getAccessToken();
  return httpClient.get<ApiResponse<Paginated<CancellationRequestItem>>>(
    `${BASE_URL}/transactions/cancellation-requests${toQuery(params)}`,
    { requiredAuthToken: true, token },
  );
};

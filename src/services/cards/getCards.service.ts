import { BASE_URL } from "../config";
import { ApiResponse, Paginated, ListParams } from "../types/api_interface";
import { Card } from "../types/card_interface";
import { toQuery } from "../utils/helpers/query";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/cards";

/** Cards list (search, filters, sorting, pagination). */
export const getCardsService = async (params: ListParams & { status?: string; clientId?: string; bankProvider?: string; cardType?: string } = {}): Promise<HttpResult<ApiResponse<Paginated<Card>>>> => {
  const token = await getAccessToken();
  return httpClient.get<ApiResponse<Paginated<Card>>>(
    `${BASE_URL}/cards${toQuery(params)}`,
    { requiredAuthToken: true, token },
  );
};

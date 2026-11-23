import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { CardFinancialSummary } from "../types/card_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/cards/${id}/financial-summary";

/** Authoritative financial summary of a card. */
export const getCardSummaryService = async (id: string): Promise<HttpResult<ApiResponse<CardFinancialSummary>>> => {
  const token = await getAccessToken();
  return httpClient.get<ApiResponse<CardFinancialSummary>>(
    `${BASE_URL}/cards/${id}/financial-summary`,
    { requiredAuthToken: true, token },
  );
};

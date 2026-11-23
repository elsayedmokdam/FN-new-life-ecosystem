import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { Card } from "../types/card_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/cards/${id}";

/** Card details. */
export const getCardService = async (id: string): Promise<HttpResult<ApiResponse<Card>>> => {
  const token = await getAccessToken();
  return httpClient.get<ApiResponse<Card>>(
    `${BASE_URL}/cards/${id}`,
    { requiredAuthToken: true, token },
  );
};

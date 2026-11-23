import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { Card, UpdateCardPayload } from "../types/card_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/cards/${id}";

/** Edit permitted card fields. */
export const updateCardService = async (id: string, payload: UpdateCardPayload): Promise<HttpResult<ApiResponse<Card>>> => {
  const token = await getAccessToken();
  return httpClient.patch<ApiResponse<Card>>(
    `${BASE_URL}/cards/${id}`,
    payload,
    { requiredAuthToken: true, token },
  );
};

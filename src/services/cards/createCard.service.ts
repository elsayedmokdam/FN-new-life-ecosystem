import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { Card, CreateCardPayload } from "../types/card_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/cards";

/** Create a card (with an existing or a new client). */
export const createCardService = async (payload: CreateCardPayload): Promise<HttpResult<ApiResponse<Card>>> => {
  const token = await getAccessToken();
  return httpClient.post<ApiResponse<Card>>(
    `${BASE_URL}/cards`,
    payload,
    { requiredAuthToken: true, token },
  );
};

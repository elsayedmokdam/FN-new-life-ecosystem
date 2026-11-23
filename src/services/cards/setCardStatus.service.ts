import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { Card } from "../types/card_interface";
import { CardStatus } from "../types/enums";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/cards/${id}/status";

/** Activate / deactivate / archive a card. */
export const setCardStatusService = async (id: string, status: CardStatus): Promise<HttpResult<ApiResponse<Card>>> => {
  const token = await getAccessToken();
  return httpClient.patch<ApiResponse<Card>>(
    `${BASE_URL}/cards/${id}/status`,
    { status },
    { requiredAuthToken: true, token },
  );
};

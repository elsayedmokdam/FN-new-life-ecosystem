"use server";

import $SERVICE_REPOSITORY from "../service.repo";
import { HttpResult } from "../utils/http";
import { invalidIdResult, isObjectId } from "../utils/helpers/validators";
import { ApiResponse, Paginated, ListParams } from "../types/api_interface";
import { Card, CreateCardPayload, UpdateCardPayload, CardFinancialSummary } from "../types/card_interface";
import { CardStatus } from "../types/enums";

export async function getCardsAction(params: ListParams & { status?: string; clientId?: string; bankProvider?: string; cardType?: string } = {}): Promise<HttpResult<ApiResponse<Paginated<Card>>>> {
  return $SERVICE_REPOSITORY.Cards.getCards(params);
}

export async function createCardAction(payload: CreateCardPayload): Promise<HttpResult<ApiResponse<Card>>> {
  return $SERVICE_REPOSITORY.Cards.createCard(payload);
}

export async function getCardAction(id: string): Promise<HttpResult<ApiResponse<Card>>> {
  if (!isObjectId(id)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Cards.getCard(id);
}

export async function updateCardAction(id: string, payload: UpdateCardPayload): Promise<HttpResult<ApiResponse<Card>>> {
  if (!isObjectId(id)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Cards.updateCard(id, payload);
}

export async function setCardStatusAction(id: string, status: CardStatus): Promise<HttpResult<ApiResponse<Card>>> {
  if (!isObjectId(id)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Cards.setCardStatus(id, status);
}

export async function getCardSummaryAction(id: string): Promise<HttpResult<ApiResponse<CardFinancialSummary>>> {
  if (!isObjectId(id)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Cards.getCardSummary(id);
}

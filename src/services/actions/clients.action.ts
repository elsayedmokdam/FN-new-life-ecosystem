"use server";

import $SERVICE_REPOSITORY from "../service.repo";
import { HttpResult } from "../utils/http";
import { invalidIdResult, isObjectId } from "../utils/helpers/validators";
import { ApiResponse, Paginated, ListParams } from "../types/api_interface";
import { AdjustClientDebtPayload, Client, NewClientPayload, ClientDetails, UpdateClientPayload } from "../types/client_interface";

export async function getClientsAction(params: ListParams & { status?: string } = {}): Promise<HttpResult<ApiResponse<Paginated<Client>>>> {
  return $SERVICE_REPOSITORY.Clients.getClients(params);
}

export async function getClientAction(id: string): Promise<HttpResult<ApiResponse<ClientDetails>>> {
  if (!isObjectId(id)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Clients.getClient(id);
}

export async function createClientAction(payload: NewClientPayload): Promise<HttpResult<ApiResponse<Client>>> {
  return $SERVICE_REPOSITORY.Clients.createClient(payload);
}

export async function updateClientAction(id: string, payload: UpdateClientPayload): Promise<HttpResult<ApiResponse<Client>>> {
  if (!isObjectId(id)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Clients.updateClient(id, payload);
}

export async function adjustClientDebtAction(id: string, payload: AdjustClientDebtPayload): Promise<HttpResult<ApiResponse<Client>>> {
  if (!isObjectId(id)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Clients.adjustClientDebt(id, payload);
}

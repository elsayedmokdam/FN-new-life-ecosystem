"use server";

import $SERVICE_REPOSITORY from "../service.repo";
import { HttpResult } from "../utils/http";
import { invalidIdResult, isObjectId } from "../utils/helpers/validators";
import { ApiResponse, Paginated, ListParams } from "../types/api_interface";
import { CancellationRequestItem, Transaction, TransactionDetails } from "../types/transaction_interface";

export async function getTransactionsAction(params: ListParams & { type?: string; status?: string; cardId?: string; clientId?: string; machineId?: string; createdBy?: string; period?: string; from?: string; to?: string } = {}): Promise<HttpResult<ApiResponse<Paginated<Transaction>>>> {
  return $SERVICE_REPOSITORY.Transactions.getTransactions(params);
}

export async function getCardTransactionsAction(id: string, params: ListParams & { type?: string; status?: string; cardId?: string; clientId?: string; machineId?: string; createdBy?: string; period?: string; from?: string; to?: string } = {}): Promise<HttpResult<ApiResponse<Paginated<Transaction>>>> {
  if (!isObjectId(id)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Transactions.getCardTransactions(id, params);
}

export async function createTransactionAction(form: FormData): Promise<HttpResult<ApiResponse<TransactionDetails>>> {
  return $SERVICE_REPOSITORY.Transactions.createTransaction(form);
}

export async function getTransactionAction(id: string): Promise<HttpResult<ApiResponse<TransactionDetails>>> {
  if (!isObjectId(id)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Transactions.getTransaction(id);
}

export async function updateTransactionAction(id: string, form: FormData): Promise<HttpResult<ApiResponse<TransactionDetails>>> {
  if (!isObjectId(id)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Transactions.updateTransaction(id, form);
}

export async function requestCancellationAction(id: string, payload: { reason: string }): Promise<HttpResult<ApiResponse<TransactionDetails>>> {
  if (!isObjectId(id)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Transactions.requestCancellation(id, payload);
}

export async function approveCancellationAction(id: string, payload: { note?: string }): Promise<HttpResult<ApiResponse<TransactionDetails>>> {
  if (!isObjectId(id)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Transactions.approveCancellation(id, payload);
}

export async function rejectCancellationAction(id: string, payload: { note: string }): Promise<HttpResult<ApiResponse<TransactionDetails>>> {
  if (!isObjectId(id)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Transactions.rejectCancellation(id, payload);
}

export async function getCancellationRequestsAction(params: ListParams & { status?: string } = {}): Promise<HttpResult<ApiResponse<Paginated<CancellationRequestItem>>>> {
  return $SERVICE_REPOSITORY.Transactions.getCancellationRequests(params);
}

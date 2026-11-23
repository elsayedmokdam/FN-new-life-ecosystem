"use server";

import $SERVICE_REPOSITORY from "../service.repo";
import { HttpResult } from "../utils/http";
import { ApiResponse } from "../types/api_interface";
import { DashboardCharts, DashboardSummary } from "../types/dashboard_interface";
import { Transaction } from "../types/transaction_interface";

export async function getDashboardSummaryAction(params: { period?: string; from?: string; to?: string } = {}): Promise<HttpResult<ApiResponse<DashboardSummary>>> {
  return $SERVICE_REPOSITORY.Dashboard.getDashboardSummary(params);
}

export async function getDashboardChartsAction(params: { period?: string; from?: string; to?: string } = {}): Promise<HttpResult<ApiResponse<DashboardCharts>>> {
  return $SERVICE_REPOSITORY.Dashboard.getDashboardCharts(params);
}

export async function getRecentTransactionsAction(): Promise<HttpResult<ApiResponse<Transaction[]>>> {
  return $SERVICE_REPOSITORY.Dashboard.getRecentTransactions();
}

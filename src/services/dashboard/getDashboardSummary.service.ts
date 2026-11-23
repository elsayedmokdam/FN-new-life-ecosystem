import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { DashboardSummary } from "../types/dashboard_interface";
import { toQuery } from "../utils/helpers/query";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/dashboard/summary";

/** Dashboard statistics for the selected period. */
export const getDashboardSummaryService = async (params: { period?: string; from?: string; to?: string } = {}): Promise<HttpResult<ApiResponse<DashboardSummary>>> => {
  const token = await getAccessToken();
  return httpClient.get<ApiResponse<DashboardSummary>>(
    `${BASE_URL}/dashboard/summary${toQuery(params)}`,
    { requiredAuthToken: true, token },
  );
};

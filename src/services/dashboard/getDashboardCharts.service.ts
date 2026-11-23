import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { DashboardCharts } from "../types/dashboard_interface";
import { toQuery } from "../utils/helpers/query";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/dashboard/charts";

/** Dashboard chart series. */
export const getDashboardChartsService = async (params: { period?: string; from?: string; to?: string } = {}): Promise<HttpResult<ApiResponse<DashboardCharts>>> => {
  const token = await getAccessToken();
  return httpClient.get<ApiResponse<DashboardCharts>>(
    `${BASE_URL}/dashboard/charts${toQuery(params)}`,
    { requiredAuthToken: true, token },
  );
};

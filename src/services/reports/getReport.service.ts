import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { ReportKind } from "../types/enums";
import { Report, ReportParams } from "../types/report_interface";
import { toQuery } from "../utils/helpers/query";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/reports";

const PATHS: Record<ReportKind, (id?: string) => string> = {
  daily: () => "/daily",
  monthly: () => "/monthly",
  custom: () => "/custom",
  withdrawals: () => "/withdrawals",
  deposits: () => "/deposits",
  commissions: () => "/commissions",
  debts: () => "/debts",
  balances: () => "/balances",
  card: (id) => `/cards/${id}`,
  client: (id) => `/clients/${id}`,
  employee: (id) => `/employees/${id}`,
  machine: (id) => `/machines/${id}`,
};

/** Any report as JSON (the same builder feeds the PDF / Excel exports). */
export const getReportService = async (
  kind: ReportKind,
  params: ReportParams = {},
): Promise<HttpResult<ApiResponse<Report>>> => {
  const token = await getAccessToken();
  const { id, ...query } = params;
  return httpClient.get<ApiResponse<Report>>(
    `${BASE_URL}${ROUTE_URL}${PATHS[kind](id)}${toQuery(query)}`,
    { requiredAuthToken: true, token },
  );
};

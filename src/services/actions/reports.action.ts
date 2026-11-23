"use server";

import $SERVICE_REPOSITORY from "../service.repo";
import { ApiResponse } from "../types/api_interface";
import { ReportKind } from "../types/enums";
import { Report, ReportParams } from "../types/report_interface";
import { HttpResult } from "../utils/http";
import { isObjectId, invalidIdResult } from "../utils/helpers/validators";

export async function getReportAction(kind: ReportKind, params: ReportParams = {}): Promise<HttpResult<ApiResponse<Report>>> {
  if (params.id && !isObjectId(params.id)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Reports.getReport(kind, params);
}

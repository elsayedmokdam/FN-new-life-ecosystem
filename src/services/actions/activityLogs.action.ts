"use server";

import $SERVICE_REPOSITORY from "../service.repo";
import { HttpResult } from "../utils/http";
import { ActivityLog } from "../types/notification_interface";
import { ApiResponse, Paginated, ListParams } from "../types/api_interface";

export async function getActivityLogsAction(params: ListParams & { action?: string; entityType?: string; entityId?: string; userId?: string; from?: string; to?: string } = {}): Promise<HttpResult<ApiResponse<Paginated<ActivityLog>>>> {
  return $SERVICE_REPOSITORY.ActivityLogs.getActivityLogs(params);
}

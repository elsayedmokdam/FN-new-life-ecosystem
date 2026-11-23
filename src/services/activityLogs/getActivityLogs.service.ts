import { BASE_URL } from "../config";
import { ApiResponse, Paginated, ListParams } from "../types/api_interface";
import { ActivityLog } from "../types/notification_interface";
import { toQuery } from "../utils/helpers/query";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/activity-logs";

/** Admin: audit trail (read only). */
export const getActivityLogsService = async (params: ListParams & { action?: string; entityType?: string; entityId?: string; userId?: string; from?: string; to?: string } = {}): Promise<HttpResult<ApiResponse<Paginated<ActivityLog>>>> => {
  const token = await getAccessToken();
  return httpClient.get<ApiResponse<Paginated<ActivityLog>>>(
    `${BASE_URL}/activity-logs${toQuery(params)}`,
    { requiredAuthToken: true, token },
  );
};

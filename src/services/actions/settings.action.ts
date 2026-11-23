"use server";

import $SERVICE_REPOSITORY from "../service.repo";
import { HttpResult } from "../utils/http";
import { ApiResponse } from "../types/api_interface";
import { CommissionSettings, SystemSettings } from "../types/settings_interface";

export async function getCommissionSettingsAction(): Promise<HttpResult<ApiResponse<CommissionSettings>>> {
  return $SERVICE_REPOSITORY.Settings.getCommissionSettings();
}

export async function updateCommissionSettingsAction(payload: Partial<{ defaultCommissionRateBps: number; netAmountMode: string; bankCommissionPaidBy: string; intermediaryTreatment: string; rulesConfirmed: boolean }>): Promise<HttpResult<ApiResponse<CommissionSettings>>> {
  return $SERVICE_REPOSITORY.Settings.updateCommissionSettings(payload);
}

export async function getSystemSettingsAction(): Promise<HttpResult<ApiResponse<SystemSettings>>> {
  return $SERVICE_REPOSITORY.Settings.getSystemSettings();
}

export async function updateSystemSettingsAction(payload: { cardRequiredFields: string[] }): Promise<HttpResult<ApiResponse<{ cardRequiredFields: string[] }>>> {
  return $SERVICE_REPOSITORY.Settings.updateSystemSettings(payload);
}

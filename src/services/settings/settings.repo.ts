import { getCommissionSettingsService } from "./getCommissionSettings.service";
import { updateCommissionSettingsService } from "./updateCommissionSettings.service";
import { getSystemSettingsService } from "./getSystemSettings.service";
import { updateSystemSettingsService } from "./updateSystemSettings.service";

export const SettingsRepo = {
  getCommissionSettings: getCommissionSettingsService,
  updateCommissionSettings: updateCommissionSettingsService,
  getSystemSettings: getSystemSettingsService,
  updateSystemSettings: updateSystemSettingsService,
};

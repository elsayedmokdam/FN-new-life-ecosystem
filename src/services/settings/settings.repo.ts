import { getSystemSettingsService } from "./getSystemSettings.service";
import { updateSystemSettingsService } from "./updateSystemSettings.service";

export const SettingsRepo = {
  getSystemSettings: getSystemSettingsService,
  updateSystemSettings: updateSystemSettingsService,
};

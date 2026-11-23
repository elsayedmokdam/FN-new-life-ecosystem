import { getClientsService } from "./getClients.service";
import { getClientService } from "./getClient.service";
import { createClientService } from "./createClient.service";
import { updateClientService } from "./updateClient.service";
import { adjustClientDebtService } from "./adjustClientDebt.service";

export const ClientsRepo = {
  getClients: getClientsService,
  getClient: getClientService,
  createClient: createClientService,
  updateClient: updateClientService,
  adjustClientDebt: adjustClientDebtService,
};

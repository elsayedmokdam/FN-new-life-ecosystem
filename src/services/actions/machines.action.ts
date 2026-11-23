"use server";

import $SERVICE_REPOSITORY from "../service.repo";
import { HttpResult } from "../utils/http";
import { invalidIdResult, isObjectId } from "../utils/helpers/validators";
import { ApiResponse, Paginated, ListParams } from "../types/api_interface";
import { Machine } from "../types/machine_interface";

export async function getMachinesAction(params: ListParams & { status?: string } = {}): Promise<HttpResult<ApiResponse<Paginated<Machine>>>> {
  return $SERVICE_REPOSITORY.Machines.getMachines(params);
}

export async function createMachineAction(payload: { name: string; type?: string; description?: string; status?: string }): Promise<HttpResult<ApiResponse<Machine>>> {
  return $SERVICE_REPOSITORY.Machines.createMachine(payload);
}

export async function updateMachineAction(id: string, payload: { name?: string; type?: string; description?: string }): Promise<HttpResult<ApiResponse<Machine>>> {
  if (!isObjectId(id)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Machines.updateMachine(id, payload);
}

export async function setMachineStatusAction(id: string, status: "active" | "inactive"): Promise<HttpResult<ApiResponse<Machine>>> {
  if (!isObjectId(id)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Machines.setMachineStatus(id, status);
}

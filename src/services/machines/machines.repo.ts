import { getMachinesService } from "./getMachines.service";
import { createMachineService } from "./createMachine.service";
import { updateMachineService } from "./updateMachine.service";
import { setMachineStatusService } from "./setMachineStatus.service";

export const MachinesRepo = {
  getMachines: getMachinesService,
  createMachine: createMachineService,
  updateMachine: updateMachineService,
  setMachineStatus: setMachineStatusService,
};

import { getUsersService } from "./getUsers.service";
import { createUserService } from "./createUser.service";
import { updateUserService } from "./updateUser.service";
import { setUserStatusService } from "./setUserStatus.service";
import { resetUserPasswordService } from "./resetUserPassword.service";

export const UsersRepo = {
  getUsers: getUsersService,
  createUser: createUserService,
  updateUser: updateUserService,
  setUserStatus: setUserStatusService,
  resetUserPassword: resetUserPasswordService,
};

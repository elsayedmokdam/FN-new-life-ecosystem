import { loginService } from "./login.service";
import { verifyOtpService } from "./verifyOtp.service";
import { resendOtpService } from "./resendOtp.service";
import { logoutService } from "./logout.service";
import { meService } from "./me.service";
import { changePasswordService } from "./changePassword.service";

export const AuthRepo = {
  login: loginService,
  verifyOtp: verifyOtpService,
  resendOtp: resendOtpService,
  logout: logoutService,
  me: meService,
  changePassword: changePasswordService,
};

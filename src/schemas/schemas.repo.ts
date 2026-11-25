import { changePasswordSchema, createEmployeeSchema, forgotPasswordSchema, otpSchema, passwordResetOtpSchema, passwordResetSchema, resetPasswordSchema, signinSchema } from "./auth.schemas";
import { cardSchema } from "./card.schemas";
import { editTransactionSchema, transactionSchema } from "./transaction.schemas";
import { machineSchema } from "./misc.schemas";

/** Every form schema is a factory: it needs the translation function (and sometimes server settings). */
export const $SCHEMAS_REPOSITORY = {
  SIGNIN_FORM: signinSchema,
  OTP_FORM: otpSchema,
  CHANGE_PASSWORD_FORM: changePasswordSchema,
  CREATE_EMPLOYEE_FORM: createEmployeeSchema,
  RESET_PASSWORD_FORM: resetPasswordSchema,
  FORGOT_PASSWORD_FORM: forgotPasswordSchema,
  PASSWORD_RESET_OTP_FORM: passwordResetOtpSchema,
  PASSWORD_RESET_FORM: passwordResetSchema,
  CARD_FORM: cardSchema,
  TRANSACTION_FORM: transactionSchema,
  EDIT_TRANSACTION_FORM: editTransactionSchema,
  MACHINE_FORM: machineSchema,
} as const;

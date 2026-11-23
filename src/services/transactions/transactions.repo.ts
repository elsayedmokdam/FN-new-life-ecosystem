import { getTransactionsService } from "./getTransactions.service";
import { getCardTransactionsService } from "./getCardTransactions.service";
import { createTransactionService } from "./createTransaction.service";
import { getTransactionService } from "./getTransaction.service";
import { updateTransactionService } from "./updateTransaction.service";
import { requestCancellationService } from "./requestCancellation.service";
import { approveCancellationService } from "./approveCancellation.service";
import { rejectCancellationService } from "./rejectCancellation.service";
import { getCancellationRequestsService } from "./getCancellationRequests.service";

export const TransactionsRepo = {
  getTransactions: getTransactionsService,
  getCardTransactions: getCardTransactionsService,
  createTransaction: createTransactionService,
  getTransaction: getTransactionService,
  updateTransaction: updateTransactionService,
  requestCancellation: requestCancellationService,
  approveCancellation: approveCancellationService,
  rejectCancellation: rejectCancellationService,
  getCancellationRequests: getCancellationRequestsService,
};

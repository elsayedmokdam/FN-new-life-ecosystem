import { getDashboardSummaryService } from "./getDashboardSummary.service";
import { getDashboardChartsService } from "./getDashboardCharts.service";
import { getRecentTransactionsService } from "./getRecentTransactions.service";

export const DashboardRepo = {
  getDashboardSummary: getDashboardSummaryService,
  getDashboardCharts: getDashboardChartsService,
  getRecentTransactions: getRecentTransactionsService,
};

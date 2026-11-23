export interface FinancialTotals {
  totalWithdrawals: number;
  totalDeposits: number;
  netTransactions: number;
  totalCustomerCommission: number;
  totalBankCommission: number;
  totalIntermediaryCommission: number;
  netCommissionRevenue: number;
  transactionCount: number;
  withdrawalCount: number;
  depositCount: number;
  totalCardBalances: number;
  totalClientDebt: number;
  totalClientCredit: number;
}

export interface DashboardSummary {
  period: { period: string; from: string; to: string; timezone: string };
  financial: FinancialTotals & {
    netCommissionRevenueProvisional: boolean;
    actualBusinessProfit: number | null;
    rulesConfirmed: boolean;
  };
  operational: {
    totalCards: number;
    activeCards: number;
    inactiveCards: number;
    archivedCards: number;
    totalClients: number;
    activeEmployees: number;
    totalWithdrawalTransactions: number;
    totalDepositTransactions: number;
    pendingCancellationRequests: number;
  };
}

export interface DashboardCharts {
  period: { period: string; from: string; to: string };
  withdrawalsVsDeposits: { date: string; withdrawals: number; deposits: number }[];
  dailyVolume: { date: string; count: number }[];
  monthlyVolume: { month: string; withdrawals: number; deposits: number; count: number }[];
  commissions: { date: string; customerCommission: number; bankCommission: number; intermediaryCommission: number }[];
  cardBalanceDistribution: { id: string; name: string; value: number }[];
  clientDebtDistribution: { id: string; name: string; value: number }[];
}

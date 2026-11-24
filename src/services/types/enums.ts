export const Role = { EMPLOYEE: "employee", ADMIN: "admin" } as const;
export type RoleType = (typeof Role)[keyof typeof Role];

export type CardStatus = "active" | "inactive" | "archived";
export type EntityStatus = "active" | "inactive";
export type UserStatus = "active" | "disabled";
export type TransactionType = "withdrawal" | "deposit";
export type TransactionStatus = "completed" | "cancellation_pending" | "reversed";
export type ReversalStatus = "pending" | "approved" | "rejected";
export type Period = "today" | "yesterday" | "this_week" | "this_month" | "last_month" | "custom";
export type ReportKind =
  | "daily" | "monthly" | "custom" | "card" | "client" | "employee" | "machine"
  | "withdrawals" | "deposits" | "commissions" | "debts" | "balances";

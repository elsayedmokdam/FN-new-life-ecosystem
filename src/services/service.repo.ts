import { AuthRepo } from "./auth/auth.repo";
import { UsersRepo } from "./users/users.repo";
import { ClientsRepo } from "./clients/clients.repo";
import { CardsRepo } from "./cards/cards.repo";
import { MachinesRepo } from "./machines/machines.repo";
import { TransactionsRepo } from "./transactions/transactions.repo";
import { SettingsRepo } from "./settings/settings.repo";
import { DashboardRepo } from "./dashboard/dashboard.repo";
import { NotificationsRepo } from "./notifications/notifications.repo";
import { ActivityLogsRepo } from "./activityLogs/activityLogs.repo";
import { ReportsRepo } from "./reports/reports.repo";

export const $SERVICE_REPOSITORY = {
  Auth: AuthRepo,
  Users: UsersRepo,
  Clients: ClientsRepo,
  Cards: CardsRepo,
  Machines: MachinesRepo,
  Transactions: TransactionsRepo,
  Settings: SettingsRepo,
  Dashboard: DashboardRepo,
  Notifications: NotificationsRepo,
  ActivityLogs: ActivityLogsRepo,
  Reports: ReportsRepo,
};

export default $SERVICE_REPOSITORY;

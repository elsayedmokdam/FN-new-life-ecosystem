export interface AppNotification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  entityType?: string;
  entityId?: string;
  createdAt: string;
}

export interface ActivityLog {
  _id: string;
  action: string;
  entityType?: string;
  entityId?: string;
  oldValues?: unknown;
  newValues?: unknown;
  reason?: string;
  ipAddress?: string;
  user?: { _id: string; name: string; email: string };
  createdAt: string;
}

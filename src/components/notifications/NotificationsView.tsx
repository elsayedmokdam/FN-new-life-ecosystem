"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FiBell, FiCheckCircle } from "react-icons/fi";
import AppButton from "../shared/app-button/AppButton";
import IsEmpty from "../shared/is-empty/IsEmpty";
import TablePagination from "../shared/table-pagination/TablePagination";
import {
  getNotificationsAction,
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/services/actions/notifications.action";
import { AppNotification } from "@/services/types/notification_interface";
import { PaginationMeta } from "@/services/types/api_interface";
import { useAppDispatch } from "@/redux/store/hooks";
import { setUnread } from "@/redux/store/slices/uiSlice";
import { notify } from "@/services/utils/helpers/alerts";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/LocaleProvider";

function target(n: AppNotification): string | null {
  if (!n.entityId) return null;
  if (n.entityType === "transaction") return `/transactions/${n.entityId}`;
  if (n.entityType === "card") return `/cards/${n.entityId}`;
  if (n.entityType === "user") return "/employees";
  return null;
}

export default function NotificationsView({
  initial,
}: {
  initial: {
    data: AppNotification[];
    meta: PaginationMeta & { unreadCount: number };
  };
}) {
  const { t, locale } = useT();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [items, setItems] = useState(initial.data);
  const [meta, setMeta] = useState(initial.meta);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [pending, startTransition] = useTransition();

  const load = (page: number, unread = unreadOnly) =>
    startTransition(async () => {
      const res = await getNotificationsAction({
        page: String(page),
        limit: "15",
        ...(unread ? { unread: "true" } : {}),
      });
      if (!res.ok) return notify.apiError(res.error);
      setItems(res.data.data.data);
      setMeta(res.data.data.meta);
      dispatch(setUnread(res.data.data.meta.unreadCount));
    });

  const open = async (n: AppNotification) => {
    if (!n.isRead) {
      await markNotificationReadAction(n._id);
      setItems((p) =>
        p.map((x) => (x._id === n._id ? { ...x, isRead: true } : x)),
      );
      dispatch(setUnread(Math.max(0, meta.unreadCount - 1)));
      setMeta((m) => ({ ...m, unreadCount: Math.max(0, m.unreadCount - 1) }));
    }
    const to = target(n);
    if (to) router.push(to);
  };

  const readAll = async () => {
    const res = await markAllNotificationsReadAction();
    if (!res.ok) return notify.apiError(res.error);
    setItems((p) => p.map((x) => ({ ...x, isRead: true })));
    setMeta((m) => ({ ...m, unreadCount: 0 }));
    dispatch(setUnread(0));
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => {
              setUnreadOnly(e.target.checked);
              load(1, e.target.checked);
            }}
            className="accent-main-color"
          />{" "}
          {t("notif.unreadOnly")} ({meta.unreadCount})
        </label>
        <AppButton
          variant="outline"
          disabled={meta.unreadCount === 0}
          onClick={readAll}
        >
          <FiCheckCircle /> {t("notif.readAll")}
        </AppButton>
      </div>
      {items.length === 0 ? (
        <IsEmpty
          icon={<FiBell />}
          title={t("notif.empty")}
          description={t("notif.emptyText")}
        />
      ) : (
        <ul className={cn("space-y-2", pending && "opacity-60")}>
          {items.map((n) => (
            <li key={n._id}>
              <button
                type="button"
                onClick={() => open(n)}
                className={cn(
                  "flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-4 text-start transition hover:border-main-color",
                  n.isRead
                    ? "border-border bg-card"
                    : "border-main-color/40 bg-accent",
                )}
              >
                <span
                  className={cn(
                    "mt-1.5 size-2.5 shrink-0 rounded-full",
                    n.isRead ? "bg-transparent" : "bg-main-color",
                  )}
                />
                <span className="flex-1">
                  <span className="block text-sm font-bold">{n.title}</span>
                  <span className="block text-sm text-muted-foreground">
                    {n.message}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {formatDateTime(n.createdAt, locale)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <TablePagination meta={meta} disabled={pending} onPage={(p) => load(p)} />
    </div>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Toaster } from "react-hot-toast";
import AppShell, { Viewer } from "@/components/app-shell/AppShell";
import ThemeProvider from "@/components/theme/ThemeProvider";
import Providers from "./_providers/Providers";
import { getMyToken } from "@/services/utils/helpers/getMyToken";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { dictionaryFor, getLocale } from "@/i18n/server";

export const metadata: Metadata = {
  title: { default: "Cards Finance", template: "%s | Cards Finance" },
  description: "Cards & financial transactions management",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  let viewer: Viewer | null = null;
  let unread = 0;
  let sessionExpired = false;

  const token = await getMyToken();
  if (token) {
    // the shell renders from the session cookie (no API call needed); one light call tells us the unread count
    viewer = {
      id: token.userId ?? "",
      name: (token.name as string) ?? "",
      email: (token.email as string) ?? "",
      role: token.role ?? "employee",
    };
    const res = await $SERVICE_REPOSITORY.Notifications.getNotifications({ page: "1", limit: "1" });
    if (res.ok) unread = res.data.data.meta.unreadCount ?? 0;
    else if (res.error.status === 401 || res.error.status === 403) sessionExpired = true;
  }

  const preloadedState = {
    user: { profile: viewer ? { _id: viewer.id, name: viewer.name, email: viewer.email, role: viewer.role as "admin" | "employee", status: "active" as const } : null },
    ui: { privacy: false, unreadNotifications: unread },
  };

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Providers preloadedState={preloadedState} sessionExpired={sessionExpired} locale={locale} dict={dictionaryFor(locale)}>
            <AppShell viewer={viewer}>{children}</AppShell>
            <Toaster
              position="top-center"
              toastOptions={{ style: { background: "var(--popover)", color: "var(--popover-foreground)", border: "1px solid var(--border)" } }}
            />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

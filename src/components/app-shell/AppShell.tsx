"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import {
  FiActivity, FiBarChart2, FiBell, FiCpu, FiCreditCard, FiEye, FiEyeOff, FiGlobe, FiHome, FiLogOut,
  FiMenu, FiRepeat, FiSettings, FiUser, FiUserCheck, FiUsers, FiX,
} from "react-icons/fi";
import ThemeToggle from "../theme/ThemeToggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { setPrivacy } from "@/redux/store/slices/uiSlice";
import { useT } from "@/i18n/LocaleProvider";
import { setLocaleAction } from "@/services/actions/locale.action";
import { logoutAction } from "@/services/actions/auth.action";
import { cn } from "@/lib/utils";

export interface Viewer {
  id: string;
  name: string;
  email: string;
  role: string;
}

function Logo() {
  const { t } = useT();
  return (
    <Link href="/" className="flex items-center gap-3" aria-label={t("app.name")}>
      <span className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-main-color to-sky-500 text-white shadow-md">
        <FiCreditCard className="size-5" />
      </span>
      <span className="text-lg font-bold text-foreground">{t("app.name")}</span>
    </Link>
  );
}

export default function AppShell({ viewer, children }: { viewer: Viewer | null; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const privacy = useAppSelector((s) => s.ui.privacy);
  const unread = useAppSelector((s) => s.ui.unreadNotifications);
  const { t, locale } = useT();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  // signed out (sign-in page): no shell
  if (!viewer) return <>{children}</>;

  const isAdmin = viewer.role === "admin";
  const items = [
    { href: "/", label: t("nav.dashboard"), icon: FiHome, exact: true },
    { href: "/cards", label: t("nav.cards"), icon: FiCreditCard },
    { href: "/transactions", label: t("nav.transactions"), icon: FiRepeat },
    { href: "/clients", label: t("nav.clients"), icon: FiUsers },
    { href: "/reports", label: t("nav.reports"), icon: FiBarChart2 },
    { href: "/machines", label: t("nav.machines"), icon: FiCpu },
    { href: "/notifications", label: t("nav.notifications"), icon: FiBell, badge: unread },
    ...(isAdmin
      ? [
          { href: "/employees", label: t("nav.employees"), icon: FiUserCheck },
          { href: "/activity-logs", label: t("nav.activityLogs"), icon: FiActivity },
          { href: "/settings", label: t("nav.settings"), icon: FiSettings },
        ]
      : []),
  ] as { href: string; label: string; icon: typeof FiHome; exact?: boolean; badge?: number }[];

  const active = (href: string, exact?: boolean) => (exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  const logout = async () => {
    await logoutAction().catch(() => {});
    await signOut({ redirect: false });
    router.push("/signin");
    router.refresh();
  };

  const switchLocale = () =>
    startTransition(async () => {
      await setLocaleAction(locale === "ar" ? "en" : "ar");
      router.refresh();
    });

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto py-2">
      {items.map(({ href, label, icon: Icon, exact, badge }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          aria-current={active(href, exact) ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
            active(href, exact) ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <Icon className="size-5 shrink-0" />
          <span className="flex-1">{label}</span>
          {!!badge && badge > 0 && <span className="rounded-full bg-red-500 px-2 text-[11px] font-bold leading-5 text-white">{badge > 99 ? "99+" : badge}</span>}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col gap-2 border-e border-sidebar-border bg-sidebar p-4 lg:flex">
        <Logo />
        <div className="mt-4 flex min-h-0 flex-1 flex-col">{nav}</div>
        {/* <p className="px-2 text-xs text-muted-foreground">{viewer.name}</p> */}
      </aside>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 start-0 flex w-72 flex-col gap-2 bg-sidebar p-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <Logo />
              <button type="button" onClick={() => setOpen(false)} aria-label="close" className="flex size-9 items-center justify-center rounded-lg hover:bg-muted"><FiX /></button>
            </div>
            <div className="mt-4 flex min-h-0 flex-1 flex-col">{nav}</div>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="no-print flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-3 lg:px-6">
          <button type="button" onClick={() => setOpen(true)} aria-label={t("nav.menu")} className="flex size-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted lg:hidden"><FiMenu className="size-5" /></button>
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => dispatch(setPrivacy(!privacy))}
              aria-pressed={privacy}
              aria-label={privacy ? t("privacy.show") : t("privacy.hide")}
              title={privacy ? t("privacy.show") : t("privacy.hide")}
              className={cn("flex size-10 cursor-pointer items-center justify-center rounded-xl transition hover:bg-muted", privacy ? "bg-accent text-accent-foreground" : "text-muted-foreground")}
            >
              {privacy ? <FiEyeOff className="size-5" /> : <FiEye className="size-5" />}
            </button>
            <button type="button" onClick={switchLocale} aria-label={t("nav.language")} title={t("nav.language")} className="flex h-10 cursor-pointer items-center gap-1 rounded-xl px-3 text-sm font-semibold text-muted-foreground hover:bg-muted">
              <FiGlobe className="size-4" /> {locale === "ar" ? "EN" : "عربي"}
            </button>
            <ThemeToggle />
            <Link href="/notifications" aria-label={t("nav.notifications")} className="relative flex size-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted">
              <FiBell className="size-5" />
              {unread > 0 && <span className="absolute end-1 top-1 size-2.5 rounded-full bg-red-500 ring-2 ring-card" />}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" aria-label={t("nav.account")} className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                  {viewer.name.slice(0, 1).toUpperCase()}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-1">
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-semibold">{viewer.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{viewer.email}</p>
                </div>
                <DropdownMenuItem onSelect={() => router.push("/profile")} className="flex cursor-pointer items-center gap-2"><FiUser /> {t("nav.profile")}</DropdownMenuItem>
                <DropdownMenuItem onSelect={logout} className="flex cursor-pointer items-center gap-2 text-destructive"><FiLogOut /> {t("nav.logout")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

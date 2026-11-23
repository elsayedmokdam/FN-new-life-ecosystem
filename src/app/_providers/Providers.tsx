"use client";

import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { AppStore, makeStore, RootState } from "@/redux/store/store";
import { setProfile } from "@/redux/store/slices/userSlice";
import { setPrivacy, setUnread } from "@/redux/store/slices/uiSlice";
import SessionGuard from "@/components/session-guard/SessionGuard";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import type { Dict } from "@/i18n/dictionaries";
import type { Locale } from "@/lib/format";

interface ProvidersProps {
  children: React.ReactNode;
  preloadedState: Pick<RootState, "user" | "ui">;
  sessionExpired: boolean;
  locale: Locale;
  dict: Dict;
}

export default function Providers({ children, preloadedState, sessionExpired, locale, dict }: ProvidersProps) {
  const [store] = useState<AppStore>(() => makeStore(preloadedState));
  const profile = preloadedState.user.profile;
  const unread = preloadedState.ui.unreadNotifications;

  // keep the store in sync when the server layout re-renders (router.refresh / sign in / sign out)
  useEffect(() => {
    store.dispatch(setProfile(profile));
    store.dispatch(setUnread(unread));
  }, [store, profile, unread]);

  // Privacy mode survives reloads (visual preference only)
  useEffect(() => {
    try {
      store.dispatch(setPrivacy(localStorage.getItem("privacy") === "1"));
    } catch {
      /* ignore */
    }
    return store.subscribe(() => {
      try {
        localStorage.setItem("privacy", store.getState().ui.privacy ? "1" : "0");
      } catch {
        /* ignore */
      }
    });
  }, [store]);

  return (
    <LocaleProvider locale={locale} dict={dict}>
      {/* poll every minute so an expired session is noticed quickly */}
      <SessionProvider refetchInterval={60} refetchOnWindowFocus>
        <Provider store={store}>
          <SessionGuard sessionExpired={sessionExpired} />
          {children}
        </Provider>
      </SessionProvider>
    </LocaleProvider>
  );
}

"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { notify } from "@/services/utils/helpers/alerts";
import { useT } from "@/i18n/LocaleProvider";

/**
 * The API session is absolute (30 minutes). When it ends (or the API rejects the token),
 * the user is signed out and sent to the sign-in page.
 */
export default function SessionGuard({ sessionExpired = false }: { sessionExpired?: boolean }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useT();
  const [timedOut, setTimedOut] = useState(false);
  const isExpired = sessionExpired || !!session?.error || timedOut;

  useEffect(() => {
    if (!isExpired) return;
    notify.error(t("auth.sessionExpired"));
    signOut({ redirect: false }).then(() => {
      router.push("/signin");
      router.refresh();
    });
  }, [isExpired, router, t]);

  // re-check right when the session is due to end (without waiting for the next poll)
  useEffect(() => {
    if (!session?.sessionExpires) return;
    const ms = session.sessionExpires - Date.now();
    const id = setTimeout(() => setTimedOut(true), Math.min(Math.max(ms, 0) + 500, 2 ** 31 - 1));
    return () => clearTimeout(id);
  }, [session?.sessionExpires]);

  return null;
}

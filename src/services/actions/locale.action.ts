"use server";

import { cookies } from "next/headers";

export async function setLocaleAction(locale: "ar" | "en"): Promise<void> {
  (await cookies()).set("locale", locale === "en" ? "en" : "ar", { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
}

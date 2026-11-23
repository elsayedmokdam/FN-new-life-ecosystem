import { cookies } from "next/headers";

/** The API only accepts "0" (English) or "1" (Arabic) as Accept-Language. */
export async function apiLanguage(): Promise<"0" | "1"> {
  return (await cookies()).get("locale")?.value === "en" ? "0" : "1";
}

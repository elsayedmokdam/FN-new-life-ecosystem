import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/services/config";
import { apiLanguage } from "@/services/utils/helpers/apiLanguage";
import { getAccessToken } from "@/services/utils/helpers/getMyToken";

const KEYS = ["report", "id", "period", "from", "to", "date", "month", "type", "cardId", "clientId", "machineId", "userId", "lang"];

/** Proxies PDF / Excel exports: adds the API token (kept server-side) and forwards the file. */
export async function GET(req: NextRequest) {
  const token = await getAccessToken();
  if (!token) return new NextResponse("Unauthorized", { status: 401 });

  const sp = req.nextUrl.searchParams;
  const format = sp.get("format") === "excel" ? "excel" : "pdf";
  const qs = new URLSearchParams();
  for (const k of KEYS) {
    const v = sp.get(k);
    if (v) qs.set(k, v);
  }

  const res = await fetch(`${BASE_URL}/reports/export/${format}?${qs}`, { headers: { Authorization: `Bearer ${token}`, "Accept-Language": await apiLanguage() }, cache: "no-store" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: "Export failed" }));
    return NextResponse.json({ message: body.message ?? "Export failed", issues: body.issues }, { status: res.status });
  }
  return new NextResponse(res.body, {
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/octet-stream",
      "Content-Disposition": res.headers.get("content-disposition") ?? `attachment; filename="report.${format === "excel" ? "xlsx" : "pdf"}"`,
      "Cache-Control": "no-store",
    },
  });
}

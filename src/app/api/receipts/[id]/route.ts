import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/services/config";
import { apiLanguage } from "@/services/utils/helpers/apiLanguage";
import { getAccessToken } from "@/services/utils/helpers/getMyToken";
import { isObjectId } from "@/services/utils/helpers/validators";

/** Streams a receipt image from the API; the API token never reaches the browser. */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = await getAccessToken();
  if (!token) return new NextResponse("Unauthorized", { status: 401 });
  if (!isObjectId(id)) return new NextResponse("Not found", { status: 404 });

  const res = await fetch(`${BASE_URL}/transactions/${id}/receipt`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Accept-Language": await apiLanguage(),
    },
    cache: "no-store",
  });
  if (!res.ok)
    return new NextResponse("Not found", {
      status: res.status === 401 ? 401 : 404,
    });
  return new NextResponse(res.body, {
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "image/png",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, max-age=300",
    },
  });
}

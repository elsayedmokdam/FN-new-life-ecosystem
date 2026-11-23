import type { HttpErrorShape, HttpResult } from "../http";

/** First failed result of a group of API calls (for the page-level error state). */
export function firstError(...results: HttpResult<unknown>[]): HttpErrorShape | undefined {
  for (const r of results) if (!r.ok) return r.error;
  return undefined;
}

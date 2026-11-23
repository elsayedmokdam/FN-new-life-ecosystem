/** Builds "?a=1&b=2" from an object, skipping empty values (the API validates the query with strict schemas). */
export const toQuery = (params: object = {}): string => {
  const entries = Object.entries(params as Record<string, unknown>).filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  ) as [string, string | number | boolean][];
  const qs = new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
  return qs ? `?${qs}` : "";
};

"use client";

import { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { getClientsAction } from "@/services/actions/clients.action";
import { Client } from "@/services/types/client_interface";
import { useT } from "@/i18n/LocaleProvider";

interface Props {
  /** selected client id */
  value?: string;
  onChange?: (id: string) => void;
}

/** Search-as-you-type client selector (by name or phone). */
export default function ClientPicker({ onChange }: Props) {
  const { t } = useT();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Client[]>([]);
  const [selected, setSelected] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await getClientsAction({
        search: query,
        limit: "8",
        sort: "fullName:asc",
      });
      if (!cancelled && res.ok) setResults(res.data.data.data);
      if (!cancelled) setLoading(false);
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, selected]);

  if (selected) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-main-color/40 bg-accent px-4 py-3">
        <div>
          <p className="font-semibold text-foreground">{selected.fullName}</p>
          <p className="num text-xs text-muted-foreground">{selected.phone}</p>
        </div>
        <button
          type="button"
          aria-label={t("common.clear")}
          onClick={() => {
            setSelected(null);
            onChange?.("");
          }}
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-card"
        >
          <FiX />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-input bg-card">
      <div className="relative border-b border-border">
        <FiSearch className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("client.searchPlaceholder")}
          className="w-full bg-transparent py-3 pe-3 ps-9 text-sm focus:outline-none"
        />
      </div>
      <ul className="max-h-52 overflow-y-auto">
        {loading && (
          <li className="px-4 py-3 text-sm text-muted-foreground">
            {t("common.loading")}
          </li>
        )}
        {!loading && results.length === 0 && (
          <li className="px-4 py-3 text-sm text-muted-foreground">
            {t("client.noResults")}
          </li>
        )}
        {results.map((c) => (
          <li key={c._id}>
            <button
              type="button"
              onClick={() => {
                setSelected(c);
                onChange?.(c._id);
              }}
              className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-start text-sm hover:bg-muted"
            >
              <span className="font-medium">{c.fullName}</span>
              <span className="num text-xs text-muted-foreground">
                {c.phone}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { getCardsAction } from "@/services/actions/cards.action";
import { Card } from "@/services/types/card_interface";
import { useT } from "@/i18n/LocaleProvider";

interface Props {
  onSelect: (card: Card | null) => void;
  selected: Card | null;
  cards?: Card[];
}

/** Search-as-you-type card selector by card name, type, bank or number. */
export default function CardPicker({
  onSelect,
  selected,
  cards,
}: Props) {
  const { t } = useT();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const search = query.trim().toLowerCase();
  const visibleResults = cards
    ? cards.filter((card) => {
        if (!search) return true;
        return [
          card.cardName,
          card.cardType,
          card.bankProvider,
          card.maskedNumber,
          card.cardLast4,
        ].some((value) => value?.toLowerCase().includes(search));
      })
    : results;

  useEffect(() => {
    if (selected || cards) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await getCardsAction({
        status: "active",
        limit: "100",
        sort: "cardName:asc",
      });
      if (!cancelled && res.ok) {
        const search = query.trim().toLowerCase();
        const cards = res.data.data.data.filter((card) => {
          if (!search) return true;
          return [
            card.cardName,
            card.cardType,
            card.bankProvider,
            card.maskedNumber,
            card.cardLast4,
          ].some((value) => value?.toLowerCase().includes(search));
        });
        setResults(
          cards,
        );
      }
      if (!cancelled) setLoading(false);
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, selected, cards]);

  if (selected) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-main-color/40 bg-accent px-4 py-3">
        <div>
          <p className="font-semibold">
            {selected.cardName} <span className="text-muted-foreground">·</span>{" "}
            {selected.cardType ?? "—"} <span className="text-muted-foreground">·</span>{" "}
            {selected.bankProvider ?? "—"} <span className="num text-xs text-muted-foreground">{selected.maskedNumber}</span>
          </p>
        </div>
        <button type="button" aria-label={t("common.clear")} onClick={() => onSelect(null)} className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-card"><FiX /></button>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-input bg-card">
      <div className="relative border-b border-border">
        <FiSearch className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("card.searchPlaceholder")} className="w-full bg-transparent py-3 pe-3 ps-9 text-sm focus:outline-none" />
      </div>
      <ul className="max-h-52 overflow-y-auto">
        {loading && <li className="px-4 py-3 text-sm text-muted-foreground">{t("common.loading")}</li>}
        {!loading && visibleResults.length === 0 && <li className="px-4 py-3 text-sm text-muted-foreground">{t("card.noActive")}</li>}
        {visibleResults.map((c) => (
          <li key={c._id}>
            <button type="button" onClick={() => onSelect(c)} className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-start text-sm hover:bg-muted">
              <span>
                <b>{c.cardName} · {c.cardType ?? "—"} · {c.bankProvider ?? "—"}</b>{" "}
                <span className="num text-xs text-muted-foreground">{c.maskedNumber}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  /** label of the empty ("all") option */
  all: string;
  className?: string;
  ariaLabel?: string;
}

/** Compact native select for table filters. */
export default function FilterSelect({ value, onChange, options, all, className, ariaLabel }: Props) {
  return (
    <select aria-label={ariaLabel ?? all} value={value} onChange={(e) => onChange(e.target.value)} className={cn("h-10 rounded-xl border border-transparent bg-muted px-3 text-sm text-foreground focus:border-main-color focus:outline-none", className)}>
      <option value="">{all}</option>
      {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
    </select>
  );
}

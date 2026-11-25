"use client";

import SegmentedTabs from "../segmented-tabs/SegmentedTabs";

/** SegmentedTabs as a form field (value is a string). */
export default function TabsField({
  value,
  onChange,
  options,
}: {
  value?: string;
  onChange?: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <SegmentedTabs<string>
      value={value || options[0]?.value}
      onChange={(v) => onChange?.(v)}
      options={options}
    />
  );
}

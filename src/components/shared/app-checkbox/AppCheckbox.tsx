"use client";

interface Props {
  label?: string;
  hint?: string;
  value?: unknown;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}

export default function AppCheckbox({
  label,
  hint,
  value,
  onChange,
  disabled,
}: Props) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-3 text-sm">
      <input
        type="checkbox"
        disabled={disabled}
        checked={Boolean(value)}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 size-4 accent-main-color"
      />
      <span>
        <span className="font-medium text-foreground">{label}</span>
        {hint && (
          <span className="block text-xs text-muted-foreground">{hint}</span>
        )}
      </span>
    </label>
  );
}

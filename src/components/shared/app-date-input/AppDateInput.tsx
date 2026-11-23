"use client";

import { Field, FieldLabel } from "@/components/ui/field";

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label?: string;
  value?: string;
  onChange?: (v: string) => void;
}

/** Native date / time picker styled like AppInput (type="date" | "time"). */
export default function AppDateInput({ label, value = "", onChange, type = "date", placeholder: _p, ...rest }: Props) {
  return (
    <Field className="gap-5">
      {label && <FieldLabel>{label}</FieldLabel>}
      <input {...rest} type={type} value={value} onChange={(e) => onChange?.(e.target.value)} className="h-12 w-full rounded-xl border border-input bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-main-color" />
    </Field>
  );
}

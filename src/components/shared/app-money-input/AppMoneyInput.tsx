"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useT } from "@/i18n/LocaleProvider";

interface Props extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> {
  label?: string;
  value?: string;
  onChange?: (v: string) => void;
  suffix?: string;
  allowNegative?: boolean;
}

/** Text input that only accepts a decimal amount with up to 2 decimals ("1234.50"). The value stays a string. */
export default function AppMoneyInput({
  label,
  value = "",
  onChange,
  suffix,
  placeholder,
  allowNegative = false,
  ...rest
}: Props) {
  const { t } = useT();
  return (
    <Field className="gap-5">
      {label && <FieldLabel>{label}</FieldLabel>}
      <InputGroup className="w-full border border-input bg-card px-2 py-6">
        <InputGroupInput
          {...rest}
          dir="ltr"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          placeholder={placeholder ?? "0.00"}
          onChange={(e) => {
            const v = e.target.value.replace(/,/g, ".");
            const pattern = allowNegative
              ? /^-?\d*\.?\d{0,2}$/
              : /^\d*\.?\d{0,2}$/;
            if (v === "" || pattern.test(v)) onChange?.(v);
          }}
          className="px-2 py-6 text-sm num"
        />
        <InputGroupAddon align="inline-end">
          {suffix ?? t("currency")}
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

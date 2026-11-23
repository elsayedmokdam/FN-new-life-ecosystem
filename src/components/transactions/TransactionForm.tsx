"use client";

import { useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FieldError, FieldLabel } from "@/components/ui/field";
import AppButton from "../shared/app-button/AppButton";
import AppInput from "../shared/app-input/AppInput";
import AppTextarea from "../shared/app-textarea/AppTextarea";
import AppMoneyInput from "../shared/app-money-input/AppMoneyInput";
import AppDateInput from "../shared/app-date-input/AppDateInput";
import AppSelectOptions from "../shared/app-select-options/AppSelectOptions";
import TabsField from "../shared/tabs-field/TabsField";
import CardPicker from "../shared/card-picker/CardPicker";
import Money from "../shared/money/Money";
import { $SCHEMAS_REPOSITORY } from "@/schemas/schemas.repo";
import { createTransactionAction, updateTransactionAction } from "@/services/actions/transactions.action";
import { Card } from "@/services/types/card_interface";
import { Machine } from "@/services/types/machine_interface";
import { CommissionSettings } from "@/services/types/settings_interface";
import { TransactionDetails } from "@/services/types/transaction_interface";
import { notify } from "@/services/utils/helpers/alerts";
import { formatRate, minorToInput, parseMinor, parseRateBps, percentOf } from "@/lib/money";
import { nowTime, todayISO } from "@/lib/format";
import { useT } from "@/i18n/LocaleProvider";

interface Props {
  card?: Card;
  machines: Machine[];
  settings: CommissionSettings;
  /** edit mode */
  transaction?: TransactionDetails;
  initialType?: "withdrawal" | "deposit";
}

type FormValues = {
  cardId: string; type: "withdrawal" | "deposit"; originalAmount: string; transactionDate: string; transactionTime: string;
  machineId?: string; bankCommission?: string; intermediaryCommission?: string; commissionRate?: string; customerCommission?: string;
  notes?: string; reason?: string;
};

export default function TransactionForm({ card: initialCard, machines, settings, transaction, initialType = "withdrawal" }: Props) {
  const { t } = useT();
  const router = useRouter();
  const edit = !!transaction;
  const [card, setCard] = useState<Card | null>(initialCard ?? null);
  const [file, setFile] = useState<File | null>(null);
  const keyRef = useRef(typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()));

  const schema = useMemo(() => (edit ? $SCHEMAS_REPOSITORY.EDIT_TRANSACTION_FORM(t) : $SCHEMAS_REPOSITORY.TRANSACTION_FORM(t)), [t, edit]);

  const defaults: FormValues = edit
    ? {
        cardId: transaction!.cardId, type: transaction!.type, originalAmount: minorToInput(transaction!.originalAmount), transactionDate: transaction!.transactionDay,
        transactionTime: transaction!.transactionTime, machineId: transaction!.machineId ?? "", bankCommission: transaction!.bankCommission ? minorToInput(transaction!.bankCommission) : "",
        intermediaryCommission: transaction!.intermediaryCommission ? minorToInput(transaction!.intermediaryCommission) : "",
        commissionRate: transaction!.type === "withdrawal" ? formatRate(transaction!.commissionRateBps) : "", customerCommission: "", notes: transaction!.notes ?? "", reason: "",
      }
    : { cardId: initialCard?._id ?? "", type: initialType, originalAmount: "", transactionDate: todayISO(), transactionTime: nowTime(), machineId: "", bankCommission: "", intermediaryCommission: "", commissionRate: "", customerCommission: "", notes: "" };

  const { control, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<FormValues>({ defaultValues: defaults, mode: "all", resolver: zodResolver(schema as never) });
  const v = watch();
  const type = edit ? transaction!.type : v.type;

  // ---- live preview (the API recalculates everything; this is only an estimate) ----
  const preview = useMemo(() => {
    const amount = parseMinor(v.originalAmount);
    if (amount === null || amount <= 0) return null;
    const bank = parseMinor(v.bankCommission) ?? 0;
    const inter = parseMinor(v.intermediaryCommission) ?? 0;
    const rules = edit ? { netAmountMode: transaction!.rules?.netAmountMode ?? settings.rules.netAmountMode, bankCommissionPaidBy: transaction!.rules?.bankCommissionPaidBy ?? settings.rules.bankCommissionPaidBy, intermediaryTreatment: transaction!.rules?.intermediaryTreatment ?? settings.rules.intermediaryTreatment } : settings.rules;
    const net = rules.netAmountMode === "original_minus_bank" ? Math.max(amount - bank, 0) : amount;
    if (type === "deposit") return { net, commission: 0, debt: -amount, balance: amount };
    const rate = parseRateBps(v.commissionRate) ?? settings.defaultCommissionRateBps;
    const override = parseMinor(v.customerCommission);
    const commission = v.customerCommission?.trim() && override !== null ? override : percentOf(net, rate);
    const debt = amount + commission + (rules.bankCommissionPaidBy === "customer" ? bank : 0) + (rules.intermediaryTreatment === "added_to_debt" ? inter : 0);
    return { net, commission, debt, balance: -amount };
  }, [v.originalAmount, v.bankCommission, v.intermediaryCommission, v.commissionRate, v.customerCommission, type, settings, edit, transaction]);

  async function onSubmit(d: FormValues) {
    if (!edit && !card) return notify.error(t("tx.selectCard"));
    const fd = new FormData();
    const put = (k: string, val?: string) => val !== undefined && val !== "" && fd.set(k, val);
    if (!edit) {
      fd.set("cardId", card!._id);
      fd.set("type", d.type);
      fd.set("idempotencyKey", keyRef.current);
    } else {
      fd.set("reason", d.reason ?? "");
    }
    fd.set("originalAmount", String(parseMinor(d.originalAmount)));
    fd.set("transactionDate", d.transactionDate);
    put("transactionTime", d.transactionTime);
    if (edit) fd.set("machineId", d.machineId ?? "");
    else put("machineId", d.machineId);
    if (d.bankCommission?.trim()) fd.set("bankCommission", String(parseMinor(d.bankCommission)));
    if (d.intermediaryCommission?.trim()) fd.set("intermediaryCommission", String(parseMinor(d.intermediaryCommission)));
    if (type === "withdrawal") {
      if (d.commissionRate?.trim()) fd.set("commissionRateBps", String(parseRateBps(d.commissionRate)));
      if (d.customerCommission?.trim()) fd.set("customerCommission", String(parseMinor(d.customerCommission)));
    }
    if (edit) fd.set("notes", d.notes ?? "");
    else put("notes", d.notes);
    if (file) fd.set("receipt", file);

    const res = edit ? await updateTransactionAction(transaction!._id, fd) : await createTransactionAction(fd);
    if (!res.ok) return notify.apiError(res.error);
    notify.success(edit ? t("tx.updated") : res.data.message === "Duplicate submission ignored" ? t("tx.duplicate") : t("tx.created"));
    router.push(`/transactions/${res.data.data._id}`);
    router.refresh();
  }

  const err = (name: keyof FormValues, errors: Record<string, { message?: string } | undefined>) => errors[name] && <FieldError className="mt-1" errors={[errors[name]!]} />;
  const rulesNote = !settings.rulesConfirmed;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto grid max-w-5xl gap-6 p-4 md:p-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm md:p-8">
        {/* type */}
        {!edit && (
          <Controller control={control} name="type" render={({ field }) => (
            <div><FieldLabel className="mb-2">{t("tx.type")} *</FieldLabel>
              <TabsField value={field.value} onChange={field.onChange} options={[{ value: "withdrawal", label: t("status.withdrawal") }, { value: "deposit", label: t("status.deposit") }]} /></div>
          )} />
        )}

        {/* card + client (client is derived from the card and cannot be changed) */}
        <div>
          <FieldLabel className="mb-2">{t("tx.card")} *</FieldLabel>
          {edit ? (
            <div className="rounded-xl bg-muted px-4 py-3 text-sm"><b>{transaction!.card?.cardName}</b> · {transaction!.client?.fullName}</div>
          ) : (
            <CardPicker selected={card} onSelect={(c) => { setCard(c); setValue("cardId", c?._id ?? "", { shouldValidate: true }); }} />
          )}
          {card && !edit && <p className="mt-2 text-xs text-muted-foreground">{t("tx.client")}: <b>{card.client?.fullName}</b> · {t("card.balance")}: <Money value={card.balance} className="text-xs" /></p>}
        </div>

        <Controller control={control} name="originalAmount" render={({ field, formState: { errors } }) => (
          <div><FieldLabel className="mb-2">{t("tx.amount")} *</FieldLabel><AppMoneyInput {...field} autoFocus />{err("originalAmount", errors as never)}</div>
        )} />

        <div className="grid gap-5 sm:grid-cols-2">
          <Controller control={control} name="transactionDate" render={({ field, formState: { errors } }) => (
            <div><FieldLabel className="mb-2">{t("tx.date")} *</FieldLabel><AppDateInput {...field} max={todayISO()} />{err("transactionDate", errors as never)}</div>
          )} />
          <Controller control={control} name="transactionTime" render={({ field, formState: { errors } }) => (
            <div><FieldLabel className="mb-2">{t("tx.time")}</FieldLabel><AppDateInput {...field} type="time" />{err("transactionTime", errors as never)}</div>
          )} />
        </div>
        <p className="-mt-3 text-xs text-muted-foreground">{t("tx.historicalHint")}</p>

        <Controller control={control} name="machineId" render={({ field }) => (
          <div><FieldLabel className="mb-2">{t("tx.machine")}</FieldLabel>
            <AppSelectOptions value={field.value} onChange={(val: string) => field.onChange(val === "__none" ? "" : val)} placeholder={t("tx.noMachine")} values={[{ value: "__none", label: t("tx.noMachine") }, ...machines.map((m) => ({ value: m._id, label: m.name }))]} /></div>
        )} />

        <div className="grid gap-5 sm:grid-cols-2">
          <Controller control={control} name="bankCommission" render={({ field, formState: { errors } }) => (
            <div><FieldLabel className="mb-2">{t("tx.bankCommission")}</FieldLabel><AppMoneyInput {...field} />{err("bankCommission", errors as never)}</div>
          )} />
          <Controller control={control} name="intermediaryCommission" render={({ field, formState: { errors } }) => (
            <div><FieldLabel className="mb-2">{t("tx.intermediaryCommission")}</FieldLabel><AppMoneyInput {...field} />{err("intermediaryCommission", errors as never)}</div>
          )} />
        </div>

        {type === "withdrawal" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Controller control={control} name="commissionRate" render={({ field, formState: { errors } }) => (
              <div><FieldLabel className="mb-2">{t("tx.commissionRate")}</FieldLabel>
                <AppInput {...field} dir="ltr" inputMode="decimal" placeholder={`${formatRate(settings.defaultCommissionRateBps)} (${t("tx.default")})`} />{err("commissionRate", errors as never)}</div>
            )} />
            <Controller control={control} name="customerCommission" render={({ field, formState: { errors } }) => (
              <div><FieldLabel className="mb-2">{t("tx.customerCommissionOverride")}</FieldLabel><AppMoneyInput {...field} placeholder={preview ? minorToInput(preview.commission) : "0.00"} />{err("customerCommission", errors as never)}</div>
            )} />
          </div>
        )}

        <Controller control={control} name="notes" render={({ field }) => (<div><FieldLabel className="mb-2">{t("tx.notes")}</FieldLabel><AppTextarea {...field} /></div>)} />

        <div>
          <FieldLabel className="mb-2">{t("tx.receipt")}</FieldLabel>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full cursor-pointer rounded-xl border border-input bg-card text-sm file:me-3 file:cursor-pointer file:border-0 file:bg-accent file:px-4 file:py-3 file:font-semibold file:text-accent-foreground" />
          <p className="mt-1 text-xs text-muted-foreground">{t("tx.receiptHint")}</p>
        </div>

        {edit && (
          <Controller control={control} name="reason" render={({ field, formState: { errors } }) => (
            <div><FieldLabel className="mb-2">{t("tx.editReason")} *</FieldLabel><AppTextarea {...field} placeholder={t("tx.editReasonHint")} />{err("reason", errors as never)}</div>
          )} />
        )}
      </div>

      {/* summary */}
      <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-bold">{t("tx.preview")}</h3>
          {preview ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">{t("tx.netAmount")}</dt><dd><Money value={preview.net} /></dd></div>
              {type === "withdrawal" && <div className="flex justify-between"><dt className="text-muted-foreground">{t("tx.customerCommission")}</dt><dd><Money value={preview.commission} tone="commission" /></dd></div>}
              <div className="flex justify-between"><dt className="text-muted-foreground">{t("tx.balanceChange")}</dt><dd><Money value={preview.balance} tone="auto" signed /></dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">{t("tx.debtChange")}</dt><dd><Money value={preview.debt} tone={preview.debt > 0 ? "debt" : "credit"} signed /></dd></div>
            </dl>
          ) : (<p className="text-sm text-muted-foreground">{t("tx.previewEmpty")}</p>)}
          <p className="mt-3 text-xs text-muted-foreground">{t("tx.previewNote")}</p>
        </div>
        {rulesNote && <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">{t("tx.rulesWarning")}</p>}
        <AppButton type="submit" loading={isSubmitting} className="w-full rounded-xl bg-main-color py-6 font-semibold text-white hover:bg-main-color/90">{edit ? t("common.save") : type === "withdrawal" ? t("tx.saveWithdrawal") : t("tx.saveDeposit")}</AppButton>
      </aside>
    </form>
  );
}

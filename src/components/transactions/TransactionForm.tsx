"use client";

import { useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FieldError, FieldLabel } from "@/components/ui/field";
import AppButton from "../shared/app-button/AppButton";
import AppTextarea from "../shared/app-textarea/AppTextarea";
import AppMoneyInput from "../shared/app-money-input/AppMoneyInput";
import AppDateInput from "../shared/app-date-input/AppDateInput";
import AppSelectOptions from "../shared/app-select-options/AppSelectOptions";
import TabsField from "../shared/tabs-field/TabsField";
import CardPicker from "../shared/card-picker/CardPicker";
import Money from "../shared/money/Money";
import { $SCHEMAS_REPOSITORY } from "@/schemas/schemas.repo";
import {
  createTransactionAction,
  updateTransactionAction,
} from "@/services/actions/transactions.action";
import { Card } from "@/services/types/card_interface";
import { Machine } from "@/services/types/machine_interface";
import { TransactionDetails } from "@/services/types/transaction_interface";
import { notify } from "@/services/utils/helpers/alerts";
import {
  formatRate,
  minorToInput,
  parseMinor,
  parseRateBps,
  percentOf,
} from "@/lib/money";
import { nowTime, todayISO } from "@/lib/format";
import { useT } from "@/i18n/LocaleProvider";

interface Props {
  card?: Card;
  machines: Machine[];
  /** edit mode */
  transaction?: TransactionDetails;
  initialType?: "withdrawal" | "deposit";
}

type FormValues = {
  cardId: string;
  type: "withdrawal" | "deposit";
  originalAmount: string;
  transactionDate: string;
  transactionTime: string;
  machineId?: string;
  machineCommissionType?: "egypt_and_ahly" | "other_banks";
  intermediaryCommissionRate?: string;
  notes?: string;
  reason?: string;
};

export default function TransactionForm({
  card: initialCard,
  machines,
  transaction,
  initialType = "withdrawal",
}: Props) {
  const { t } = useT();
  const router = useRouter();
  const edit = !!transaction;
  const [card, setCard] = useState<Card | null>(initialCard ?? null);
  const [file, setFile] = useState<File | null>(null);
  const keyRef = useRef(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : String(Date.now()),
  );

  const schema = useMemo(
    () =>
      edit
        ? $SCHEMAS_REPOSITORY.EDIT_TRANSACTION_FORM(t)
        : $SCHEMAS_REPOSITORY.TRANSACTION_FORM(t),
    [t, edit],
  );

  const defaults: FormValues = edit
    ? {
        cardId: transaction!.cardId,
        type: transaction!.type,
        originalAmount: minorToInput(transaction!.originalAmount),
        transactionDate: transaction!.transactionDay,
        transactionTime: transaction!.transactionTime,
        machineId: transaction!.machineId ?? "",
        machineCommissionType: transaction!.machineCommissionType,
        intermediaryCommissionRate:
          transaction!.intermediaryCommissionRateBps == null
            ? ""
            : formatRate(transaction!.intermediaryCommissionRateBps),
        notes: transaction!.notes ?? "",
        reason: "",
      }
    : {
        cardId: initialCard?._id ?? "",
        type: initialType,
        originalAmount: "",
        transactionDate: todayISO(),
        transactionTime: nowTime(),
        machineId: "",
        machineCommissionType: undefined,
        intermediaryCommissionRate: "",
        notes: "",
      };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: defaults,
    mode: "all",
    resolver: zodResolver(schema as never),
  });
  const v = watch();
  const type = edit ? transaction!.type : v.type;

  // ---- live preview (the API recalculates everything; this is only an estimate) ----
  const preview = useMemo(() => {
    const amount = parseMinor(v.originalAmount);
    if (amount === null || amount <= 0) return null;
    if (type === "deposit")
      return {
        net: amount,
        bank: 0,
        intermediary: 0,
        intermediaryRateBps: 0,
        legacyCommission: false,
        totalCommission: 0,
        manualBalance: 0,
        debt: -amount,
        balance: amount,
      };
    const machine = machines.find((m) => m._id === v.machineId);
    const rate =
      v.machineCommissionType === "egypt_and_ahly"
        ? (machine?.egyptAndAhlyCommissionRateBps ?? 0)
        : v.machineCommissionType === "other_banks"
          ? (machine?.otherBanksCommissionRateBps ?? 0)
          : 0;
    const bank = percentOf(amount, rate);
    const intermediaryRateBps =
      parseRateBps(v.intermediaryCommissionRate) ?? 0;
    const preserveLegacyCommission =
      edit &&
      transaction!.intermediaryCommissionRateBps == null &&
      !v.intermediaryCommissionRate?.trim();
    const intermediary = preserveLegacyCommission
      ? transaction!.intermediaryCommission
      : percentOf(amount, intermediaryRateBps);
    return {
      net: amount,
      bank,
      intermediary,
      intermediaryRateBps,
      legacyCommission: preserveLegacyCommission,
      totalCommission: bank + intermediary,
      manualBalance: -(bank + intermediary),
      debt: 0,
      balance: -amount,
    };
  }, [
    v.originalAmount,
    v.machineId,
    v.machineCommissionType,
    v.intermediaryCommissionRate,
    type,
    machines,
    edit,
    transaction,
  ]);

  async function onSubmit(d: FormValues) {
    if (!edit && !card) return notify.error(t("tx.selectCard"));
    const fd = new FormData();
    const put = (k: string, val?: string) =>
      val !== undefined && val !== "" && fd.set(k, val);
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
    if (type === "withdrawal") {
      if (edit) fd.set("machineId", d.machineId ?? "");
      else put("machineId", d.machineId);
      if (d.machineCommissionType)
        fd.set("machineCommissionType", d.machineCommissionType);
      if (d.intermediaryCommissionRate?.trim())
        fd.set(
          "intermediaryCommissionRateBps",
          String(parseRateBps(d.intermediaryCommissionRate)),
        );
    }
    if (edit) fd.set("notes", d.notes ?? "");
    else put("notes", d.notes);
    if (file) fd.set("receipt", file);

    const res = edit
      ? await updateTransactionAction(transaction!._id, fd)
      : await createTransactionAction(fd);
    if (!res.ok) return notify.apiError(res.error);
    notify.success(
      edit
        ? t("tx.updated")
        : res.data.message === "Duplicate submission ignored"
          ? t("tx.duplicate")
          : t("tx.created"),
    );
    router.push(`/transactions/${res.data.data._id}`);
    router.refresh();
  }

  const err = (
    name: keyof FormValues,
    errors: Record<string, { message?: string } | undefined>,
  ) => errors[name] && <FieldError className="mt-1" errors={[errors[name]!]} />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto grid max-w-5xl gap-6 p-4 md:p-6 lg:grid-cols-[1fr_320px]"
    >
      <div className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm md:p-8">
        {/* type */}
        {!edit && (
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <div>
                <FieldLabel className="mb-2">{t("tx.type")} *</FieldLabel>
                <TabsField
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { value: "withdrawal", label: t("status.withdrawal") },
                    { value: "deposit", label: t("status.deposit") },
                  ]}
                />
              </div>
            )}
          />
        )}

        {/* card + client (client is derived from the card and cannot be changed) */}
        <div>
          <FieldLabel className="mb-2">{t("tx.card")} *</FieldLabel>
          {edit ? (
            <div className="rounded-xl bg-muted px-4 py-3 text-sm">
              <b>{transaction!.card?.cardName}</b> ·{" "}
              {transaction!.client?.fullName}
            </div>
          ) : (
            <CardPicker
              selected={card}
              onSelect={(c) => {
                setCard(c);
                setValue("cardId", c?._id ?? "", { shouldValidate: true });
              }}
            />
          )}
          {card && !edit && (
            <p className="mt-2 text-xs text-muted-foreground">
              {t("tx.client")}: <b>{card.client?.fullName}</b> ·{" "}
              {t("card.balance")}:{" "}
              <Money value={card.balance} className="text-xs" />
            </p>
          )}
        </div>

        <Controller
          control={control}
          name="originalAmount"
          render={({ field, formState: { errors } }) => (
            <div>
              <FieldLabel className="mb-2">{t("tx.amount")} *</FieldLabel>
              <AppMoneyInput {...field} autoFocus />
              {err("originalAmount", errors as never)}
            </div>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Controller
            control={control}
            name="transactionDate"
            render={({ field, formState: { errors } }) => (
              <div>
                <FieldLabel className="mb-2">{t("tx.date")} *</FieldLabel>
                <AppDateInput {...field} max={todayISO()} />
                {err("transactionDate", errors as never)}
              </div>
            )}
          />
          <Controller
            control={control}
            name="transactionTime"
            render={({ field, formState: { errors } }) => (
              <div>
                <FieldLabel className="mb-2">{t("tx.time")}</FieldLabel>
                <AppDateInput {...field} type="time" />
                {err("transactionTime", errors as never)}
              </div>
            )}
          />
        </div>
        <p className="-mt-3 text-xs text-muted-foreground">
          {t("tx.historicalHint")}
        </p>

        {type === "withdrawal" && (
          <>
            <Controller
              control={control}
              name="machineId"
              render={({ field }) => (
                <div>
                  <FieldLabel className="mb-2">{t("tx.machine")}</FieldLabel>
                  <AppSelectOptions
                    value={field.value}
                    onChange={(val: string) =>
                      field.onChange(val === "__none" ? "" : val)
                    }
                    placeholder={t("tx.noMachine")}
                    values={[
                      { value: "__none", label: t("tx.noMachine") },
                      ...machines.map((m) => ({ value: m._id, label: m.name })),
                    ]}
                  />
                </div>
              )}
            />
            <Controller
              control={control}
              name="machineCommissionType"
              render={({ field }) => (
                <div>
                  <FieldLabel className="mb-2">
                    {t("tx.machineCommissionType")}
                  </FieldLabel>
                  <AppSelectOptions
                    value={field.value ?? ""}
                    onChange={(val: string) =>
                      field.onChange(val === "__none" ? undefined : val)
                    }
                    placeholder={t("tx.selectCommissionType")}
                    values={[
                      { value: "__none", label: t("tx.noCommissionType") },
                      {
                        value: "egypt_and_ahly",
                        label: t("tx.egyptAndAhlyCommission"),
                      },
                      {
                        value: "other_banks",
                        label: t("tx.otherBanksCommission"),
                      },
                    ]}
                  />
                  {v.machineId && field.value && (() => {
                    const selectedMachine = machines.find((machine) => machine._id === v.machineId);
                    const rateBps =
                      field.value === "egypt_and_ahly"
                        ? selectedMachine?.egyptAndAhlyCommissionRateBps
                        : selectedMachine?.otherBanksCommissionRateBps;
                    return rateBps != null ? (
                      <p className="mt-2 text-sm font-medium text-main-color">
                        {t("tx.machineCommissionType")}: <span className="num">{formatRate(rateBps)}%</span>
                      </p>
                    ) : null;
                  })()}
                </div>
              )}
            />
            <Controller
              control={control}
              name="intermediaryCommissionRate"
              render={({ field, formState: { errors } }) => (
                <div>
                  <FieldLabel className="mb-2">
                    {t("tx.intermediaryCommissionRate")}
                  </FieldLabel>
                  <AppMoneyInput {...field} suffix="%" />
                  {err("intermediaryCommissionRate", errors as never)}
                </div>
              )}
            />
          </>
        )}

        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <div>
              <FieldLabel className="mb-2">{t("tx.notes")}</FieldLabel>
              <AppTextarea {...field} />
            </div>
          )}
        />

        <div>
          <FieldLabel className="mb-2">{t("tx.receipt")}</FieldLabel>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full cursor-pointer rounded-xl border border-input bg-card text-sm file:me-3 file:cursor-pointer file:border-0 file:bg-accent file:px-4 file:py-3 file:font-semibold file:text-accent-foreground"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {t("tx.receiptHint")}
          </p>
        </div>

        {edit && (
          <Controller
            control={control}
            name="reason"
            render={({ field, formState: { errors } }) => (
              <div>
                <FieldLabel className="mb-2">{t("tx.editReason")} *</FieldLabel>
                <AppTextarea {...field} placeholder={t("tx.editReasonHint")} />
                {err("reason", errors as never)}
              </div>
            )}
          />
        )}
      </div>

      {/* summary */}
      <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-bold">{t("tx.preview")}</h3>
          {preview ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("tx.netAmount")}</dt>
                <dd>
                  <Money value={preview.net} />
                </dd>
              </div>
              {type === "withdrawal" && (
                <>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      {t("tx.bankCommission")}
                    </dt>
                    <dd>
                      <Money value={preview.bank} />
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      {t("tx.intermediaryCommission")}
                    </dt>
                    <dd>
                      <Money value={preview.intermediary} />
                    </dd>
                  </div>
                  {!preview.legacyCommission && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">
                        {t("tx.intermediaryCommissionRate")}
                      </dt>
                      <dd className="num">
                        {formatRate(preview.intermediaryRateBps)}%
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      {t("tx.totalCommission")}
                    </dt>
                    <dd>
                      <Money
                        value={preview.totalCommission}
                        tone="commission"
                      />
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      {t("client.manualBalance")}
                    </dt>
                    <dd>
                      <Money value={preview.manualBalance} tone="auto" signed />
                    </dd>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  {t("tx.balanceChange")}
                </dt>
                <dd>
                  <Money value={preview.balance} tone="auto" signed />
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("tx.debtChange")}</dt>
                <dd>
                  <Money
                    value={preview.debt}
                    tone={preview.debt > 0 ? "debt" : "credit"}
                    signed
                  />
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("tx.previewEmpty")}
            </p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            {t("tx.previewNote")}
          </p>
        </div>
        <AppButton
          type="submit"
          loading={isSubmitting}
          className="w-full rounded-xl bg-main-color py-6 font-semibold text-white hover:bg-main-color/90"
        >
          {edit
            ? t("common.save")
            : type === "withdrawal"
              ? t("tx.saveWithdrawal")
              : t("tx.saveDeposit")}
        </AppButton>
      </aside>
    </form>
  );
}

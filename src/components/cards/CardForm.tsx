"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import AppForm from "../shared/app-form/AppForm";
import AppInput from "../shared/app-input/AppInput";
import AppTextarea from "../shared/app-textarea/AppTextarea";
import AppSelectOptions from "../shared/app-select-options/AppSelectOptions";
import AppMoneyInput from "../shared/app-money-input/AppMoneyInput";
import ClientPicker from "../shared/client-picker/ClientPicker";
import TabsField from "../shared/tabs-field/TabsField";
import { FormField } from "../shared/app-form/app_form.interface";
import { $SCHEMAS_REPOSITORY } from "@/schemas/schemas.repo";
import {
  createCardAction,
  updateCardAction,
} from "@/services/actions/cards.action";
import { Card } from "@/services/types/card_interface";
import { notify } from "@/services/utils/helpers/alerts";
import { parseMinor } from "@/lib/money";
import { useT } from "@/i18n/LocaleProvider";

interface Props {
  /** when present the form edits this card (client, number and opening balance are locked) */
  card?: Card;
  requiredFields: string[];
  initialClientId?: string;
}

export default function CardForm({
  card,
  requiredFields,
  initialClientId,
}: Props) {
  const { t } = useT();
  const router = useRouter();
  const edit = !!card;
  const req = (k: string) => (requiredFields.includes(k) ? " *" : "");

  const schema = useMemo(
    () =>
      $SCHEMAS_REPOSITORY.CARD_FORM(
        t,
        requiredFields,
        edit ? "edit" : "create",
      ),
    [t, requiredFields, edit],
  );

  const fields: FormField[] = useMemo(() => {
    const list: FormField[] = [
      {
        name: "cardName",
        type: "input",
        label: `${t("card.name")} *`,
        placeholder: t("card.namePlaceholder"),
      },
    ];
    if (!edit) {
      list.push(
        {
          name: "clientMode",
          type: "tabs",
          wrapperClassName: "md:col-span-2",
          label: `${t("card.client")} *`,
          props: {
            options: [
              { value: "existing", label: t("card.existingClient") },
              { value: "new", label: t("card.newClient") },
            ],
          },
        },
        {
          name: "clientId",
          type: "client",
          wrapperClassName: "md:col-span-2",
          showWhen: (v) => v.clientMode === "existing",
        },
        {
          name: "newClientName",
          type: "input",
          label: `${t("client.fullName")} *`,
          showWhen: (v) => v.clientMode === "new",
        },
        {
          name: "newClientPhone",
          type: "input",
          label: `${t("client.phone")} *`,
          props: { dir: "ltr", inputMode: "tel" },
          showWhen: (v) => v.clientMode === "new",
        },
        {
          name: "newClientEmail",
          type: "input",
          label: t("client.email"),
          props: { dir: "ltr", type: "email" },
          showWhen: (v) => v.clientMode === "new",
        },
        {
          name: "newClientAddress",
          type: "input",
          wrapperClassName: "md:col-span-2",
          label: t("client.address"),
          showWhen: (v) => v.clientMode === "new",
        },
        {
          name: "newClientNotes",
          type: "textarea",
          wrapperClassName: "md:col-span-2",
          label: t("client.notes"),
          showWhen: (v) => v.clientMode === "new",
        },
        {
          name: "cardNumber",
          type: "input",
          label: `${t("card.number")} *`,
          placeholder: "0000 0000 0000 0000",
          props: { dir: "ltr", inputMode: "numeric", autoComplete: "off" },
        },
      );
    }
    list.push(
      {
        name: "bankProvider",
        type: "input",
        label: `${t("card.bank")}${req("bankProvider")}`,
      },
      {
        name: "cardType",
        type: "input",
        label: `${t("card.type")}${req("cardType")}`,
        placeholder: "Visa / Mastercard / Meeza",
      },
    );
    if (!edit)
      list.push({
        name: "openingBalance",
        type: "money",
        label: t("card.openingBalance"),
      });
    list.push(
      {
        name: "intermediaryName",
        type: "input",
        label: `${t("card.intermediaryName")}${req("intermediaryName")}`,
      },
      {
        name: "intermediaryPhone",
        type: "input",
        label: `${t("card.intermediaryPhone")}${req("intermediaryPhone")}`,
        props: { dir: "ltr", inputMode: "tel" },
      },
      {
        name: "intermediaryNotes",
        type: "textarea",
        wrapperClassName: "md:col-span-2",
        label: t("card.intermediaryNotes"),
      },
      {
        name: "notes",
        type: "textarea",
        wrapperClassName: "md:col-span-2",
        label: `${t("card.notes")}${req("notes")}`,
      },
      {
        name: "status",
        type: "select",
        label: t("card.status"),
        props: {
          values: (["active", "inactive", "archived"] as const).map((s) => ({
            value: s,
            label: t(`status.${s}`),
          })),
        },
      },
    );
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, edit, requiredFields]);

  const defaults = card
    ? {
        cardName: card.cardName,
        clientMode: "existing",
        bankProvider: card.bankProvider ?? "",
        cardType: card.cardType ?? "",
        intermediaryName: card.intermediaryName ?? "",
        intermediaryPhone: card.intermediaryPhone ?? "",
        intermediaryNotes: card.intermediaryNotes ?? "",
        notes: card.notes ?? "",
        status: card.status,
      }
    : {
        cardName: "",
        clientMode: initialClientId ? "existing" : "new",
        clientId: initialClientId ?? "",
        newClientName: "",
        newClientPhone: "",
        newClientEmail: "",
        newClientAddress: "",
        newClientNotes: "",
        cardNumber: "",
        bankProvider: "",
        cardType: "",
        openingBalance: "",
        intermediaryName: "",
        intermediaryPhone: "",
        intermediaryNotes: "",
        notes: "",
        status: "active",
      };

  async function onSubmit(d: Record<string, string>) {
    const clean = (v?: string) => (v && v.trim() !== "" ? v.trim() : undefined);
    if (edit) {
      const res = await updateCardAction(card!._id, {
        cardName: d.cardName,
        bankProvider: d.bankProvider ?? "",
        cardType: d.cardType ?? "",
        intermediaryName: d.intermediaryName ?? "",
        intermediaryPhone: d.intermediaryPhone ?? "",
        intermediaryNotes: d.intermediaryNotes ?? "",
        notes: d.notes ?? "",
        status: d.status as Card["status"],
      });
      if (!res.ok) return notify.apiError(res.error);
      notify.success(t("card.updated"));
      router.push(`/cards/${card!._id}`);
      router.refresh();
      return;
    }
    const res = await createCardAction({
      cardName: d.cardName,
      cardNumber: d.cardNumber,
      ...(d.clientMode === "new"
        ? {
            newClient: {
              fullName: d.newClientName.trim(),
              phone: d.newClientPhone.trim(),
              email: clean(d.newClientEmail),
              address: clean(d.newClientAddress),
              notes: clean(d.newClientNotes),
            },
          }
        : { clientId: d.clientId }),
      bankProvider: clean(d.bankProvider),
      cardType: clean(d.cardType),
      openingBalance: clean(d.openingBalance)
        ? (parseMinor(d.openingBalance) ?? 0)
        : 0,
      intermediaryName: clean(d.intermediaryName),
      intermediaryPhone: clean(d.intermediaryPhone),
      intermediaryNotes: clean(d.intermediaryNotes),
      notes: clean(d.notes),
      status: d.status as Card["status"],
    });
    if (!res.ok) return notify.apiError(res.error);
    notify.success(t("card.created"));
    router.push(`/cards/${res.data.data._id}`);
  }

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-8">
        {edit && (
          <div className="mb-6 grid gap-3 rounded-xl bg-muted p-4 text-sm sm:grid-cols-2">
            <p>
              <span className="text-muted-foreground">
                {t("card.client")}:{" "}
              </span>
              <b>{card!.client?.fullName}</b>
            </p>
            <p>
              <span className="text-muted-foreground">
                {t("card.number")}:{" "}
              </span>
              <b className="num">{card!.maskedNumber}</b>
            </p>
            <p className="text-xs text-muted-foreground sm:col-span-2">
              {t("card.lockedHint")}
            </p>
          </div>
        )}
        <AppForm
          key={edit ? card!._id : "new"}
          fields={fields}
          components={{
            input: AppInput,
            textarea: AppTextarea,
            select: AppSelectOptions,
            money: AppMoneyInput,
            client: ClientPicker,
            tabs: TabsField,
          }}
          defaultValues={defaults}
          schema={schema}
          onSubmit={onSubmit}
          layoutClassName="grid gap-5 md:grid-cols-2 [&>*:nth-child(n)]:min-w-0"
          buttonText={edit ? t("common.save") : t("card.create")}
          buttonClassName="bg-main-color text-white font-semibold px-6 py-6 rounded-xl w-full sm:w-auto flex items-center justify-center gap-2 transition"
        ></AppForm>
      </div>
    </div>
  );
}

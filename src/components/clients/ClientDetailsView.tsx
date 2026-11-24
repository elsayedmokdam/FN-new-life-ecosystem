"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiDownload, FiEdit2, FiFileText, FiPlus } from "react-icons/fi";
import * as zod from "zod";
import StatCard from "../shared/stat-card/StatCard";
import Money from "../shared/money/Money";
import StatusBadge from "../shared/status-badge/StatusBadge";
import DataTable, { Column } from "../shared/data-table/DataTable";
import Modal from "../shared/modal/Modal";
import AppForm from "../shared/app-form/AppForm";
import AppInput from "../shared/app-input/AppInput";
import AppTextarea from "../shared/app-textarea/AppTextarea";
import AppMoneyInput from "../shared/app-money-input/AppMoneyInput";
import CardPicker from "../shared/card-picker/CardPicker";
import {
  adjustClientDebtAction,
  updateClientAction,
} from "@/services/actions/clients.action";
import { ClientDetails } from "@/services/types/client_interface";
import { Card } from "@/services/types/card_interface";
import { notify } from "@/services/utils/helpers/alerts";
import { nameRule, phoneRule } from "@/schemas/common";
import { useT } from "@/i18n/LocaleProvider";
import { minorToInput, parseMinor } from "@/lib/money";

export default function ClientDetailsView({
  client,
  isAdmin = false,
}: {
  client: ClientDetails;
  isAdmin?: boolean;
}) {
  const { t, locale } = useT();
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const [editDebt, setEditDebt] = useState(false);
  const [debtCard, setDebtCard] = useState<Card | null>(client.cards[0] ?? null);

  const schema = zod.object({
    fullName: nameRule(t),
    phone: phoneRule(t),
    email: zod
      .string()
      .optional()
      .refine(
        (v) => !v || zod.email().safeParse(v).success,
        t("validation.email"),
      ),
    address: zod.string().max(300).optional(),
    notes: zod.string().max(2000).optional(),
    manualBalance: zod
      .string()
      .optional()
      .refine((v) => !v || parseMinor(v) !== null, t("validation.amount")),
  });

  const debtSchema = zod.object({
    debt: zod
      .string()
      .trim()
      .refine((v) => parseMinor(v) !== null, t("validation.amount")),
    reason: zod.string().trim().max(1000),
  });

  const columns: Column<Card>[] = [
    {
      key: "name",
      header: t("card.name"),
      cell: (c) => (
        <Link
          href={`/cards/${c._id}`}
          className="font-semibold text-main-color hover:underline"
        >
          {c.cardName}
        </Link>
      ),
    },
    {
      key: "number",
      header: t("card.number"),
      cell: (c) => (
        <span className="num text-muted-foreground">{c.maskedNumber}</span>
      ),
    },
    {
      key: "type",
      header: t("card.type"),
      cell: (c) => c.cardType ?? "—",
    },
    {
      key: "balance",
      header: t("card.balance"),
      align: "end",
      cell: (c) => <Money value={c.balance} />,
    },
    {
      key: "debt",
      header: t("card.debt"),
      align: "end",
      cell: (c) =>
        c.currentCredit > 0 ? (
          <Money value={c.currentCredit} tone="credit" />
        ) : (
          <Money
            value={c.currentDebt}
            tone={c.currentDebt > 0 ? "debt" : "none"}
          />
        ),
    },
    {
      key: "status",
      header: t("card.status"),
      cell: (c) => <StatusBadge status={c.status} />,
    },
  ];
  const exp = (format: "pdf" | "excel") =>
    `/api/reports/export?format=${format}&report=client&id=${client._id}&period=this_month&lang=${locale}`;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/cards/new?clientId=${client._id}`}
          className="flex items-center gap-2 rounded-xl bg-main-color px-4 py-2.5 text-sm font-semibold text-white"
        >
          <FiPlus /> {t("card.add")}
        </Link>
        <button
          type="button"
          onClick={() => setEdit(true)}
          className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted"
        >
          <FiEdit2 /> {t("common.edit")}
        </button>
        {isAdmin && (
          <button
            type="button"
            onClick={() => setEditDebt(true)}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted"
          >
            <FiEdit2 /> {t("client.editDebt")}
          </button>
        )}
        <Link
          href={`/transactions?clientId=${client._id}`}
          className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted"
        >
          {t("nav.transactions")}
        </Link>
        <div className="ms-auto flex gap-2">
          <a
            href={exp("pdf")}
            className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm hover:bg-muted"
          >
            <FiDownload /> PDF
          </a>
          <a
            href={exp("excel")}
            className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm hover:bg-muted"
          >
            <FiFileText /> Excel
          </a>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">
              {t("client.phone")}
            </dt>
            <dd className="num font-medium">{client.phone}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              {t("client.email")}
            </dt>
            <dd className="font-medium">{client.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              {t("client.address")}
            </dt>
            <dd className="font-medium">{client.address ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              {t("card.status")}
            </dt>
            <dd>
              <StatusBadge status={client.status} />
            </dd>
          </div>
        </dl>
        {client.notes && (
          <p className="mt-4 rounded-xl bg-muted p-3 text-sm text-muted-foreground">
            {client.notes}
          </p>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title={t("client.cardsCount")}>
          {client.totals.cardsCount}
        </StatCard>
        <StatCard title={t("client.totalBalance")}>
          <Money value={client.totals.totalBalance} />
        </StatCard>
        <StatCard title={t("client.manualBalance")}>
          <Money value={client.manualBalance ?? 0} signed />
        </StatCard>
        <StatCard title={t("client.actualProfit")}>
          <Money
            value={
              client.actualProfit ??
              client.profit ??
              client.totals.actualProfit ??
              client.totals.profit ??
              0
            }
            tone="commission"
          />
        </StatCard>
        <StatCard title={t("client.totalDebt")}>
          <Money
            value={client.totals.totalDebt}
            tone={client.totals.totalDebt > 0 ? "debt" : "none"}
          />
        </StatCard>
        <StatCard title={t("client.totalCredit")}>
          <Money
            value={client.totals.totalCredit}
            tone={client.totals.totalCredit > 0 ? "credit" : "none"}
          />
        </StatCard>
      </div>

      <DataTable columns={columns} rows={client.cards} rowKey={(c) => c._id} />

      <Modal
        open={edit}
        onClose={() => setEdit(false)}
        title={t("client.edit")}
      >
        <AppForm
          fields={[
            { name: "fullName", type: "input", label: t("client.fullName") },
            {
              name: "phone",
              type: "input",
              label: t("client.phone"),
              props: { dir: "ltr" },
            },
            {
              name: "email",
              type: "input",
              label: t("client.email"),
              props: { dir: "ltr" },
            },
            { name: "address", type: "input", label: t("client.address") },
            { name: "notes", type: "textarea", label: t("client.notes") },
            ...(isAdmin
              ? [
                  {
                    name: "manualBalance",
                    type: "money" as const,
                    label: t("client.manualBalance"),
                    props: { allowNegative: true },
                  },
                ]
              : []),
          ]}
          components={{
            input: AppInput,
            textarea: AppTextarea,
            money: AppMoneyInput,
          }}
          schema={schema}
          defaultValues={{
            fullName: client.fullName,
            phone: client.phone,
            email: client.email ?? "",
            address: client.address ?? "",
            notes: client.notes ?? "",
            ...(isAdmin
              ? { manualBalance: minorToInput(client.manualBalance) }
              : {}),
          }}
          buttonText={t("common.save")}
          onSubmit={async (d: Record<string, string>) => {
            const manualBalance = d.manualBalance
              ? parseMinor(d.manualBalance)
              : null;
            const res = await updateClientAction(client._id, {
              fullName: d.fullName,
              phone: d.phone,
              ...(d.email ? { email: d.email } : {}),
              ...(d.address ? { address: d.address } : {}),
              ...(d.notes ? { notes: d.notes } : {}),
              ...(isAdmin && manualBalance !== null ? { manualBalance } : {}),
            });
            if (!res.ok) return notify.apiError(res.error);
            notify.success(t("client.updated"));
            setEdit(false);
            router.refresh();
          }}
        />
      </Modal>

      {isAdmin && (
        <Modal
          open={editDebt}
          onClose={() => setEditDebt(false)}
          title={t("client.editDebt")}
        >
          <AppForm
            fields={[
              {
                name: "debt",
                type: "money",
                label: t("client.debtAdjustment"),
                props: { allowNegative: true },
              },
              { name: "reason", type: "textarea", label: t("tx.reason") },
            ]}
            components={{
              money: AppMoneyInput,
              textarea: AppTextarea,
            }}
            schema={debtSchema}
            defaultValues={{
              debt: "",
              reason: "",
            }}
            buttonText={t("common.save")}
            onSubmit={async (d: Record<string, string>) => {
              const debt = parseMinor(d.debt);
              if (debt === null || !debtCard) return;
              const res = await adjustClientDebtAction(client._id, {
                cardId: debtCard._id,
                debt,
                reason: d.reason.trim(),
              });
              if (!res.ok) return notify.apiError(res.error);
              notify.success(t("client.debtUpdated"));
              setEditDebt(false);
              router.refresh();
            }}
          >
            <label className="mb-4 block text-sm font-medium">
              <span className="mb-2 block">{t("card.name")}</span>
              <CardPicker
                selected={debtCard}
                cards={client.cards}
                onSelect={setDebtCard}
              />
            </label>
          </AppForm>
        </Modal>
      )}
    </div>
  );
}

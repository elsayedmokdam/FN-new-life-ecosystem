"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEdit2, FiPlus, FiPower } from "react-icons/fi";
import DataTable, { Column } from "../shared/data-table/DataTable";
import Money from "../shared/money/Money";
import StatusBadge from "../shared/status-badge/StatusBadge";
import Modal from "../shared/modal/Modal";
import AppForm from "../shared/app-form/AppForm";
import AppInput from "../shared/app-input/AppInput";
import AppTextarea from "../shared/app-textarea/AppTextarea";
import AppButton from "../shared/app-button/AppButton";
import {
  createMachineAction,
  setMachineStatusAction,
  updateMachineAction,
} from "@/services/actions/machines.action";
import { Machine } from "@/services/types/machine_interface";
import { $SCHEMAS_REPOSITORY } from "@/schemas/schemas.repo";
import { notify } from "@/services/utils/helpers/alerts";
import { formatDay } from "@/lib/format";
import { useT } from "@/i18n/LocaleProvider";
import { formatRate, parseRateBps } from "@/lib/money";

export default function MachinesView({ machines }: { machines: Machine[] }) {
  const { t, locale } = useT();
  const router = useRouter();
  const [editing, setEditing] = useState<Machine | "new" | null>(null);

  const toggle = async (m: Machine) => {
    const res = await setMachineStatusAction(
      m._id,
      m.status === "active" ? "inactive" : "active",
    );
    if (!res.ok) return notify.apiError(res.error);
    notify.success(t("machine.updated"));
    router.refresh();
  };

  const columns: Column<Machine>[] = [
    {
      key: "name",
      header: t("machine.name"),
      cell: (m) => <span className="font-semibold">{m.name}</span>,
    },
    { key: "type", header: t("machine.type"), cell: (m) => m.type ?? "—" },
    {
      key: "egyptCommission",
      header: t("machine.egyptAndAhlyCommission"),
      align: "end",
      cell: (m) => (
        <span className="num">
          {formatRate(m.egyptAndAhlyCommissionRateBps)}%
        </span>
      ),
      hideable: true,
    },
    {
      key: "otherCommission",
      header: t("machine.otherBanksCommission"),
      align: "end",
      cell: (m) => (
        <span className="num">
          {formatRate(m.otherBanksCommissionRateBps)}%
        </span>
      ),
      hideable: true,
    },
    {
      key: "description",
      header: t("machine.description"),
      cell: (m) => (
        <span className="text-muted-foreground">{m.description ?? "—"}</span>
      ),
      hideable: true,
    },
    {
      key: "withdrawalCount",
      header: t("machine.withdrawalCount"),
      align: "end",
      cell: (m) => (
        <Link
          href={`/transactions?machineId=${m._id}&type=withdrawal`}
          className="num text-main-color hover:underline"
        >
          {m.withdrawalCount ?? 0}
        </Link>
      ),
    },
    {
      key: "withdrawalVolume",
      header: t("machine.withdrawalVolume"),
      align: "end",
      cell: (m) => <Money value={m.withdrawalVolume} />,
      hideable: true,
    },
    {
      key: "status",
      header: t("card.status"),
      cell: (m) => <StatusBadge status={m.status} />,
    },
    {
      key: "created",
      header: t("common.createdAt"),
      cell: (m) => formatDay(m.createdAt.slice(0, 10), locale),
      hideable: true,
      defaultHidden: true,
    },
    {
      key: "actions",
      header: "",
      align: "end",
      cell: (m) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            aria-label={t("common.edit")}
            onClick={() => setEditing(m)}
            className="flex size-9 cursor-pointer items-center justify-center rounded-lg hover:bg-muted"
          >
            <FiEdit2 />
          </button>
          <button
            type="button"
            aria-label={
              m.status === "active"
                ? t("machine.deactivate")
                : t("machine.activate")
            }
            title={
              m.status === "active"
                ? t("machine.deactivate")
                : t("machine.activate")
            }
            onClick={() => toggle(m)}
            className="flex size-9 cursor-pointer items-center justify-center rounded-lg hover:bg-muted"
          >
            <FiPower
              className={
                m.status === "active"
                  ? "text-emerald-600"
                  : "text-muted-foreground"
              }
            />
          </button>
        </div>
      ),
    },
  ];

  const current = editing && editing !== "new" ? editing : null;
  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex justify-end">
        <AppButton
          onClick={() => setEditing("new")}
          className="bg-main-color text-white hover:bg-main-color/90"
        >
          <FiPlus /> {t("machine.add")}
        </AppButton>
      </div>
      <DataTable
        columns={columns}
        rows={machines}
        rowKey={(m) => m._id}
        storageKey="machines"
        empty={t("machine.empty")}
      />
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={current ? t("machine.edit") : t("machine.add")}
        size="sm"
      >
        <AppForm
          key={current?._id ?? "new"}
          fields={[
            { name: "name", type: "input", label: `${t("machine.name")} *` },
            {
              name: "type",
              type: "input",
              label: t("machine.type"),
              placeholder: "POS / ATM / Wallet",
            },
            {
              name: "egyptAndAhlyCommissionRate",
              type: "input",
              label: t("machine.egyptAndAhlyCommission"),
              placeholder: "0.00",
              props: { dir: "ltr", inputMode: "decimal" },
            },
            {
              name: "otherBanksCommissionRate",
              type: "input",
              label: t("machine.otherBanksCommission"),
              placeholder: "0.00",
              props: { dir: "ltr", inputMode: "decimal" },
            },
            {
              name: "description",
              type: "textarea",
              label: t("machine.description"),
            },
          ]}
          components={{ input: AppInput, textarea: AppTextarea }}
          schema={$SCHEMAS_REPOSITORY.MACHINE_FORM(t)}
          defaultValues={{
            name: current?.name ?? "",
            type: current?.type ?? "",
            egyptAndAhlyCommissionRate: formatRate(
              current?.egyptAndAhlyCommissionRateBps,
            ),
            otherBanksCommissionRate: formatRate(
              current?.otherBanksCommissionRateBps,
            ),
            description: current?.description ?? "",
          }}
          buttonText={t("common.save")}
          onSubmit={async (d: {
            name: string;
            type?: string;
            egyptAndAhlyCommissionRate?: string;
            otherBanksCommissionRate?: string;
            description?: string;
          }) => {
            const payload = {
              name: d.name,
              type: d.type,
              egyptAndAhlyCommissionRateBps:
                d.egyptAndAhlyCommissionRate?.trim()
                  ? (parseRateBps(d.egyptAndAhlyCommissionRate) ?? 0)
                  : 0,
              otherBanksCommissionRateBps: d.otherBanksCommissionRate?.trim()
                ? (parseRateBps(d.otherBanksCommissionRate) ?? 0)
                : 0,
              description: d.description,
            };
            const res = current
              ? await updateMachineAction(current._id, payload)
              : await createMachineAction(payload);
            if (!res.ok) return notify.apiError(res.error);
            notify.success(t("machine.updated"));
            setEditing(null);
            router.refresh();
          }}
        />
      </Modal>
    </div>
  );
}

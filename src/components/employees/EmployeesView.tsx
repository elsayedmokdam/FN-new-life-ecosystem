"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiKey, FiPlus, FiPower } from "react-icons/fi";
import DataTable, { Column } from "../shared/data-table/DataTable";
import StatusBadge from "../shared/status-badge/StatusBadge";
import Modal from "../shared/modal/Modal";
import AppForm from "../shared/app-form/AppForm";
import AppInput from "../shared/app-input/AppInput";
import AppButton from "../shared/app-button/AppButton";
import { createUserAction, resetUserPasswordAction, setUserStatusAction } from "@/services/actions/users.action";
import { Employee } from "@/services/types/user_interface";
import { $SCHEMAS_REPOSITORY } from "@/schemas/schemas.repo";
import { confirmDialog, notify } from "@/services/utils/helpers/alerts";
import { formatDateTime } from "@/lib/format";
import { useT } from "@/i18n/LocaleProvider";

type Dialog = { mode: "create" } | { mode: "reset"; user: Employee } | null;

export default function EmployeesView({ employees }: { employees: Employee[] }) {
  const { t, locale } = useT();
  const router = useRouter();
  const [dlg, setDlg] = useState<Dialog>(null);

  const toggle = async (u: Employee) => {
    const disabling = u.status === "active";
    const ok = await confirmDialog({ title: disabling ? t("emp.disable") : t("emp.enable"), text: disabling ? t("emp.disableText", { name: u.name }) : t("emp.enableText", { name: u.name }), confirmText: t("common.confirm"), cancelText: t("common.cancel"), danger: disabling });
    if (!ok) return;
    const res = await setUserStatusAction(u._id, disabling ? "disabled" : "active");
    if (!res.ok) return notify.apiError(res.error);
    notify.success(t("emp.updated"));
    router.refresh();
  };

  const columns: Column<Employee>[] = [
    { key: "name", header: t("emp.name"), cell: (u) => <span className="font-semibold">{u.name}</span> },
    { key: "email", header: t("auth.email"), cell: (u) => <span dir="ltr" className="text-muted-foreground">{u.email}</span> },
    { key: "status", header: t("card.status"), cell: (u) => <StatusBadge status={u.status} /> },
    { key: "last", header: t("emp.lastLogin"), cell: (u) => (u.lastLoginAt ? formatDateTime(u.lastLoginAt, locale) : "—"), hideable: true },
    { key: "created", header: t("common.createdAt"), cell: (u) => formatDateTime(u.createdAt, locale), hideable: true, defaultHidden: true },
    {
      key: "actions", header: "", align: "end",
      cell: (u) => (
        <div className="flex justify-end gap-1">
          <button type="button" title={t("emp.resetPassword")} aria-label={t("emp.resetPassword")} onClick={() => setDlg({ mode: "reset", user: u })} className="flex size-9 cursor-pointer items-center justify-center rounded-lg hover:bg-muted"><FiKey /></button>
          <button type="button" title={u.status === "active" ? t("emp.disable") : t("emp.enable")} aria-label={u.status === "active" ? t("emp.disable") : t("emp.enable")} onClick={() => toggle(u)} className="flex size-9 cursor-pointer items-center justify-center rounded-lg hover:bg-muted"><FiPower className={u.status === "active" ? "text-emerald-600" : "text-red-500"} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex justify-end"><AppButton onClick={() => setDlg({ mode: "create" })} className="bg-main-color text-white hover:bg-main-color/90"><FiPlus /> {t("emp.add")}</AppButton></div>
      <DataTable columns={columns} rows={employees} rowKey={(u) => u._id} storageKey="employees" empty={t("emp.empty")} />

      <Modal open={dlg?.mode === "create"} onClose={() => setDlg(null)} title={t("emp.add")} size="sm">
        <AppForm
          fields={[
            { name: "name", type: "input", label: t("emp.name") },
            { name: "email", type: "input", label: t("auth.email"), props: { dir: "ltr", type: "email" } },
            { name: "password", type: "input", label: t("emp.initialPassword"), props: { dir: "ltr", type: "password", autoComplete: "new-password" } },
            { name: "confirmPassword", type: "input", label: t("emp.confirmPassword"), props: { dir: "ltr", type: "password", autoComplete: "new-password" } },
          ]}
          components={{ input: AppInput }}
          schema={$SCHEMAS_REPOSITORY.CREATE_EMPLOYEE_FORM(t)}
          defaultValues={{ name: "", email: "", password: "", confirmPassword: "" }}
          buttonText={t("emp.create")}
          onSubmit={async (d: { name: string; email: string; password: string; confirmPassword: string }) => {
            const res = await createUserAction(d);
            if (!res.ok) return notify.apiError(res.error);
            notify.success(t("emp.created"));
            setDlg(null);
            router.refresh();
          }}
        />
      </Modal>

      <Modal open={dlg?.mode === "reset"} onClose={() => setDlg(null)} title={t("emp.resetPassword")} size="sm">
        {dlg?.mode === "reset" && (
          <AppForm
            fields={[
              { name: "newPassword", type: "input", label: t("emp.newPassword"), props: { dir: "ltr", type: "password", autoComplete: "new-password" } },
              { name: "confirmPassword", type: "input", label: t("emp.confirmPassword"), props: { dir: "ltr", type: "password", autoComplete: "new-password" } },
            ]}
            components={{ input: AppInput }}
            schema={$SCHEMAS_REPOSITORY.RESET_PASSWORD_FORM(t)}
            defaultValues={{ newPassword: "", confirmPassword: "" }}
            buttonText={t("emp.reset")}
            onSubmit={async (d: { newPassword: string; confirmPassword: string }) => {
              const res = await resetUserPasswordAction(dlg.user._id, d);
              if (!res.ok) return notify.apiError(res.error);
              notify.success(t("emp.resetDone"));
              setDlg(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

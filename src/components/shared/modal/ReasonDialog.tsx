"use client";

import { useState } from "react";
import Modal from "./Modal";
import AppButton from "../app-button/AppButton";
import { useT } from "@/i18n/LocaleProvider";

interface ReasonDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  label: string;
  confirmText: string;
  /** reason must have at least 3 characters when true */
  required?: boolean;
  danger?: boolean;
  onConfirm: (reason: string) => Promise<void> | void;
}

/** Asks for a mandatory/optional reason (cancellation requests, rejections, ...). */
export default function ReasonDialog({ open, onClose, title, label, confirmText, required = true, danger, onConfirm }: ReasonDialogProps) {
  const { t } = useT();
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const valid = !required || value.trim().length >= 3;

  const submit = async () => {
    if (!valid) return;
    setBusy(true);
    try {
      await onConfirm(value.trim());
      setValue("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <label className="mb-1 block text-sm font-medium text-foreground">{label}</label>
      <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={4} maxLength={1000} autoFocus className="w-full resize-none rounded-xl border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-main-color" />
      {required && !valid && value.length > 0 && <p className="mt-1 text-xs text-destructive">{t("validation.reasonMin")}</p>}
      <div className="mt-4 flex justify-end gap-2">
        <AppButton type="button" variant="outline" onClick={onClose}>{t("common.cancel")}</AppButton>
        <AppButton type="button" loading={busy} disabled={!valid} onClick={submit} className={danger ? "bg-destructive text-white hover:bg-destructive/90" : "bg-main-color text-white hover:bg-main-color/90"}>{confirmText}</AppButton>
      </div>
    </Modal>
  );
}

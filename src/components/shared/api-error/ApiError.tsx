"use client";

import { FiAlertCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";
import AppButton from "../app-button/AppButton";
import { HttpErrorShape } from "@/services/utils/http";
import { useT } from "@/i18n/LocaleProvider";

/** Error state shown by a page when its initial API call failed. */
export default function ApiError({ error }: { error?: Pick<HttpErrorShape, "message" | "status"> }) {
  const { t } = useT();
  const router = useRouter();
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 p-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600 dark:bg-red-500/15 dark:text-red-300"><FiAlertCircle /></span>
      <h2 className="text-xl font-bold text-foreground">{t("error.title")}</h2>
      <p className="text-sm text-muted-foreground">{error?.status === 403 ? t("error.forbidden") : (error?.message ?? t("error.generic"))}</p>
      <AppButton onClick={() => router.refresh()} className="bg-main-color text-white hover:bg-main-color/90">{t("error.retry")}</AppButton>
    </div>
  );
}

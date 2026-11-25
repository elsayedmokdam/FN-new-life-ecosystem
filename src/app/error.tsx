"use client";

import AppButton from "@/components/shared/app-button/AppButton";
import { useT } from "@/i18n/LocaleProvider";

export default function GlobalError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const { t } = useT();
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-xl font-bold">{t("error.title")}</h1>
      <p className="text-sm text-muted-foreground">{t("error.generic")}</p>
      <AppButton
        onClick={reset}
        className="bg-main-color text-white hover:bg-main-color/90"
      >
        {t("error.retry")}
      </AppButton>
    </div>
  );
}

import Link from "next/link";
import { getT } from "@/i18n/server";

export default async function NotFound() {
  const { t } = await getT();
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-6xl font-bold text-main-color">404</p>
      <h1 className="text-xl font-bold">{t("error.notFound")}</h1>
      <Link href="/" className="rounded-xl bg-main-color px-5 py-2.5 text-sm font-semibold text-white">{t("error.home")}</Link>
    </div>
  );
}

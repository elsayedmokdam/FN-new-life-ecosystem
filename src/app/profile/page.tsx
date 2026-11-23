import type { Metadata } from "next";
import { FiUser } from "react-icons/fi";
import PageHeader from "@/components/shared/page-header/PageHeader";
import ProfileView from "@/components/profile/ProfileView";
import { getMyToken } from "@/services/utils/helpers/getMyToken";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const { t } = await getT();
  const token = await getMyToken();
  return (
    <>
      <PageHeader icon={<FiUser />} title={t("nav.profile")} subtitle={t("profile.subtitle")} />
      <ProfileView user={{ name: (token?.name as string) ?? "", email: (token?.email as string) ?? "", role: token?.role ?? "employee" }} sessionExpires={token?.sessionExpires} />
    </>
  );
}

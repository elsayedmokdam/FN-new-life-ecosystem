import type { Metadata } from "next";
import { FiUserCheck } from "react-icons/fi";
import PageHeader from "@/components/shared/page-header/PageHeader";
import EmployeesView from "@/components/employees/EmployeesView";
import ApiError from "@/components/shared/api-error/ApiError";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Employees" };

export default async function EmployeesPage() {
  const { t } = await getT();
  const res = await $SERVICE_REPOSITORY.Users.getUsers({ limit: "100", sort: "createdAt:desc" });
  return (
    <>
      <PageHeader icon={<FiUserCheck />} title={t("nav.employees")} subtitle={t("emp.subtitle")} />
      {res.ok ? <EmployeesView employees={res.data.data.data} /> : <ApiError error={res.error} />}
    </>
  );
}

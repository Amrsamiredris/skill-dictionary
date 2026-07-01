import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getAdminUser } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin sign in — skill / dict",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const user = await getAdminUser();
  if (user) redirect("/admin");

  return <AdminLoginForm />;
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getAdminDashboardData } from "@/lib/admin-data";
import { getAdminUser } from "@/lib/admin-auth";
import { getVercelAnalytics } from "@/lib/vercel-metrics";

export const metadata: Metadata = {
  title: "Admin — skill / dict",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const [data, vercel] = await Promise.all([
    getAdminDashboardData(),
    getVercelAnalytics(),
  ]);

  return <AdminDashboard data={data} vercel={vercel} />;
}

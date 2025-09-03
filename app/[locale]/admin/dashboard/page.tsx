import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";



export default async  function AdminDashboard() {
  const cookieStore = await cookies();
  
  
  return <AdminDashboardClient />;
}
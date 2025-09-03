import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";



export default async  function AdminDashboard() {
  const cookieStore = await cookies();
  const token=cookieStore.get("token")?.value;
  if(!token){
    redirect("/login");
  }

  let user :any;
  try{
    user=verifyToken(token);
  }catch{
    redirect("/login");
  }

  if(user.role !=="admin"){
    redirect("/unauthorized");
  }
  
  return <AdminDashboardClient />;
}
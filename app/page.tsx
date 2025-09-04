import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/en"); // or "/hi" or "/mr"
}

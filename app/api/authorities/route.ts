import { NextResponse } from "next/server";
import user from "@/models/user";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();
  const authorities = await user.find({ role: "authority" }).lean();
  return NextResponse.json(authorities);
}

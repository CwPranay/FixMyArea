import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    
    // No token - return 200 with user: null instead of 401
    if (!token) return NextResponse.json({ user: null }, { status: 200 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.userId).select("-password");
    
    // User not found - return 200 with user: null
    if (!user) return NextResponse.json({ user: null }, { status: 200 });

    // Authority not approved - return 200 with user: null and clear cookie
    if (user.role === "authority" && user.authorityVerified !== "approved") {
      const response = NextResponse.json({ user: null }, { status: 200 });
      response.cookies.set("token", "", {
        expires: new Date(0),
        path: "/",
      });
      return response;
    }

    return NextResponse.json({ user });
  } catch (err) {
    // JWT verification failed - return 200 with user: null
    const response = NextResponse.json({ user: null }, { status: 200 });
    response.cookies.set("token", "", {
      expires: new Date(0),
      path: "/",
    });
    return response;
  }
}
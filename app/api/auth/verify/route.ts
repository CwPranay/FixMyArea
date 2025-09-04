import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Get token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Verify token
    const decoded = await verifyToken(token);
    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
    
    // Type guard for decoded token
    const decodedToken = decoded as { id?: string };
    if (!decodedToken.id) {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }
    
    // Get user from DB
    const user = await User.findById(decodedToken.id).select("-password");
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Check if authority user is approved
    if (user.role === "authority" && user.authorityVerified !== "approved") {
      return NextResponse.json(
        { error: "Authority account pending approval" },
        { status: 403 }
      );
    }
    
    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
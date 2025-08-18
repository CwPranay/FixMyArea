import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Parse JSON body
    const { name, email, password, role = "user", authorityDocs = [] } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      authorityDocs: role === "authority" ? authorityDocs : undefined,
      authorityVerified: role === "authority" ? false : true,
    });

    await newUser.save();

    return NextResponse.json({
      success: true,
      message:
        role === "authority"
          ? "Signup successful. Pending admin approval."
          : "Signup successful. You can now log in.",
    }, { status: 201 });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
} 
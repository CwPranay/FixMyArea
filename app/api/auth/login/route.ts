import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password required" }, { status: 400 });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

        // ✅ CRITICAL FIX: Prevent authority users with pending status from logging in
        if (user.role === "authority" && user.authorityVerified !== "approved") {
            return NextResponse.json(
                { error: "Your authority account is pending verification. Please wait for approval." },
                { status: 403 } // 403 Forbidden - user exists but not allowed
            );
        }

        // JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

        // ✅ Build response and set cookie
        const res = NextResponse.json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                authorityVerified: user.authorityVerified,
            },
        });

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return res;
    } catch (err) {
        console.error("Login error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
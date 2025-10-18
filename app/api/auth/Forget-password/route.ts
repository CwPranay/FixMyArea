import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import crypto from "crypto";
const nodemailer = require("nodemailer");



export async function POST(request: Request) {
    
    await connectDB();
    
    const { email,locale } = await request.json();
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ code: "userNotFound" }, { status: 404 });
        }
        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/reset-password/${token}`;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: "FixMyArea Password Reset",
            text: `You requested a password reset. Click this link: ${resetLink}. This link is valid for 1 hour.`,
            html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a>. This link is valid for 1 hour.</p>`,
        });


        return NextResponse.json({ code: "resetLinkSent" }, { status: 200 });

    }
    catch (err: any) {
        console.error("Error in forgot-password route:", err);
        return NextResponse.json({ code: "serverError" }, { status: 500 });
    }


}



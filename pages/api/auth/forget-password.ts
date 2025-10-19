import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import crypto from "crypto";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  try {
    await connectDB();

    const { email, locale } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ code: "userNotFound" });
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
        pass: process.env.PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: `FixMyArea Password Reset -${Date.now().toString()}`,
      html: `
        <div style="font-family:sans-serif;font-size:15px;color:#333;">
          <p>You requested a password reset for your FixMyArea account.</p>
          <p>
            Click <a href="${resetLink}" style="color:#007bff;">here</a> to reset your password.<br />
            Or copy and paste this link into your browser:<br />
            <a href="${resetLink}" style="color:#007bff;">${resetLink}</a>
          </p>
          <p>This link is valid for 1 hour.</p>
        </div>
      `,
    });

    return res.status(200).json({ code: "resetLinkSent" });
  } catch (err) {
    console.error("Error in forgot-password route:", err);
    return res.status(500).json({ code: "serverError" });
  }
}

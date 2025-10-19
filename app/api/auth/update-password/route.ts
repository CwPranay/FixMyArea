import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PATCH(request: NextRequest) {
    await connectDB();

    try {
        const { currentPassword, newPassword } = await request.json();
        const userId = request.headers.get("userId"); // or however you get authenticated user ID
        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, existingUser.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Current password is incorrect" },
                { status: 400 }
            );
        }


        const hashednewPassword = await bcrypt.hash(newPassword, 12);
        existingUser.password = hashednewPassword;
        await existingUser.save();
        return NextResponse.json(
            { message: "Password updated successfully" },
            { status: 200 }
        );

        const isSamePassword = await bcrypt.compare(newPassword, existingUser.password);
        if (isSamePassword) {
            return NextResponse.json(
                { message: "New password cannot be the same as the old password" },
                { status: 400 }
            );
        }


    }
    catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }

}
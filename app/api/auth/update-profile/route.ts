import { connectDB } from "@/lib/db";
import { NextRequest } from "next/server";
import user from "@/models/user";


// For profile update (name and email only)
export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        
        const body = await req.json();
        const { name, email } = body;
        
        const userId = req.headers.get("userId"); // or however you get authenticated user ID
        
        if (!userId) {
            return new Response(
                JSON.stringify({ message: "Unauthorized" }), 
                { status: 401 }
            );
        }
        
        const existingUser = await user.findById(userId);
        
        if (!existingUser) {
            return new Response(
                JSON.stringify({ message: "User not found" }), 
                { status: 404 }
            );
        }
        
        // Check if email is already taken by another user
        if (email && email !== existingUser.email) {
            const emailExists = await user.findOne({ email, _id: { $ne: userId } });
            if (emailExists) {
                return new Response(
                    JSON.stringify({ message: "Email already in use" }), 
                    { status: 400 }
                );
            }
            existingUser.email = email;
        }
        
        if (name) {
            existingUser.name = name;
        }
        
        await existingUser.save();
        
        return new Response(
            JSON.stringify({ 
                message: "Profile updated successfully",
                user: {
                    name: existingUser.name,
                    email: existingUser.email
                }
            }), 
            { status: 200 }
        );
        
    } catch (error) {
        console.error("Profile update error:", error);
        return new Response(
            JSON.stringify({ message: "Failed to update profile" }), 
            { status: 500 }
        );
    }
}
import { NextResponse } from "next/server";
import user from "@/models/user";
import { connectDB } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {

    try{
        await connectDB();
        const { id } = params;
        const {status} = await req.json();
        const updated =await user.findByIdAndUpdate(id,{authorityVerified:status},{new:true});
        if(!updated){
            return NextResponse.json({message:"Authority not found"}, {status:404});
        }
        return NextResponse.json({message:"Authority status updated successfully", authority: updated}, {status:200});
    }
    catch(error){
        console.error("Error updating authority status:", error);
        return NextResponse.json({message:"Internal Server Error"}, {status:500});
    }


}
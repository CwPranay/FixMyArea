import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Issue from "@/models/issue";


export async function POST(req:Request){
try {
    await connectDB();
    const body=await req.json();
    const {title,description,createdBy,imageUrls,location } = body;
    if(!title || !description || !createdBy || !location){
        return NextResponse.json({message:"Missing required fields"}, {status:400});
    }

    const issue = await Issue.create({
        title,
        description,
        createdBy,
        images:imageUrls?.[0] || null,
        location:{
            type: "Point",
            coordinates: location.coordinates,
            address: location.address
        }
    })

    return NextResponse.json(issue,{status:201})
} catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json({message:"Internal Server Error"},{status:500});
    
}
}
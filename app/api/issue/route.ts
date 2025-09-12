// app/api/issue/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Issue from "@/models/issue";
import User from "@/models/user";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, description, createdBy, imageUrls, location } = body;
    
    console.log("Received data:", { title, description, createdBy, imageUrls, location });

    if (!title || !description || !location) {
      return NextResponse.json(
        { message: "Missing required fields: title, description, or location" },
        { status: 400 }
      );
    }

    // Validate coordinates
    if (!location.coordinates || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      return NextResponse.json(
        { message: "Invalid coordinates format" },
        { status: 400 }
      );
    }

    let createdById = null;
    let createdByType = "anonymous";
    let createdByName = "Anonymous";

    // Handle user identification
    if (createdBy && createdBy !== "Anonymous") {
      if (mongoose.Types.ObjectId.isValid(createdBy)) {
        // Check if user exists
        const user = await User.findById(createdBy);
        if (user) {
          createdById = createdBy;
          createdByType = "user";
          createdByName = user.name || user.email || "Authenticated User";
        }
      } else if (typeof createdBy === 'string') {
        createdByType = "guest";
        createdByName = createdBy;
      }
    }

    const issueData: any = {
      title,
      description,
      createdById,
      createdByType,
      createdByName,
      location: {
        type: "Point",
        coordinates: location.coordinates,
        address: location.address || "Unknown location"
      }
    };

    // Only add images if they exist
    if (imageUrls && imageUrls.length > 0) {
      issueData.images = imageUrls;
    }

    console.log("Creating issue with data:", issueData);

    const issue = await Issue.create(issueData);

    return NextResponse.json(issue, { status: 201 });

  } catch (error) {
    console.error("Error creating issue:", error);
    
    return NextResponse.json(
      { 
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET(){
  try {
    await connectDB();
    const issues =await Issue.find().sort({createdAt:-1});
    return NextResponse.json({issues},{status:200});

    
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json(
      {
        message:"Internal Server Error",

      },
      {status:500}

    )
  }
}
import { NextRequest, NextResponse } from "next/server";
import { utapi } from "@/utils/uploadthing";

export async function POST(request: NextRequest) {
  try {
    console.log("=== UPLOAD START ===");
    
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    console.log("Files received:", files.length);

    if (!files || files.length === 0) {
      console.log("No files provided");
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    console.log("Starting UploadThing upload...");

    // Upload files individually
    const uploadPromises = files.map(file => 
      utapi.uploadFiles(file) // Remove the second parameter entirely
    );

    const uploadResults = await Promise.all(uploadPromises);

    console.log("UploadThing response:", uploadResults);

    // Extract file information
    const uploadedFiles = uploadResults.map(result => ({
      url: result.data?.url,
      name: result.data?.name,
      key: result.data?.key
    }));

    return NextResponse.json({
      success: true,
      files: uploadedFiles
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
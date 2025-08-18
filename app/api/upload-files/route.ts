import { NextRequest, NextResponse } from "next/server";
import { utapi } from "@/utils/uploadthing";

export async function POST(request: NextRequest) {
  try {
    console.log("=== UPLOAD START ===");
    console.log("Environment check:", {
      hasToken: !!process.env.UPLOADTHING_TOKEN,
      tokenLength: process.env.UPLOADTHING_TOKEN?.length || 0
    });
    
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    console.log("Files received:", files.length);
    files.forEach((file, index) => {
      console.log(`File ${index + 1}:`, {
        name: file.name,
        size: file.size,
        type: file.type
      });
    });

    if (!files || files.length === 0) {
      console.log("No files provided");
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    console.log("Starting UploadThing upload...");

    // Upload files using UploadThing API
    const uploadResults = await utapi.uploadFiles(files, "authorityDocuments");

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
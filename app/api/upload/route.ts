// app/api/upload/route.ts
import { utapi } from "@/utils/uploadthing";
import { NextResponse } from "next/server";

export const maxDuration = 300; // 5 minutes for large files
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Validate files
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith("image/") || 
                         file.type === "application/pdf";
      const isValidSize = file.size <= 4 * 1024 * 1024; // 4MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      return NextResponse.json(
        { error: "Invalid file type or size (max 4MB)" },
        { status: 400 }
      );
    }

    // Upload files
    const response = await utapi.uploadFiles(validFiles);

    return NextResponse.json({
      success: true,
      files: response.map(res => ({
        url: res.data?.url,
        name: res.data?.name
      }))
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
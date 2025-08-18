// types/uploadthing.d.ts
import type { OurFileRouter } from "@/utils/uploadthing";

declare module "uploadthing/server" {
  interface CustomUTEvents {
    uploadComplete: {
      file: {
        url: string;
        name: string;
        size: number;
        type: string;
      };
      metadata: Record<string, unknown>;
    };
  }
}

declare module "uploadthing/next" {
  interface NextUploadthingRouter extends OurFileRouter {}
}
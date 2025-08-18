// lib/uploadthing.ts
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

// If you want to use the hooks
import { generateReactHelpers } from "@uploadthing/react";
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();
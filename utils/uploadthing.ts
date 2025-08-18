import { UTApi } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

export type OurFileRouter = typeof ourFileRouter;

// UTApi initialization with token
export const utapi = new UTApi({
  apiKey: process.env.UPLOADTHING_TOKEN
});
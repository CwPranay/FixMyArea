import { UTApi } from "uploadthing/server";

// UTApi initialization with token - CORRECTED
export const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN
});
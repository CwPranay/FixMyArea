import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  authorityDocuments: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    pdf: { maxFileSize: "4MB", maxFileCount: 5 }
  })
    .middleware(async () => {
      // You can add authentication logic here if needed
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload completed for:", file.name);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 
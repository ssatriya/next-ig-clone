import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { validateRequest } from "@/lib/auth/validate-request";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileCount: 4, maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const { user, session } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

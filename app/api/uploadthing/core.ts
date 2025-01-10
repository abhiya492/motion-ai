import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  videoOrAudioUploader: f({ video: { maxFileSize: "32MB" } })
    .middleware(async ({ req }) => {
      try {
        const user = await currentUser();

        console.log({ user });

        if (!user) throw new UploadThingError("Unauthorized");

        return { userId: user.id };
      } catch (error) {
        console.error("Error in videoOrAudioUploader middleware", error);
        throw new UploadThingError("Internal Server Error");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        console.log("Upload complete for userId:", metadata.userId);

        console.log("file url", file.url);

        return { userId: metadata.userId, file };
      } catch (error) {
        console.error("Error in onUploadComplete", error);
        throw new UploadThingError("Internal Server Error");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

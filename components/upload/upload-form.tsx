"use client";

import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/utils/uploadthing";
import {
  generateBlogPostAction,
  transcribeUploadedFile,
} from "@/actions/upload-actions";
import { currentUser } from "@clerk/nextjs/server";
import { getUserDailyCredits } from "@/lib/user-helpers";
import getDbConnection from "@/lib/db";
// Define the UploadResponse type
type UploadResponse = {
  fileUrl: string;
  fileKey: string;
}[];

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File size must not exceed 20MB"
    )
    .refine(
      (file) =>
        file.type.startsWith("audio/") || file.type.startsWith("video/"),
      "File must be an audio or a video file"
    ),
});

export default function UploadForm() {
  const { toast } = useToast();
  const { startUpload } = useUploadThing("videoOrAudioUploader", {
    onClientUploadComplete: () => {
      toast({ title: "uploaded successfully!" });
    },
    onUploadError: (err) => {
      console.error("Error occurred", err);
    },
    onUploadBegin: () => {
      toast({ title: "Upload has begun 🚀!" });
    },
  });

  const handleTranscribe = async (formData: FormData) => {
    const file = formData.get("file") as File;
    const validatedFields = schema.safeParse({ file });

    if (!validatedFields.success) {
      console.log(
        "validatedFields",
        validatedFields.error.flatten().fieldErrors
      );
      toast({
        title: "❌ Something went wrong",
        variant: "destructive",
        description:
          validatedFields.error.flatten().fieldErrors.file?.[0] ??
          "Invalid file",
      });
      return; // Early return on validation failure
    }

    const user = await currentUser();
    if (!user) {
      toast({
        title: "User not authenticated",
        description: "Please sign in to continue.",
        variant: "destructive",
      });
      return;
    }

    const userId = user.id;
    const sql = await getDbConnection();
    const remainingCredits = await getUserDailyCredits(sql, userId);

    if (remainingCredits <= 0) {
      toast({
        title: "Daily credit limit reached",
        description: "You have exhausted your daily credits. Please upgrade your plan.",
        variant: "destructive",
      });
      return;
    }

    if (file) {
      const resp = await startUpload([file]) as unknown as UploadResponse;
      console.log({ resp });
      
      if (!resp || resp.length === 0) {
        toast({
          title: "Something went wrong",
          description: "Please use a different file",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "🎙️ Transcription is in progress...",
        description:
          "Hang tight! Our digital wizards are sprinkling magic dust on your file! ✨",
      });

      const transformedResp = resp.map((file) => ({
        serverData: {
          userId: userId,
          file: {
            url: file.fileUrl,
            name: file.fileKey,
          },
        },
      }));

      if (!transformedResp || transformedResp.length === 0) {
        console.error("Error: resp is undefined or empty");
        toast({
          title: "Something went wrong",
          description: "Please use a different file",
          variant: "destructive",
        });
        return;
      }

      const result = await transcribeUploadedFile(transformedResp);
      const { data = null, message = null } = result || {};

      if (!result || (!data && !message)) {
        toast({
          title: "An unexpected error occurred",
          description:
            "An error occurred during transcription. Please try again.",
        });
        return;
      }

      if (data) {
        toast({
          title: "🤖 Generating AI blog post...",
          description: "Please wait while we generate your blog post.",
        });

        await generateBlogPostAction({
          transcriptions: data.transcriptions,
          userId: data.userId,
        });

        toast({
          title: "🎉 Woohoo! Your AI blog is created! 🎊",
          description:
            "Time to put on your editor hat, Click the post and edit it!",
        });

        // Decrement daily credits
        await fetch(`/api/decrement-credits?userId=${userId}`, {
          method: "POST",
        });

        // Update localStorage with the new credit count
        const newRemainingCredits = remainingCredits - 1;
        localStorage.setItem("dailyCredits", newRemainingCredits.toString());
      }
    }
  };

  return (
    <form className="flex flex-col gap-6" action={handleTranscribe}>
      <div className="flex justify-end items-center gap-1.5">
        <Input
          id="file"
          name="file"
          type="file"
          accept="audio/*,video/*"
          required
        />
        <Button className="bg-purple-600">Transcribe</Button>
      </div>
    </form>
  );
}

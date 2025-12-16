"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { LanguageSelector } from "../ui/language-selector";
import { TemplateSelector } from "../content/template-selector";
import { LanguageCode } from "@/lib/language-service";
import { ContentTemplate } from "@/types";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/utils/uploadthing";
import {
  generateBlogPostAction,
  transcribeUploadedFile,
} from "@/actions/upload-actions";

const useSchema = () => useMemo(() => z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 50 * 1024 * 1024,
      "File size must not exceed 50MB"
    )
    .refine(
      (file) =>
        file.type.startsWith("audio/") || file.type.startsWith("video/"),
      "File must be an audio or a video file"
    ),
}), []);

export default function EnhancedUploadForm() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>('en');
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate>();
  const schema = useSchema();

  useEffect(() => {
    fetch('/api/content/templates')
      .then(res => res.json())
      .then(setTemplates)
      .catch(console.error);
  }, []);

  const { startUpload, isUploading: uploadThingLoading } = useUploadThing("videoOrAudioUploader", {
    onClientUploadComplete: () => {
      toast({ title: "File uploaded successfully!" });
    },
    onUploadError: (err) => {
      console.error("Upload error:", err);
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: "Network timeout or file too large. Try a smaller file or check connection.",
        variant: "destructive",
      });
    },
    onUploadBegin: () => {
      setIsUploading(true);
      toast({ title: "Upload started 🚀" });
    },
  });

  const handleTranscribe = async (formData: FormData) => {
    if (isUploading || uploadThingLoading) return;
    
    const file = formData.get("file") as File;
    const validatedFields = schema.safeParse({ file });

    if (!validatedFields.success) {
      toast({
        title: "❌ Invalid file",
        variant: "destructive",
        description: validatedFields.error.flatten().fieldErrors.file?.[0] ?? "Please check file format and size",
      });
      return;
    }

    try {
      setIsUploading(true);
      const resp = await startUpload([file]);
      
      if (!resp || !resp.length) {
        throw new Error("Upload failed - no response");
      }

      toast({
        title: "🎙️ Processing audio...",
        description: "Transcribing your file with AI",
      });

      const result = await transcribeUploadedFile(resp);
      
      if (!result?.success) {
        throw new Error(result?.message || "Transcription failed");
      }

      if (result.data) {
        toast({
          title: "🤖 Creating blog post...",
          description: selectedTemplate ? `Using ${selectedTemplate.name} template` : "Generating content with AI",
        });

        await generateBlogPostAction({
          transcriptions: result.data.transcriptions,
          userId: result.data.userId,
          targetLanguage,
          template: selectedTemplate?.prompt_template,
        });

        toast({
          title: "🎉 Blog post created!",
          description: "Ready for editing",
        });
      }
    } catch (error) {
      console.error("Process error:", error);
      toast({
        title: "Process failed",
        description: error instanceof Error ? error.message : "Please try again with a smaller file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form className="flex flex-col gap-6" action={handleTranscribe}>
      <div className="flex flex-col gap-6">
        {templates.length > 0 && (
          <TemplateSelector
            templates={templates}
            selectedTemplate={selectedTemplate}
            onSelect={setSelectedTemplate}
          />
        )}
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Output Language:</label>
          <LanguageSelector 
            selectedLanguage={targetLanguage}
            onLanguageChange={setTargetLanguage}
          />
        </div>
        
        <div className="flex justify-end items-center gap-1.5">
          <Input
            id="file"
            name="file"
            type="file"
            accept="audio/*,video/*"
            required
          />
          <Button 
            className="bg-purple-700" 
            disabled={isUploading || uploadThingLoading}
          >
            {isUploading || uploadThingLoading ? "Processing..." : "Transcribe"}
          </Button>
        </div>
      </div>
    </form>
  );
}
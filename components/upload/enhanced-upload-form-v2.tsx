"use client";

import { useState, useCallback } from "react";
import { LanguageSelector } from "../ui/language-selector";
import { LanguageCode } from "@/lib/language-service";
import { z } from "zod";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/utils/uploadthing";
import { generateBlogPostAction, transcribeUploadedFile } from "@/actions/upload-actions";
import DragDropZone from "./drag-drop-zone";
import ProcessingStatus from "./processing-status";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine((file) => file.size <= 50 * 1024 * 1024, "File size must not exceed 50MB")
    .refine(
      (file) => file.type.startsWith("audio/") || file.type.startsWith("video/"),
      "File must be an audio or a video file"
    ),
});

interface EnhancedUploadFormV2Props {
  selectedTemplate?: any;
}

export default function EnhancedUploadFormV2({ selectedTemplate }: EnhancedUploadFormV2Props) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>('en');

  const { startUpload, isUploading } = useUploadThing("videoOrAudioUploader", {
    onClientUploadComplete: () => {
      setCurrentStep("transcribe");
      toast({ title: "File uploaded successfully!" });
    },
    onUploadError: (err) => {
      console.error("Upload error:", err);
      setIsProcessing(false);
      toast({
        title: "Upload failed",
        description: "Network timeout or file too large. Try a smaller file.",
        variant: "destructive",
      });
    },
    onUploadBegin: () => {
      setCurrentStep("upload");
      toast({ title: "Upload started 🚀" });
    },
  });

  const handleFileSelect = useCallback((file: File) => {
    const validation = schema.safeParse({ file });
    if (!validation.success) {
      toast({
        title: "❌ Invalid file",
        variant: "destructive",
        description: validation.error.flatten().fieldErrors.file?.[0] ?? "Please check file format and size",
      });
      return;
    }
    setSelectedFile(file);
  }, [toast]);

  const handleProcess = async () => {
    if (!selectedFile || isProcessing) return;

    try {
      setIsProcessing(true);
      const resp = await startUpload([selectedFile]);
      
      if (!resp || !resp.length) {
        throw new Error("Upload failed - no response");
      }

      setCurrentStep("transcribe");
      const result = await transcribeUploadedFile(resp);
      
      if (!result?.success) {
        throw new Error(result?.message || "Transcription failed");
      }

      if (result.data) {
        setCurrentStep("generate");
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
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setCurrentStep("");
      setSelectedFile(null);
    }
  };

  return (
    <div className="space-y-6">
      <ProcessingStatus isProcessing={isProcessing} currentStep={currentStep} />
      
      {!isProcessing && (
        <>
          <DragDropZone onFileSelect={handleFileSelect} isUploading={isUploading} />
          
          {selectedFile && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
                <Button onClick={() => setSelectedFile(null)} variant="outline" size="sm">
                  Remove
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Output Language:</label>
              <LanguageSelector 
                selectedLanguage={targetLanguage}
                onLanguageChange={setTargetLanguage}
              />
            </div>
            
            <Button 
              onClick={handleProcess}
              disabled={!selectedFile || isProcessing}
              className="bg-purple-700 hover:bg-purple-800"
            >
              {isProcessing ? "Processing..." : "Create Blog Post"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
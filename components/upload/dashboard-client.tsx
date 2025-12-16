"use client";

import { useState } from "react";
import EnhancedUploadFormV2 from "./enhanced-upload-form-v2";
import SmartRecommendations from "./smart-recommendations";

interface DashboardClientProps {
  userId: string;
  canUpload: boolean;
}

export default function DashboardClient({ userId, canUpload }: DashboardClientProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<any>();

  return (
    <>
      <SmartRecommendations 
        userId={userId}
        onTemplateSelect={setSelectedTemplate}
      />
      
      {canUpload && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            {selectedTemplate ? `Create ${selectedTemplate.name}` : 'Upload Your Content'}
          </h2>
          <EnhancedUploadFormV2 selectedTemplate={selectedTemplate} />
        </div>
      )}
    </>
  );
}
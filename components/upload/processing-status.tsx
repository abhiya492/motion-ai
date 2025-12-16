"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Upload, FileText, Sparkles } from "lucide-react";

interface ProcessingStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  duration: number;
}

interface ProcessingStatusProps {
  isProcessing: boolean;
  currentStep?: string;
}

const PROCESSING_STEPS: ProcessingStep[] = [
  { id: 'upload', label: 'Uploading file', icon: <Upload className="w-4 h-4" />, duration: 3000 },
  { id: 'transcribe', label: 'Transcribing audio', icon: <FileText className="w-4 h-4" />, duration: 8000 },
  { id: 'generate', label: 'Generating blog post', icon: <Sparkles className="w-4 h-4" />, duration: 5000 },
];

export default function ProcessingStatus({ isProcessing, currentStep }: ProcessingStatusProps) {
  const [progress, setProgress] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (!isProcessing) {
      setProgress(0);
      setActiveStepIndex(0);
      return;
    }

    const currentStepObj = PROCESSING_STEPS.find(step => step.id === currentStep);
    const stepIndex = currentStepObj ? PROCESSING_STEPS.indexOf(currentStepObj) : 0;
    setActiveStepIndex(stepIndex);

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isProcessing, currentStep]);

  if (!isProcessing) return null;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-purple-600 animate-spin" />
          <h3 className="text-lg font-semibold text-gray-800">Processing your content...</h3>
        </div>

        <Progress value={progress} className="h-2" />
        
        <div className="space-y-3">
          {PROCESSING_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                index < activeStepIndex ? 'bg-green-100' : 
                index === activeStepIndex ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                {index < activeStepIndex ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <div className={`${
                    index === activeStepIndex ? 'text-purple-600' : 'text-gray-400'
                  }`}>
                    {step.icon}
                  </div>
                )}
              </div>
              <span className={`text-sm ${
                index <= activeStepIndex ? 'text-gray-800 font-medium' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 text-center">
          Estimated time: {Math.ceil((PROCESSING_STEPS.reduce((acc, step) => acc + step.duration, 0) - (progress * 160)) / 1000)}s remaining
        </p>
      </div>
    </div>
  );
}
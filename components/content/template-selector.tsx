"use client";

import { useState } from "react";
import { ContentTemplate } from "@/types";
import { Button } from "@/components/ui/button";

interface TemplateSelectorProps {
  templates: ContentTemplate[];
  onSelect: (template: ContentTemplate) => void;
  selectedTemplate?: ContentTemplate;
}

export function TemplateSelector({ templates, onSelect, selectedTemplate }: TemplateSelectorProps) {
  const templateIcons = {
    tutorial: "📚",
    review: "⭐",
    news: "📰",
    personal: "✍️"
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose Content Template</h3>
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => (
          <Button
            key={template.id}
            variant={selectedTemplate?.id === template.id ? "default" : "outline"}
            className="h-auto p-4 flex flex-col items-start space-y-2"
            onClick={() => onSelect(template)}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">{templateIcons[template.type]}</span>
              <span className="font-medium">{template.name}</span>
            </div>
            <p className="text-sm text-muted-foreground text-left">
              {template.type.charAt(0).toUpperCase() + template.type.slice(1)} format
            </p>
          </Button>
        ))}
      </div>
    </div>
  );
}
"use client";

import { Badge } from "@/components/ui/badge";

interface PredictionBadgesProps {
  predictions: any;
  className?: string;
}

export default function PredictionBadges({ predictions, className }: PredictionBadgesProps) {
  if (!predictions || !Array.isArray(predictions) || predictions.length === 0) {
    return <Badge variant="outline" className={className}>No prediction</Badge>;
  }

  return (
    <div className={`flex flex-wrap gap-1 w-full ${className || ''}`}>
      {predictions.map((prediction, index) => {
        // Handle different prediction formats
        let label: string;
        let confidence: number = 0;

        if (typeof prediction === 'string') {
          label = prediction;
        } else if (prediction && typeof prediction === 'object') {
          label = prediction.class || prediction.label || prediction.name || 'Unknown';
          confidence = prediction.confidence || prediction.score || 0;
        } else {
          label = String(prediction);
        }

        const confidencePercent = Math.round(confidence * 100);
        
        return (
          <Badge
            key={index}
            variant={confidencePercent > 70 ? "default" : confidencePercent > 40 ? "secondary" : "outline"}
            className="text-xs px-1 py-0.5"
          >
            {label}
            {confidence > 0 && (
              <span className="ml-1 opacity-75">
                ({confidencePercent}%)
              </span>
            )}
          </Badge>
        );
      })}
    </div>
  );
}

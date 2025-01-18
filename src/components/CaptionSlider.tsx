import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CaptionSliderProps {
  captions: string[];
}

export const CaptionSlider = ({ captions }: CaptionSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCaption = () => {
    setCurrentIndex((prev) => (prev + 1) % captions.length);
  };

  const prevCaption = () => {
    setCurrentIndex((prev) => (prev - 1 + captions.length) % captions.length);
  };

  return (
    <div className="caption-slider">
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevCaption}
          className="rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="text-xl font-medium text-center animate-fade-in">
          {captions[currentIndex]}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextCaption}
          className="rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex justify-center mt-4 gap-1">
        {captions.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 w-8 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "bg-primary" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
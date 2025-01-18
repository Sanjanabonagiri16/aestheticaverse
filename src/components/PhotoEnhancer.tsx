import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { 
  Crop, 
  SunMedium, 
  Contrast, 
  ImagePlus,
  Check
} from "lucide-react";

export const PhotoEnhancer = () => {
  const [brightness, setBrightness] = useState([50]);
  const [contrast, setContrast] = useState([50]);

  const suggestions = [
    {
      id: 1,
      type: "crop",
      icon: <Crop className="h-4 w-4" />,
      text: "Try a 4:5 ratio for better Instagram feed presence",
    },
    {
      id: 2,
      type: "brightness",
      icon: <SunMedium className="h-4 w-4" />,
      text: "Increase brightness by 10% to enhance details",
    },
    {
      id: 3,
      type: "contrast",
      icon: <Contrast className="h-4 w-4" />,
      text: "Adjust contrast to make colors pop",
    },
  ];

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Photo Enhancement</h3>
        <Badge variant="outline" className="gap-1">
          <ImagePlus className="h-4 w-4" />
          AI Powered
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-white/30 backdrop-blur-sm"
            >
              {suggestion.icon}
              <span className="text-sm">{suggestion.text}</span>
              <Check className="h-4 w-4 ml-auto text-green-500" />
            </div>
          ))}
        </div>

        <div className="space-y-4 mt-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Brightness</label>
              <span className="text-sm text-gray-500">{brightness}%</span>
            </div>
            <Slider
              value={brightness}
              onValueChange={setBrightness}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Contrast</label>
              <span className="text-sm text-gray-500">{contrast}%</span>
            </div>
            <Slider
              value={contrast}
              onValueChange={setContrast}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Crop, 
  SunMedium, 
  Contrast, 
  ImagePlus,
  Upload,
  Check,
  Loader2
} from "lucide-react";

export const PhotoEnhancer = () => {
  const [brightness, setBrightness] = useState([50]);
  const [contrast, setContrast] = useState([50]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["photo-suggestions", imageUrl],
    queryFn: async () => {
      if (!imageUrl) return null;
      
      const response = await fetch('/api/analyze-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      });
      
      if (!response.ok) throw new Error('Failed to analyze photo');
      return response.json();
    },
    enabled: !!imageUrl
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('photos')
        .upload(fileName, file);

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

      setImageUrl(publicUrl);
      return publicUrl;
    },
    onSuccess: () => {
      toast.success("Photo uploaded successfully!");
    },
    onError: (error) => {
      toast.error("Failed to upload photo: " + error.message);
    }
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      uploadMutation.mutate(file);
    }
  };

  const enhancementSuggestions = [
    {
      id: 1,
      type: "crop",
      icon: <Crop className="h-4 w-4" />,
      text: suggestions?.suggestions?.crop || "Upload an image for crop suggestions",
    },
    {
      id: 2,
      type: "brightness",
      icon: <SunMedium className="h-4 w-4" />,
      text: suggestions?.suggestions?.brightness || "Upload an image for brightness suggestions",
    },
    {
      id: 3,
      type: "contrast",
      icon: <Contrast className="h-4 w-4" />,
      text: suggestions?.suggestions?.contrast || "Upload an image for contrast suggestions",
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
        <div className="flex justify-center p-4 border-2 border-dashed rounded-lg">
          <div className="text-center">
            <input
              type="file"
              id="photo-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="photo-upload"
              className="cursor-pointer inline-flex items-center gap-2"
            >
              {uploadMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              <span>Upload Photo</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          {enhancementSuggestions.map((suggestion) => (
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
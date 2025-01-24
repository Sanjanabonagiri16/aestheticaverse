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
  Loader2,
  Sparkles,
  Camera
} from "lucide-react";

export const PhotoEnhancer = () => {
  const [brightness, setBrightness] = useState([50]);
  const [contrast, setContrast] = useState([50]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { data: analysis, isLoading: isAnalyzing } = useQuery({
    queryKey: ["photo-analysis", imageUrl],
    queryFn: async () => {
      if (!imageUrl) return null;
      
      const response = await supabase.functions.invoke('analyze-photo', {
        body: { imageUrl }
      });

      if (response.error) throw new Error('Failed to analyze photo');
      return response.data;
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

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">AI Photo Enhancement</h3>
        <Badge variant="outline" className="gap-1">
          <Sparkles className="h-4 w-4" />
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

        {imageUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img 
              src={imageUrl} 
              alt="Uploaded photo"
              className="object-cover w-full h-full"
              style={{
                filter: `brightness(${brightness}%) contrast(${contrast}%)`
              }}
            />
          </div>
        )}

        {isAnalyzing ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Analyzing image...</span>
          </div>
        ) : analysis?.suggestions ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 p-4 bg-white/30 rounded-lg">
                <h4 className="font-medium">Scene Detection</h4>
                {analysis.suggestions.scene.map((scene, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    <span>{scene.label}</span>
                    <span className="text-sm text-gray-500">
                      {Math.round(scene.confidence * 100)}%
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 p-4 bg-white/30 rounded-lg">
                <h4 className="font-medium">Mood Detection</h4>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>{analysis.suggestions.emotion}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Suggested Captions</h4>
              {analysis.suggestions.suggestedCaptions.map((caption, index) => (
                <div
                  key={index}
                  className="p-3 bg-white/30 rounded-lg flex items-start gap-2"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-1 shrink-0"
                    onClick={() => {
                      navigator.clipboard.writeText(caption);
                      toast.success("Caption copied to clipboard!");
                    }}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <p className="text-sm">{caption}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Brightness</label>
                  <span className="text-sm text-gray-500">{brightness}%</span>
                </div>
                <Slider
                  value={brightness}
                  onValueChange={setBrightness}
                  max={200}
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
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
};
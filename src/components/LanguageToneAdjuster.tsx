import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LanguageToneAdjusterProps {
  onToneChange: (tone: number) => void;
  onStyleChange: (style: string) => void;
  currentTone: number;
  currentStyle: string;
}

export const LanguageToneAdjuster = ({
  onToneChange,
  onStyleChange,
  currentTone,
  currentStyle,
}: LanguageToneAdjusterProps) => {
  const [loading, setLoading] = useState(false);

  const styles = [
    { value: "casual", label: "Casual" },
    { value: "formal", label: "Formal" },
    { value: "poetic", label: "Poetic" },
    { value: "professional", label: "Professional" },
  ];

  const savePreferences = async (tone: number, style: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to save preferences");
        return;
      }

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preferred_tone: tone.toString(),
          preferred_style: style,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      toast.success("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleToneChange = (value: number[]) => {
    onToneChange(value[0]);
    savePreferences(value[0], currentStyle);
  };

  const handleStyleChange = (value: string) => {
    onStyleChange(value);
    savePreferences(currentTone, value);
  };

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('user_preferences')
          .select('preferred_tone, preferred_style')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (data) {
          onToneChange(parseInt(data.preferred_tone || '50'));
          onStyleChange(data.preferred_style || 'casual');
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    };

    loadPreferences();
  }, []);

  return (
    <div className="space-y-6 p-4 bg-white/50 backdrop-blur-sm rounded-lg">
      <div className="space-y-2">
        <Label>Tone Intensity</Label>
        <Slider
          defaultValue={[currentTone]}
          max={100}
          step={1}
          onValueChange={handleToneChange}
          className="w-full"
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label>Writing Style</Label>
        <Select 
          value={currentStyle} 
          onValueChange={handleStyleChange}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            {styles.map((style) => (
              <SelectItem key={style.value} value={style.value}>
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
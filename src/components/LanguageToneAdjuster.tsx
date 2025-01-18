import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const styles = [
    { value: "casual", label: "Casual" },
    { value: "formal", label: "Formal" },
    { value: "poetic", label: "Poetic" },
    { value: "professional", label: "Professional" },
  ];

  return (
    <div className="space-y-6 p-4 bg-white/50 backdrop-blur-sm rounded-lg">
      <div className="space-y-2">
        <Label>Tone Intensity</Label>
        <Slider
          defaultValue={[currentTone]}
          max={100}
          step={1}
          onValueChange={(value) => onToneChange(value[0])}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label>Writing Style</Label>
        <Select value={currentStyle} onValueChange={onStyleChange}>
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
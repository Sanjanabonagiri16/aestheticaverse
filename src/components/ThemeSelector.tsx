import { Button } from "@/components/ui/button";
import { Camera, Mountain, Building, Coffee } from "lucide-react";

const themes = [
  { id: "travel", label: "Travel", icon: Mountain },
  { id: "urban", label: "Urban", icon: Building },
  { id: "minimal", label: "Minimal", icon: Coffee },
  { id: "portrait", label: "Portrait", icon: Camera },
];

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeSelect: (theme: string) => void;
}

export const ThemeSelector = ({
  selectedTheme,
  onThemeSelect,
}: ThemeSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {themes.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          onClick={() => onThemeSelect(id)}
          className={`theme-button ${selectedTheme === id ? "active" : ""}`}
          variant={selectedTheme === id ? "default" : "outline"}
        >
          <Icon className="mr-2 h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  );
};
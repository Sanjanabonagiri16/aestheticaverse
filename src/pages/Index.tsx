import { useState } from "react";
import { CaptionSlider } from "@/components/CaptionSlider";
import { ThemeSelector } from "@/components/ThemeSelector";
import { LanguageSelect } from "@/components/LanguageSelect";
import { HashtagManager } from "@/components/HashtagManager";
import { LanguageToneAdjuster } from "@/components/LanguageToneAdjuster";
import { FeedbackButton } from "@/components/FeedbackButton";
import { Button } from "@/components/ui/button";
import { BookmarkPlus } from "lucide-react";
import { toast } from "sonner";

// Temporary captions for demonstration
const dummyCaptions = [
  "Chasing dreams under city lights ✨",
  "Living life one adventure at a time 🌎",
  "Finding beauty in the everyday moments 🌟",
  "Creating memories that last forever 📸",
];

const Index = () => {
  const [selectedTheme, setSelectedTheme] = useState("travel");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [toneSetting, setToneSetting] = useState(50);
  const [writingStyle, setWritingStyle] = useState("casual");

  const handleSave = () => {
    toast.success("Caption saved to your collection!");
  };

  const handleFeedback = (isPositive: boolean) => {
    // In a real implementation, this would send feedback to the backend
    console.log("Feedback received:", isPositive);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-violet-50 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent">
            AestheticaVerse
          </h1>
          <p className="text-gray-600">
            Discover the perfect caption for your moments
          </p>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <LanguageSelect
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            />
            <div className="flex gap-4 items-center">
              <FeedbackButton onFeedback={handleFeedback} />
              <Button onClick={handleSave} className="gap-2">
                <BookmarkPlus className="h-4 w-4" />
                Save Caption
              </Button>
            </div>
          </div>

          <ThemeSelector
            selectedTheme={selectedTheme}
            onThemeSelect={setSelectedTheme}
          />

          <CaptionSlider captions={dummyCaptions} />

          <LanguageToneAdjuster
            currentTone={toneSetting}
            currentStyle={writingStyle}
            onToneChange={setToneSetting}
            onStyleChange={setWritingStyle}
          />
        </div>

        <HashtagManager />
      </div>
    </div>
  );
};

export default Index;
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, RefreshCw, Copy } from "lucide-react";
import { toast } from "sonner";

// Temporary meme captions for demonstration
const memeCaptions = [
  "When you try to be aesthetic but end up looking like a potato 🥔",
  "Instagram vs Reality: My feed is curated, my life is complicated 😅",
  "POV: Me pretending I woke up like this ✨",
  "That moment when you take 500 photos to get the perfect 'candid' shot 📸",
  "My aesthetic is basically just coffee cups and sunset pics at this point ☕️",
];

export const MemeCaptionGenerator = () => {
  const [currentCaption, setCurrentCaption] = useState(memeCaptions[0]);

  const generateNewCaption = () => {
    const randomIndex = Math.floor(Math.random() * memeCaptions.length);
    setCurrentCaption(memeCaptions[randomIndex]);
    toast.success("Generated new meme caption!");
  };

  const copyCaption = () => {
    navigator.clipboard.writeText(currentCaption);
    toast.success("Meme caption copied to clipboard!");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smile className="h-5 w-5" />
          Meme Caption Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 p-6 rounded-lg text-center">
          <p className="text-lg font-medium">{currentCaption}</p>
        </div>
        
        <div className="flex gap-3 justify-center">
          <Button onClick={generateNewCaption} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Generate New
          </Button>
          <Button variant="outline" onClick={copyCaption} className="gap-2">
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
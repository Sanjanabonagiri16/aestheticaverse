import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bookmark, Grid, Folder } from "lucide-react";
import { toast } from "sonner";

interface SavedCaption {
  id: string;
  text: string;
  category: string;
}

export const CaptionMoodBoard = () => {
  const [savedCaptions, setSavedCaptions] = useState<SavedCaption[]>([
    {
      id: "1",
      text: "Chasing dreams under city lights ✨",
      category: "Urban",
    },
    {
      id: "2",
      text: "Living life one adventure at a time 🌎",
      category: "Travel",
    },
    {
      id: "3",
      text: "Finding beauty in the everyday moments 🌟",
      category: "Lifestyle",
    },
  ]);

  const categories = ["All", "Urban", "Travel", "Lifestyle"];

  const handleSaveCaption = (caption: string, category: string) => {
    const newCaption: SavedCaption = {
      id: Date.now().toString(),
      text: caption,
      category,
    };
    setSavedCaptions([...savedCaptions, newCaption]);
    toast.success("Caption saved to mood board!");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          Caption Mood Board
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="All" className="w-full">
          <TabsList className="w-full justify-start">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="gap-2">
                {category === "All" ? <Grid className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedCaptions
                  .filter((caption) => category === "All" || caption.category === category)
                  .map((caption) => (
                    <Card key={caption.id} className="bg-muted/50">
                      <CardContent className="p-4">
                        <p className="text-sm">{caption.text}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-muted-foreground">{caption.category}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(caption.text);
                              toast.success("Caption copied to clipboard!");
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
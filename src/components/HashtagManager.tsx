import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, TrendingUp, Hash, MapPin } from "lucide-react";
import { toast } from "sonner";

interface Hashtag {
  id: string;
  text: string;
  category: "trending" | "engagement" | "niche";
  engagement?: number;
}

// Temporary mock data until API integration
const mockHashtags: Hashtag[] = [
  { id: "1", text: "aestheticfeed", category: "trending", engagement: 1200 },
  { id: "2", text: "moodboard", category: "trending", engagement: 980 },
  { id: "3", text: "minimalstyle", category: "engagement", engagement: 750 },
  { id: "4", text: "aestheticverse", category: "niche", engagement: 250 },
];

export const HashtagManager = () => {
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

  const handleHashtagSelect = (hashtag: string) => {
    if (selectedHashtags.includes(hashtag)) {
      setSelectedHashtags(selectedHashtags.filter((h) => h !== hashtag));
    } else {
      if (selectedHashtags.length >= 30) {
        toast.warning("Maximum 30 hashtags allowed");
        return;
      }
      setSelectedHashtags([...selectedHashtags, hashtag]);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedHashtags.map(tag => `#${tag}`).join(" "));
    toast.success("Hashtags copied to clipboard!");
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent">
          Hashtag Manager
        </h2>
        <Button onClick={copyToClipboard} className="gap-2">
          <Hash className="h-4 w-4" />
          Copy Selected ({selectedHashtags.length})
        </Button>
      </div>

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trending" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="engagement">High Engagement</TabsTrigger>
          <TabsTrigger value="niche">Niche</TabsTrigger>
        </TabsList>

        {["trending", "engagement", "niche"].map((category) => (
          <TabsContent key={category} value={category}>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="flex flex-wrap gap-2">
                {mockHashtags
                  .filter((hashtag) => hashtag.category === category)
                  .map((hashtag) => (
                    <Badge
                      key={hashtag.id}
                      variant={selectedHashtags.includes(hashtag.text) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/90 transition-colors"
                      onClick={() => handleHashtagSelect(hashtag.text)}
                    >
                      #{hashtag.text}
                      {hashtag.engagement && (
                        <span className="ml-2 text-xs opacity-70">
                          {hashtag.engagement}k
                        </span>
                      )}
                    </Badge>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Selected Hashtags</h3>
        <div className="flex flex-wrap gap-2">
          {selectedHashtags.map((tag) => (
            <Badge
              key={tag}
              variant="default"
              className="cursor-pointer"
              onClick={() => handleHashtagSelect(tag)}
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
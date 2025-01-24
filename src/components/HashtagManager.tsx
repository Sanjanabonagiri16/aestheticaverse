import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, TrendingUp, Hash, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Hashtag {
  id: string;
  text: string;
  category: "trending" | "engagement" | "niche";
  engagement?: number;
}

export const HashtagManager = () => {
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

  const { data: hashtagData, isLoading } = useQuery({
    queryKey: ["hashtag-performance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hashtag_performance")
        .select("id, hashtag, category, avg_engagement")
        .order("avg_engagement", { ascending: false });

      if (error) throw error;
      return data.map(tag => ({
        id: tag.id,
        text: tag.hashtag,
        category: tag.category || "niche",
        engagement: Math.round(tag.avg_engagement || 0)
      }));
    }
  });

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

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

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
                {hashtagData
                  ?.filter((hashtag) => hashtag.category === category)
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
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const PostTracker = () => {
  const [caption, setCaption] = useState("");
  const [likes, setLikes] = useState("");
  const [comments, setComments] = useState("");
  const [shares, setShares] = useState("");
  
  const queryClient = useQueryClient();

  const { mutate: addPost, isPending } = useMutation({
    mutationFn: async (postData: {
      caption: string;
      likes: number;
      comments: number;
      shares: number;
    }) => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("User must be authenticated to track posts");
      }

      const engagementScore = postData.likes + (postData.comments * 2) + (postData.shares * 3);
      
      const { error } = await supabase
        .from("post_engagement")
        .insert({
          caption: postData.caption,
          likes: postData.likes,
          comments: postData.comments,
          shares: postData.shares,
          engagement_score: engagementScore,
          posted_at: new Date().toISOString(),
          user_id: user.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Post engagement tracked successfully!");
      setCaption("");
      setLikes("");
      setComments("");
      setShares("");
      queryClient.invalidateQueries({ queryKey: ["post-engagement"] });
    },
    onError: (error) => {
      toast.error("Failed to track post engagement: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const likesNum = parseInt(likes);
    const commentsNum = parseInt(comments);
    const sharesNum = parseInt(shares);

    if (!caption) {
      toast.error("Please enter a caption");
      return;
    }

    if (isNaN(likesNum) || isNaN(commentsNum) || isNaN(sharesNum)) {
      toast.error("Please enter valid numbers for engagement metrics");
      return;
    }

    addPost({
      caption,
      likes: likesNum,
      comments: commentsNum,
      shares: sharesNum,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Track Post Engagement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="caption">Post Caption</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter your post caption..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="likes">Likes</Label>
              <Input
                id="likes"
                type="number"
                min="0"
                value={likes}
                onChange={(e) => setLikes(e.target.value)}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Input
                id="comments"
                type="number"
                min="0"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shares">Shares</Label>
              <Input
                id="shares"
                type="number"
                min="0"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Tracking..." : "Track Engagement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
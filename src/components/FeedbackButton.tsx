import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FeedbackButtonProps {
  onFeedback: (isPositive: boolean) => void;
  caption: string;
}

export const FeedbackButton = ({ onFeedback, caption }: FeedbackButtonProps) => {
  const handleFeedback = async (isPositive: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to provide feedback");
        return;
      }

      const { error } = await supabase
        .from('caption_feedback')
        .insert({
          user_id: user.id,
          caption,
          is_positive: isPositive,
          feedback_type: isPositive ? 'like' : 'dislike'
        });

      if (error) throw error;

      onFeedback(isPositive);
      toast.success(
        isPositive
          ? "Thanks for the positive feedback!"
          : "Thanks for helping us improve!"
      );
    } catch (error) {
      console.error("Error saving feedback:", error);
      toast.error("Failed to save feedback");
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleFeedback(true)}
        className="rounded-full hover:bg-green-50"
      >
        <ThumbsUp className="h-4 w-4 text-green-600" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleFeedback(false)}
        className="rounded-full hover:bg-red-50"
      >
        <ThumbsDown className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  );
};
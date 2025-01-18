import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";

interface FeedbackButtonProps {
  onFeedback: (isPositive: boolean) => void;
}

export const FeedbackButton = ({ onFeedback }: FeedbackButtonProps) => {
  const handleFeedback = (isPositive: boolean) => {
    onFeedback(isPositive);
    toast.success(
      isPositive
        ? "Thanks for the positive feedback!"
        : "Thanks for helping us improve!"
    );
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
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export const EngagementPredictor = () => {
  const { data: engagementData, isLoading } = useQuery({
    queryKey: ["post-engagement"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_engagement")
        .select("caption, engagement_score")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data.map(post => ({
        caption: post.caption,
        engagement: post.engagement_score
      }));
    }
  });

  const config = {
    engagement: {
      color: "#8b5cf6",
    },
  };

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-4">Engagement Prediction</h3>
      <div className="h-64">
        <ChartContainer config={config}>
          <BarChart 
            data={engagementData} 
            margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
          >
            <XAxis
              dataKey="caption"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Bar
              dataKey="engagement"
              fill="var(--color-engagement)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip />
          </BarChart>
        </ChartContainer>
      </div>
    </Card>
  );
};
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis } from "recharts";
import { Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export const OptimalTimePredictor = () => {
  const { data: timeData, isLoading } = useQuery({
    queryKey: ["posting-times"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posting_times")
        .select("hour_of_day, engagement_score")
        .order("engagement_score", { ascending: false });

      if (error) throw error;
      return data.map(time => ({
        time: `${time.hour_of_day}:00`,
        engagement: Math.round(time.engagement_score)
      }));
    }
  });

  const config = {
    optimal: {
      color: "rgba(139, 92, 246, 0.5)",
    },
  };

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  const bestTime = timeData && timeData.length > 0 
    ? timeData[0].time 
    : "Loading...";

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Optimal Posting Time</h3>
        <div className="flex items-center gap-2 text-sm text-violet-600">
          <Clock className="h-4 w-4" />
          <span>Best time: {bestTime}</span>
        </div>
      </div>
      <div className="h-64">
        <ChartContainer config={config}>
          <AreaChart 
            data={timeData} 
            margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
          >
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Area
              type="monotone"
              dataKey="engagement"
              stroke="#8b5cf6"
              fill="var(--color-optimal)"
            />
            <ChartTooltip />
          </AreaChart>
        </ChartContainer>
      </div>
    </Card>
  );
};
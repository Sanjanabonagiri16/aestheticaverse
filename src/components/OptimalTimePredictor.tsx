import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Clock } from "lucide-react";

const mockTimeData = [
  { time: "6AM", engagement: 20 },
  { time: "9AM", engagement: 45 },
  { time: "12PM", engagement: 65 },
  { time: "3PM", engagement: 80 },
  { time: "6PM", engagement: 95 },
  { time: "9PM", engagement: 75 },
  { time: "12AM", engagement: 40 },
];

const config = {
  optimal: {
    color: "rgba(139, 92, 246, 0.5)",
  },
};

export const OptimalTimePredictor = () => {
  const bestTime = "6:00 PM";
  
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
          <AreaChart data={mockTimeData} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
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
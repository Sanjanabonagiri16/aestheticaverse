import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const mockEngagementData = [
  { caption: "City lights ✨", engagement: 85 },
  { caption: "Morning vibes ☀️", engagement: 72 },
  { caption: "Weekend mood 🌊", engagement: 68 },
  { caption: "Coffee time ☕", engagement: 63 },
];

const config = {
  engagement: {
    color: "#8b5cf6",
  },
};

export const EngagementPredictor = () => {
  return (
    <Card className="p-6 bg-white/50 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-4">Engagement Prediction</h3>
      <div className="h-64">
        <ChartContainer config={config}>
          <BarChart data={mockEngagementData} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
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
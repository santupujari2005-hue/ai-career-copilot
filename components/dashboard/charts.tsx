"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { cn, getScoreColor } from "@/lib/utils";

interface ScoreChartProps {
  score: number;
  className?: string;
}

export function ScoreChart({ score, className }: ScoreChartProps) {
  const data = [{ name: "Score", value: score, fill: "var(--primary)" }];

  return (
    <div className={cn("relative", className)}>
      <ResponsiveContainer width="100%" height={200}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          barSize={12}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar background dataKey="value" cornerRadius={10} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-4xl font-bold", getScoreColor(score))}>
          {score}
        </span>
        <span className="text-sm text-muted-foreground">Resume Score</span>
      </div>
    </div>
  );
}

interface SkillsChartProps {
  data: { name: string; completed: number; total: number }[];
}

export function SkillsChart({ data }: SkillsChartProps) {
  const chartData = data.map((d) => ({
    name: d.name.length > 12 ? d.name.slice(0, 12) + "..." : d.name,
    progress: d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
        No skill data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="progress" fill="var(--primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

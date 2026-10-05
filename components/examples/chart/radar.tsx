"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { skill: "Speed", current: 82, target: 90 },
  { skill: "Quality", current: 74, target: 85 },
  { skill: "Reach", current: 61, target: 70 },
  { skill: "Retention", current: 88, target: 85 },
  { skill: "Support", current: 69, target: 80 },
  { skill: "Pricing", current: 77, target: 75 },
]

const chartConfig = {
  current: {
    label: "Current",
    color: "var(--chart-1)",
  },
  target: {
    label: "Target",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function ChartRadar() {
  return (
    <ChartContainer
      aria-label="Radar chart of current and target scores"
      config={chartConfig}
      className="aspect-square h-80"
    >
      <RadarChart data={chartData}>
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <PolarGrid />
        <PolarAngleAxis dataKey="skill" />
        <Radar
          dataKey="current"
          stroke="var(--color-current)"
          strokeWidth={2}
          fill="var(--color-current)"
          fillOpacity={0.15}
        />
        <Radar
          dataKey="target"
          stroke="var(--color-target)"
          strokeWidth={2}
          strokeDasharray="4 4"
          fill="none"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </RadarChart>
    </ChartContainer>
  )
}

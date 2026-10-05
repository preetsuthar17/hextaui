"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { quarter: "Q1", starter: 120, pro: 86, team: 34 },
  { quarter: "Q2", starter: 138, pro: 104, team: 51 },
  { quarter: "Q3", starter: 131, pro: 122, team: 69 },
  { quarter: "Q4", starter: 149, pro: 141, team: 88 },
]

const chartConfig = {
  starter: {
    label: "Starter",
    color: "var(--chart-1)",
  },
  pro: {
    label: "Pro",
    color: "var(--chart-2)",
  },
  team: {
    label: "Team",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function ChartStacked() {
  return (
    <ChartContainer
      aria-label="Stacked bar chart of Starter, Pro and Team plans"
      config={chartConfig}
      className="h-60 w-full max-w-md"
    >
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="quarter"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="starter"
          stackId="plans"
          fill="var(--color-starter)"
          radius={[0, 0, 4, 4]}
        />
        <Bar dataKey="pro" stackId="plans" fill="var(--color-pro)" />
        <Bar
          dataKey="team"
          stackId="plans"
          fill="var(--color-team)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}

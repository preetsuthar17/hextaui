"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { page: "Pricing", views: 4821 },
  { page: "Docs", views: 3902 },
  { page: "Changelog", views: 2214 },
  { page: "Blog", views: 1736 },
  { page: "Careers", views: 640 },
]

const chartConfig = {
  views: {
    label: "Views",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartHorizontal() {
  return (
    <ChartContainer
      aria-label="Horizontal bar chart of page views"
      config={chartConfig}
      className="h-56 w-full max-w-md"
    >
      <BarChart data={chartData} layout="vertical" margin={{ right: 48 }}>
        <XAxis type="number" dataKey="views" hide />
        <YAxis
          type="category"
          dataKey="page"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={76}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="views" fill="var(--color-views)" radius={4} barSize={20}>
          <LabelList
            dataKey="views"
            position="right"
            offset={8}
            className="fill-foreground"
            formatter={(value) => Number(value).toLocaleString("en-US")}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

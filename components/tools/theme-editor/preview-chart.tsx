"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const data = [
  { month: "Jan", organic: 186, direct: 80, referral: 64, social: 42, email: 30 },
  { month: "Feb", organic: 205, direct: 120, referral: 70, social: 58, email: 36 },
  { month: "Mar", organic: 237, direct: 110, referral: 92, social: 61, email: 48 },
  { month: "Apr", organic: 173, direct: 140, referral: 88, social: 75, email: 52 },
  { month: "May", organic: 249, direct: 130, referral: 104, social: 82, email: 60 },
  { month: "Jun", organic: 284, direct: 150, referral: 118, social: 96, email: 72 },
]

const config = {
  organic: { label: "Organic", color: "var(--chart-1)" },
  direct: { label: "Direct", color: "var(--chart-2)" },
  referral: { label: "Referral", color: "var(--chart-3)" },
  social: { label: "Social", color: "var(--chart-4)" },
  email: { label: "Email", color: "var(--chart-5)" },
} satisfies ChartConfig

const series = Object.keys(config) as (keyof typeof config)[]

function PreviewChart() {
  return (
    <ChartContainer
      aria-label="Stacked bar chart of visitors by channel and month"
      config={config}
      className="aspect-auto h-48 w-full"
    >
      <BarChart data={data} margin={{ left: 0, right: 0, top: 4 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={8}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        {series.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="visitors"
            fill={`var(--color-${key})`}
            radius={index === series.length - 1 ? [4, 4, 0, 0] : 0}
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    </ChartContainer>
  )
}

export default PreviewChart

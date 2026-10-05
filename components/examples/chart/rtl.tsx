"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { month: "يناير", desktop: 186, mobile: 80 },
  { month: "فبراير", desktop: 305, mobile: 200 },
  { month: "مارس", desktop: 237, mobile: 120 },
  { month: "أبريل", desktop: 73, mobile: 190 },
  { month: "مايو", desktop: 209, mobile: 130 },
  { month: "يونيو", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "سطح المكتب",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "الجوال",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const numbers = new Intl.NumberFormat("ar-EG")

export function ChartRtl() {
  return (
    <div dir="rtl" className="w-full max-w-md">
      <ChartContainer
        aria-label="مخطط أعمدة لزوار سطح المكتب والجوال"
        config={chartConfig}
        className="h-60 w-full"
      >
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            reversed
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis
            orientation="right"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={36}
            tickFormatter={(value) => numbers.format(value)}
          />
          <ChartTooltip content={<ChartTooltipContent locale="ar-EG" />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

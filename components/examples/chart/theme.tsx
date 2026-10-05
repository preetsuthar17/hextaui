"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { hour: "08:00", latency: 182 },
  { hour: "10:00", latency: 164 },
  { hour: "12:00", latency: 231 },
  { hour: "14:00", latency: 205 },
  { hour: "16:00", latency: 148 },
  { hour: "18:00", latency: 171 },
]

const chartConfig = {
  latency: {
    label: "Latency (ms)",
    theme: {
      light: "oklch(0.5 0.17 285)",
      dark: "oklch(0.75 0.14 190)",
    },
  },
} satisfies ChartConfig

export function ChartTheme() {
  return (
    <ChartContainer
      aria-label="Line chart of latency in milliseconds"
      config={chartConfig}
      className="h-52 w-full max-w-md"
    >
      <LineChart data={chartData} margin={{ left: 12, right: 12, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="hour"
          padding={{ left: 16, right: 16 }}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Line
          dataKey="latency"
          type="linear"
          stroke="var(--color-latency)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--color-latency)" }}
        />
      </LineChart>
    </ChartContainer>
  )
}

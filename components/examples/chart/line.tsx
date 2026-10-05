"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { week: "W1", signups: 412, activated: 238 },
  { week: "W2", signups: 468, activated: 301 },
  { week: "W3", signups: 395, activated: 254 },
  { week: "W4", signups: 530, activated: 362 },
  { week: "W5", signups: 588, activated: 417 },
  { week: "W6", signups: 561, activated: 431 },
  { week: "W7", signups: 642, activated: 489 },
]

const chartConfig = {
  signups: {
    label: "Sign-ups",
    color: "var(--chart-1)",
  },
  activated: {
    label: "Activated",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

export function ChartLine() {
  return (
    <ChartContainer
      aria-label="Line chart of sign-ups and activated accounts"
      config={chartConfig}
      className="h-60 w-full"
    >
      <LineChart data={chartData} margin={{ left: 4, right: 12, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="week"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Line
          dataKey="signups"
          type="monotone"
          stroke="var(--color-signups)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          dataKey="activated"
          type="monotone"
          stroke="var(--color-activated)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </LineChart>
    </ChartContainer>
  )
}

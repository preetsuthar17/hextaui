"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const data = [
  { day: "Mon", requests: 14200, cached: 6100 },
  { day: "Tue", requests: 21800, cached: 8400 },
  { day: "Wed", requests: 17600, cached: 7900 },
  { day: "Thu", requests: 19400, cached: 9800 },
  { day: "Fri", requests: 24100, cached: 11200 },
  { day: "Sat", requests: 15300, cached: 7400 },
  { day: "Sun", requests: 16020, cached: 8100 },
]

const config = {
  requests: { label: "Requests", color: "var(--chart-1)" },
  cached: { label: "Cached", color: "var(--chart-2)" },
} satisfies ChartConfig

function ShowcaseChart() {
  return (
    <ChartContainer
      aria-label="Area chart of requests and cached requests by day"
      config={config}
      className="aspect-auto h-24 w-full"
    >
      <AreaChart data={data} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
        <defs>
          {Object.keys(config).map((key) => (
            <linearGradient key={key} id={`showcase-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`var(--color-${key})`} stopOpacity={0.28} />
              <stop offset="100%" stopColor={`var(--color-${key})`} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={6}
          interval={0}
          padding={{ left: 12, right: 12 }}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        {(Object.keys(config) as (keyof typeof config)[]).map((key) => (
          <Area
            key={key}
            dataKey={key}
            type="monotone"
            stroke={`var(--color-${key})`}
            strokeWidth={1.5}
            fill={`url(#showcase-${key})`}
            isAnimationActive={false}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}

export default ShowcaseChart

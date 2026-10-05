"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { month: "2026-01", revenue: 18420.5 },
  { month: "2026-02", revenue: 21310 },
  { month: "2026-03", revenue: 19875.25 },
  { month: "2026-04", revenue: 24960 },
  { month: "2026-05", revenue: 28140.75 },
  { month: "2026-06", revenue: 31295 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
})

const monthFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

function formatMonth(value: unknown) {
  return monthFormat.format(new Date(`${value}-01T00:00:00Z`))
}

export function ChartValueFormat() {
  return (
    <ChartContainer
      aria-label="Area chart of revenue"
      config={chartConfig}
      className="h-56 w-full max-w-md"
    >
      <AreaChart data={chartData} margin={{ left: 4, right: 12, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => formatMonth(value).slice(0, 3)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={48}
          tickFormatter={(value) => compactCurrency.format(value)}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="line"
              labelFormatter={formatMonth}
              valueFormatter={(value) => currency.format(Number(value))}
            />
          }
        />
        <Area
          dataKey="revenue"
          type="monotone"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          fill="var(--color-revenue)"
          fillOpacity={0.1}
        />
      </AreaChart>
    </ChartContainer>
  )
}

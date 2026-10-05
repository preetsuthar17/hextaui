"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  XAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { month: "Jan", change: 12.4 },
  { month: "Feb", change: -4.1 },
  { month: "Mar", change: 8.7 },
  { month: "Apr", change: -9.3 },
  { month: "May", change: 3.2 },
  { month: "Jun", change: 15.8 },
]

const chartConfig = {
  change: {
    label: "Change",
  },
  gain: {
    label: "Gain",
    color: "var(--chart-1)",
  },
  loss: {
    label: "Loss",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function ChartNegative() {
  return (
    <ChartContainer
      aria-label="Bar chart of gains and losses"
      config={chartConfig}
      className="h-56 w-full max-w-md"
    >
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <ReferenceLine y={0} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideIndicator
              valueFormatter={(value) =>
                `${Number(value) > 0 ? "+" : ""}${value}%`
              }
            />
          }
        />
        <Bar dataKey="change" radius={4}>
          {chartData.map((item) => (
            <Cell
              key={item.month}
              fill={item.change < 0 ? "var(--color-loss)" : "var(--color-gain)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

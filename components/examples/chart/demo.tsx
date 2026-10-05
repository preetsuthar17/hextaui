"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const chartData = Array.from({ length: 90 }, (_, index) => {
  const date = new Date(Date.UTC(2026, 3, 1 + index))
  const wave = Math.sin(index / 6) * 60 + Math.sin(index / 2.3) * 25
  return {
    date: date.toISOString().slice(0, 10),
    desktop: Math.round(260 + wave + index * 1.6),
    mobile: Math.round(180 - wave * 0.6 + index * 1.1),
  }
})

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const ranges = [
  { value: "90", label: "90d", name: "Last 90 days" },
  { value: "30", label: "30d", name: "Last 30 days" },
  { value: "7", label: "7d", name: "Last 7 days" },
]

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
})

function formatDate(value: unknown) {
  return dateFormat.format(new Date(`${value}T00:00:00Z`))
}

export function ChartDemo() {
  const [range, setRange] = React.useState("90")
  const data = chartData.slice(-Number(range))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Visitors</CardTitle>
        <CardDescription>Desktop and mobile visits per day</CardDescription>
        <CardAction>
          <ToggleGroup
            variant="outline"
            size="sm"
            aria-label="Time range"
            value={[range]}
            onValueChange={(value) => {
              if (value.length > 0) {
                setRange(value[0])
              }
            }}
          >
            {ranges.map((item) => (
              <ToggleGroupItem
                key={item.value}
                value={item.value}
                aria-label={item.name}
              >
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer
          aria-label="Area chart of desktop and mobile visitors per day"
          config={chartConfig}
          className="h-64 w-full"
        >
          <AreaChart data={data} margin={{ left: 12, right: 12 }}>
            <defs>
              <linearGradient id="fill-desktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient id="fill-mobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatDate}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={formatDate}
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fill-mobile)"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fill-desktop)"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

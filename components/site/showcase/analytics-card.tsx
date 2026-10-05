"use client"

import * as React from "react"
import { Area, AreaChart } from "recharts"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { NumberFlow } from "@/components/ui/number-flow"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const visits = Array.from({ length: 180 }, (_, index) => ({
  day: index,
  visitors: Math.round(
    1800 +
      index * 9 +
      Math.sin(index / 5) * 260 +
      Math.sin(index / 1.7) * 120 +
      Math.cos(index / 11) * 180
  ),
}))

const ranges = [
  { value: "7", label: "7d", name: "Last 7 days" },
  { value: "30", label: "30d", name: "Last 30 days" },
  { value: "90", label: "90d", name: "Last 90 days" },
]

const config = {
  visitors: { label: "Visitors", color: "var(--foreground)" },
} satisfies ChartConfig

function sum(rows: typeof visits) {
  return rows.reduce((total, row) => total + row.visitors, 0)
}

function AnalyticsCard() {
  const [range, setRange] = React.useState("30")
  const days = Number(range)
  const data = visits.slice(-days)
  const total = sum(data)
  const previous = sum(visits.slice(-days * 2, -days))
  const change = (total - previous) / previous

  return (
    <Card>
      <CardHeader>
        <CardDescription>Visitors</CardDescription>
        <div className="flex items-center gap-2">
          <NumberFlow
            value={total}
            className="text-3xl font-semibold tracking-tight"
          />
          <Badge variant={change >= 0 ? "success" : "destructive"}>
            <NumberFlow
              value={change}
              format={{
                style: "percent",
                maximumFractionDigits: 1,
                signDisplay: "always",
              }}
            />
          </Badge>
        </div>
        <CardAction>
          <ToggleGroup
            aria-label="Time range"
            size="sm"
            value={[range]}
            onValueChange={(next) => {
              if (next[0]) {
                setRange(next[0])
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
      <div className="-mb-6">
        <ChartContainer
          config={config}
          aria-label="Visitors per day"
          className="h-36 w-full"
        >
          <AreaChart data={data} margin={{ left: 0, right: 0, top: 4 }}>
            <defs>
              <linearGradient
                id="showcase-visitors"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="var(--color-visitors)"
                  stopOpacity={0.16}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-visitors)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel indicator="dot" />}
            />
            <Area
              dataKey="visitors"
              type="monotone"
              fill="url(#showcase-visitors)"
              stroke="var(--color-visitors)"
              strokeWidth={1.5}
              animationDuration={500}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </Card>
  )
}

export { AnalyticsCard }

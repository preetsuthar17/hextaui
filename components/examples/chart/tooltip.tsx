"use client"

import * as React from "react"
import { Bar, BarChart, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartTooltipContentProps,
  type ChartConfig,
} from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const chartData = [
  { day: "Mon", running: 450, swimming: 300 },
  { day: "Tue", running: 380, swimming: 420 },
  { day: "Wed", running: 520, swimming: 120 },
  { day: "Thu", running: 140, swimming: 550 },
  { day: "Fri", running: 600, swimming: 350 },
  { day: "Sat", running: 480, swimming: 400 },
]

const chartConfig = {
  running: {
    label: "Running",
    color: "var(--chart-1)",
  },
  swimming: {
    label: "Swimming",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

type Indicator = NonNullable<ChartTooltipContentProps["indicator"]>

const indicators: Indicator[] = ["dot", "line", "dashed"]

export function ChartTooltipIndicators() {
  const [indicator, setIndicator] = React.useState<Indicator>("dot")
  const [hideLabel, setHideLabel] = React.useState(false)

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        <ToggleGroup
          variant="outline"
          size="sm"
          aria-label="Indicator"
          value={[indicator]}
          onValueChange={(value) => {
            if (value.length > 0) {
              setIndicator(value[0] as Indicator)
            }
          }}
        >
          {indicators.map((item) => (
            <ToggleGroupItem key={item} value={item}>
              {item}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <ToggleGroup
          variant="outline"
          size="sm"
          aria-label="Label"
          value={hideLabel ? ["hidden"] : []}
          onValueChange={(value) => setHideLabel(value.length > 0)}
        >
          <ToggleGroupItem value="hidden">hideLabel</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <ChartContainer
        aria-label="Bar chart of running and swimming time"
        config={chartConfig}
        className="h-52 w-full"
      >
        <BarChart data={chartData}>
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <ChartTooltip
            defaultIndex={2}
            content={
              <ChartTooltipContent
                indicator={indicator}
                hideLabel={hideLabel}
              />
            }
          />
          <Bar
            dataKey="running"
            stackId="a"
            fill="var(--color-running)"
            radius={[0, 0, 4, 4]}
          />
          <Bar
            dataKey="swimming"
            stackId="a"
            fill="var(--color-swimming)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

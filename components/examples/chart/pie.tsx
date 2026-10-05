"use client"

import { Label, Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

const total = chartData.reduce((sum, item) => sum + item.visitors, 0)

export function ChartPie() {
  return (
    <ChartContainer
      aria-label="Pie chart of visitors by browser"
      config={chartConfig}
      className="aspect-square h-72"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent nameKey="browser" hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="visitors"
          nameKey="browser"
          innerRadius={58}
          paddingAngle={2}
          cornerRadius={4}
        >
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !("cx" in viewBox)) {
                return null
              }
              return (
                <text
                  x={viewBox.cx}
                  y={viewBox.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan
                    x={viewBox.cx}
                    y={viewBox.cy}
                    className="fill-foreground text-2xl font-semibold"
                  >
                    {total.toLocaleString("en-US")}
                  </tspan>
                  <tspan
                    x={viewBox.cx}
                    y={(viewBox.cy ?? 0) + 22}
                    className="fill-muted-foreground"
                  >
                    Visitors
                  </tspan>
                </text>
              )
            }}
          />
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="browser" />} />
      </PieChart>
    </ChartContainer>
  )
}

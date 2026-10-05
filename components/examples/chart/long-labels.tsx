"use client"

import { Bar, BarChart, XAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  {
    region: "North America and the Caribbean",
    enterprise: 1284032,
    midMarket: 842311,
    selfServe: 402118,
    partners: 220940,
    marketplace: 98110,
  },
  {
    region: "Europe, Middle East and Africa",
    enterprise: 1032544,
    midMarket: 760201,
    selfServe: 515720,
    partners: 180332,
    marketplace: 121004,
  },
  {
    region: "Asia Pacific",
    enterprise: 690210,
    midMarket: 612090,
    selfServe: 688402,
    partners: 140220,
    marketplace: 160550,
  },
]

const chartConfig = {
  enterprise: {
    label: "Enterprise contracts (annual)",
    color: "var(--chart-1)",
  },
  midMarket: {
    label: "Mid-market subscriptions",
    color: "var(--chart-2)",
  },
  selfServe: {
    label: "Self-serve card payments",
    color: "var(--chart-3)",
  },
  partners: {
    label: "Reseller and agency partners",
    color: "var(--chart-4)",
  },
  marketplace: {
    label: "Cloud marketplace listings",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function ChartLongLabels() {
  return (
    <ChartContainer
      aria-label="Bar chart of revenue by sales channel"
      config={chartConfig}
      className="h-80 w-full max-w-sm"
    >
      <BarChart data={chartData}>
        <XAxis
          dataKey="region"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) => value.split(/[ ,]/)[0]}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="enterprise" stackId="a" fill="var(--color-enterprise)" />
        <Bar dataKey="midMarket" stackId="a" fill="var(--color-midMarket)" />
        <Bar dataKey="selfServe" stackId="a" fill="var(--color-selfServe)" />
        <Bar dataKey="partners" stackId="a" fill="var(--color-partners)" />
        <Bar
          dataKey="marketplace"
          stackId="a"
          fill="var(--color-marketplace)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}

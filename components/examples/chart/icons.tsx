"use client"

import {
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
} from "@tabler/icons-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { month: "Jan", desktop: 186, tablet: 42, mobile: 80 },
  { month: "Feb", desktop: 305, tablet: 61, mobile: 200 },
  { month: "Mar", desktop: 237, tablet: 54, mobile: 120 },
  { month: "Apr", desktop: 173, tablet: 70, mobile: 190 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    icon: IconDeviceDesktop,
    color: "var(--chart-1)",
  },
  tablet: {
    label: "Tablet",
    icon: IconDeviceTablet,
    color: "var(--chart-3)",
  },
  mobile: {
    label: "Mobile",
    icon: IconDeviceMobile,
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartIcons() {
  return (
    <ChartContainer
      aria-label="Bar chart of desktop, tablet and mobile visitors"
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
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="tablet" fill="var(--color-tablet)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

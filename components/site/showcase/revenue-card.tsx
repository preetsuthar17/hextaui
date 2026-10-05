"use client"

import { Bar, BarChart, Cell, XAxis } from "recharts"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const data = [
  { month: "May", revenue: 18200 },
  { month: "Jun", revenue: 24800 },
  { month: "Jul", revenue: 21400 },
  { month: "Aug", revenue: 29600 },
  { month: "Sep", revenue: 26100 },
  { month: "Oct", revenue: 33900 },
]

const config = {
  revenue: { label: "Revenue", color: "var(--foreground)" },
} satisfies ChartConfig

function RevenueCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          <ChartContainer
            config={config}
            aria-label="Bar chart of monthly revenue"
            className="h-44 w-full"
          >
            <BarChart data={data} margin={{ left: 0, right: 0, top: 4 }}>
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="revenue" radius={6}>
                {data.map((entry, index) => (
                  <Cell
                    key={entry.month}
                    fill="var(--color-revenue)"
                    fillOpacity={index === data.length - 1 ? 0.9 : 0.14}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-0.5 rounded-lg bg-muted px-3 py-2.5">
              <span className="text-xs text-muted-foreground">Next payout</span>
              <span className="font-medium">Oct 28</span>
            </div>
            <div className="flex flex-col gap-0.5 rounded-lg bg-muted px-3 py-2.5">
              <span className="text-xs text-muted-foreground">Growth</span>
              <span className="font-medium">+29.9%</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View report
        </Button>
      </CardFooter>
    </Card>
  )
}

export { RevenueCard }

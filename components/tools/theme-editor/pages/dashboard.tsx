"use client"

import * as React from "react"
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconBell,
  IconChartBar,
  IconCreditCard,
  IconDownload,
  IconHome,
  IconPlugConnected,
  IconReportAnalytics,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  BrandMark,
  NavItem,
  PreviewFrame,
  usePortalContainer,
} from "@/components/tools/theme-editor/preview-frame"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const revenue = [
  { month: "Nov", subscriptions: 28400, services: 6200 },
  { month: "Dec", subscriptions: 30100, services: 7400 },
  { month: "Jan", subscriptions: 31800, services: 5900 },
  { month: "Feb", subscriptions: 33200, services: 6800 },
  { month: "Mar", subscriptions: 34900, services: 8100 },
  { month: "Apr", subscriptions: 36300, services: 7600 },
  { month: "May", subscriptions: 37800, services: 8900 },
  { month: "Jun", subscriptions: 39400, services: 9400 },
  { month: "Jul", subscriptions: 40100, services: 8700 },
  { month: "Aug", subscriptions: 42600, services: 9900 },
  { month: "Sep", subscriptions: 44800, services: 10400 },
  { month: "Oct", subscriptions: 48290, services: 11200 },
]

const chartConfig = {
  subscriptions: { label: "Subscriptions", color: "var(--chart-1)" },
  services: { label: "Services", color: "var(--chart-2)" },
} satisfies ChartConfig

const stats = [
  { label: "Revenue", value: "$59,490", change: "+12.4%", up: true, note: "vs. September" },
  { label: "Active customers", value: "2,184", change: "+86", up: true, note: "this month" },
  { label: "Churn", value: "1.8%", change: "−0.3 pts", up: true, note: "lower is better" },
  { label: "Open invoices", value: "$7,120", change: "14 overdue", up: false, note: "needs follow-up" },
]

const transactions = [
  { initials: "AC", name: "Acme Corp", email: "billing@acme.co", plan: "Scale", amount: "$1,240.00", status: "Paid" },
  { initials: "LH", name: "Lumen Health", email: "ap@lumen.health", plan: "Team", amount: "$480.00", status: "Pending" },
  { initials: "OB", name: "Orbit Labs", email: "finance@orbit.dev", plan: "Scale", amount: "$1,240.00", status: "Paid" },
  { initials: "FR", name: "Fieldrun", email: "ops@fieldrun.io", plan: "Starter", amount: "$96.00", status: "Failed" },
  { initials: "NV", name: "Novatech", email: "accounts@novatech.com", plan: "Team", amount: "$480.00", status: "Paid" },
]

const plans = [
  { name: "Scale", share: 46, customers: 312 },
  { name: "Team", share: 34, customers: 918 },
  { name: "Starter", share: 20, customers: 954 },
]

const ranges = [
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last quarter" },
  { value: "365", label: "Last 12 months" },
]

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "Paid" ? "success" : status === "Pending" ? "warning" : "destructive"
  return (
    <Badge variant={variant} appearance="muted" size="sm">
      {status}
    </Badge>
  )
}

function RevenueChart() {
  return (
    <ChartContainer
      config={chartConfig}
      aria-label="Monthly revenue from subscriptions and services"
      className="aspect-auto h-56 w-full"
    >
      <BarChart data={revenue} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={44}
          tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="subscriptions" stackId="a" fill="var(--color-subscriptions)" radius={[0, 0, 3, 3]} isAnimationActive={false} />
        <Bar dataKey="services" stackId="a" fill="var(--color-services)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  )
}

function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-e border-sidebar-border bg-sidebar text-sidebar-foreground @3xl:flex">
      <div className="flex h-14 items-center gap-2 px-4">
        <BrandMark />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold">Northwind</span>
          <span className="truncate text-xs text-sidebar-foreground/60">Finance workspace</span>
        </div>
      </div>
      <nav aria-label="Dashboard" className="flex flex-col gap-0.5 px-2 py-2">
        <NavItem icon={<IconHome />} active>
          Overview
        </NavItem>
        <NavItem icon={<IconUsers />} count="2,184">
          Customers
        </NavItem>
        <NavItem icon={<IconCreditCard />}>Billing</NavItem>
        <NavItem icon={<IconReportAnalytics />}>Reports</NavItem>
        <NavItem icon={<IconPlugConnected />}>Integrations</NavItem>
        <NavItem icon={<IconSettings />}>Settings</NavItem>
      </nav>
      <div className="mt-auto p-3">
        <div className="flex flex-col gap-2 rounded-lg bg-sidebar-accent p-3 text-sidebar-accent-foreground">
          <span className="flex items-center gap-1.5 text-xs font-medium">
            <IconChartBar className="size-3.5" aria-hidden="true" />
            Forecasts
          </span>
          <p className="text-xs text-pretty opacity-75">
            Project next quarter’s revenue from your current pipeline.
          </p>
          <Progress value={68} size="sm" aria-label="Setup progress" />
          <span className="text-xs opacity-75">2 of 3 data sources connected</span>
        </div>
      </div>
    </aside>
  )
}

function Dashboard() {
  const container = usePortalContainer()

  return (
    <PreviewFrame label="Dashboard preview">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4 @xl:px-6">
          <InputGroup className="hidden max-w-72 @md:flex">
            <InputGroupAddon>
              <IconSearch />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search customers, invoices…" aria-label="Search" />
          </InputGroup>
          <div className="ms-auto flex items-center gap-1.5">
            <Button variant="ghost" size="icon-sm" aria-label="Notifications">
              <IconBell />
            </Button>
            <Avatar size="sm">
              <AvatarFallback>SK</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 @xl:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="font-heading text-xl font-semibold tracking-tight">Good morning, Sara</h2>
              <p className="text-muted-foreground">Here’s how Northwind is doing this month.</p>
            </div>
            <div className="flex items-center gap-2">
              <Select items={ranges} defaultValue="30">
                <SelectTrigger size="sm" aria-label="Date range" className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent portalProps={{ container }}>
                  {ranges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm">
                <IconDownload data-icon="inline-start" />
                Export
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 @md:grid-cols-2 @5xl:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} size="sm">
                <CardHeader>
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle>
                    <span className="text-2xl font-semibold tracking-tight tabular-nums">
                      {stat.value}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span
                      data-down={stat.up ? undefined : ""}
                      className="inline-flex items-center gap-0.5 font-medium text-success data-down:text-destructive"
                    >
                      {stat.up ? (
                        <IconArrowUpRight className="size-3.5" aria-hidden="true" />
                      ) : (
                        <IconArrowDownRight className="size-3.5" aria-hidden="true" />
                      )}
                      {stat.change}
                    </span>
                    {stat.note}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 @5xl:grid-cols-3">
            <Card size="sm" className="@5xl:col-span-2">
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Subscriptions and services, last 12 months</CardDescription>
                <CardAction>
                  <Badge variant="success" appearance="muted" size="sm">
                    +70% YoY
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                <RevenueChart />
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardTitle>Plans</CardTitle>
                <CardDescription>Share of monthly revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-4">
                  {plans.map((plan) => (
                    <li key={plan.name} className="flex flex-col gap-1.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-medium">{plan.name}</span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {plan.customers} customers · {plan.share}%
                        </span>
                      </div>
                      <Progress value={plan.share} aria-label={`${plan.name} share`} />
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-col gap-1 rounded-lg bg-muted p-3">
                  <span className="text-xs text-muted-foreground">Net revenue retention</span>
                  <span className="text-lg font-semibold tracking-tight tabular-nums">118%</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Recent payments</CardTitle>
              <CardDescription>Synced from Stripe 4 minutes ago</CardDescription>
              <CardAction>
                <Button variant="outline" size="xs">
                  View all
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Table size="sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden @2xl:table-cell">Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-end">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar size="sm">
                            <AvatarFallback>{row.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate font-medium">{row.name}</span>
                            <span className="truncate text-xs text-muted-foreground">{row.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden @2xl:table-cell">{row.plan}</TableCell>
                      <TableCell>
                        <StatusBadge status={row.status} />
                      </TableCell>
                      <TableCell className="text-end">
                        <span className="font-mono tabular-nums">{row.amount}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </PreviewFrame>
  )
}

export default Dashboard

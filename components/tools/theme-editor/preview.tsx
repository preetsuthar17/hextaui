"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { cn } from "cn"
import {
  IconBell,
  IconChartBar,
  IconCreditCard,
  IconFolder,
  IconHome,
  IconInfoCircle,
  IconPlus,
  IconSettings,
  IconUsers,
  IconAlertTriangle,
} from "@tabler/icons-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const PreviewChart = dynamic(
  () => import("@/components/tools/theme-editor/preview-chart"),
  { ssr: false, loading: () => <Skeleton className="h-48 w-full" /> }
)

const PortalContainer = React.createContext<
  React.RefObject<HTMLElement | null> | undefined
>(undefined)

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "vite", label: "Vite" },
  { value: "remix", label: "React Router" },
  { value: "astro", label: "Astro" },
]

const nav = [
  { label: "Home", icon: IconHome },
  { label: "Projects", icon: IconFolder, active: true },
  { label: "Analytics", icon: IconChartBar },
  { label: "Team", icon: IconUsers },
  { label: "Billing", icon: IconCreditCard },
  { label: "Settings", icon: IconSettings },
]

const orders = [
  { id: "#3210", customer: "Olivia Martin", status: "Paid", tone: "success", amount: "$1,999.00" },
  { id: "#3209", customer: "Jackson Lee", status: "Pending", tone: "warning", amount: "$39.00" },
  { id: "#3208", customer: "Isabella Nguyen", status: "Refunded", tone: "destructive", amount: "$299.00" },
  { id: "#3207", customer: "William Kim", status: "Shipped", tone: "info", amount: "$99.00" },
] as const

function Sidebar() {
  return (
    <aside className="flex flex-col gap-4 border-b border-sidebar-border bg-sidebar p-3 text-sidebar-foreground @3xl:border-e @3xl:border-b-0">
      <div className="flex items-center gap-2 px-1.5 pt-1">
        <span className="grid size-6 place-items-center rounded-md bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
          A
        </span>
        <span className="text-sm font-semibold">Acme Inc</span>
      </div>
      <nav aria-label="Preview" className="flex gap-0.5 overflow-x-auto @3xl:flex-col">
        {nav.map(({ label, icon: Icon, active }) => (
          <span
            key={label}
            data-active={active ? "" : undefined}
            className="flex shrink-0 items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/80 data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground"
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </span>
        ))}
      </nav>
      <div className="mt-auto hidden items-center gap-2 rounded-md p-1.5 @3xl:flex">
        <Avatar size="sm">
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-xs font-medium">Olivia Martin</span>
          <span className="truncate text-xs text-sidebar-foreground/60">
            olivia@acme.com
          </span>
        </span>
      </div>
    </aside>
  )
}

function Stats() {
  return (
    <div className="grid gap-3 @xl:grid-cols-3">
      <Card size="sm">
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-2xl font-semibold tracking-tight tabular-nums">
            $45,231
          </p>
          <Badge variant="success" appearance="muted">
            +20.1% this month
          </Badge>
        </CardContent>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-2xl font-semibold tracking-tight tabular-nums">
            2,350
          </p>
          <Badge variant="info" appearance="muted">
            180 new
          </Badge>
        </CardContent>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardTitle>Storage</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-2xl font-semibold tracking-tight tabular-nums">
            68%
          </p>
          <Progress value={68} aria-label="Storage used" />
        </CardContent>
      </Card>
    </div>
  )
}

function ProjectForm() {
  const container = React.useContext(PortalContainer)
  const id = React.useId()

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy a new project in one click.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-name`} className="text-sm font-medium">
            Name
          </label>
          <Input id={`${id}-name`} placeholder="my-app" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span id={`${id}-framework`} className="text-sm font-medium">
            Framework
          </span>
          <Select items={frameworks} defaultValue="next">
            <SelectTrigger aria-labelledby={`${id}-framework`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent portalProps={{ container }}>
              {frameworks.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <label className="flex items-center justify-between gap-3 text-sm">
          Preview deployments
          <Switch defaultChecked />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox defaultChecked />
          Notify the team
        </label>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Deploy</Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function Orders() {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Recent orders</CardTitle>
        <CardDescription>Four orders this week.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table size="sm">
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-end">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <span className="font-medium tabular-nums">{order.id}</span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">{order.customer}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={order.tone} size="sm">
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-end">
                  <span className="tabular-nums">{order.amount}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function Surfaces() {
  return (
    <div className="grid gap-3 @xl:grid-cols-2">
      <div
        role="group"
        aria-label="Dialog example"
        className="flex flex-col gap-3 rounded-xl bg-popover p-4 text-popover-foreground shadow-lg/5 ring-(length:--hairline) ring-foreground/10"
      >
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">Delete project?</p>
          <p className="text-sm text-muted-foreground">
            This removes every deployment and can’t be undone.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2 rounded-lg border bg-card p-3 text-sm">
          <IconInfoCircle className="mt-0.5 size-4 shrink-0 text-info" aria-hidden="true" />
          <p>
            <span className="font-medium">New version available.</span>{" "}
            <span className="text-muted-foreground">Restart to update.</span>
          </p>
        </div>
        <div className="flex items-start gap-2 rounded-lg border bg-card p-3 text-sm">
          <IconAlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
          <p>
            <span className="font-medium">Usage at 90%.</span>{" "}
            <span className="text-muted-foreground">Upgrade before Friday.</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 rounded-lg bg-accent p-3 text-sm text-accent-foreground">
          <IconBell className="size-4 shrink-0" aria-hidden="true" />
          Accent surface for hovers and highlights
        </div>
      </div>
    </div>
  )
}

const PreviewCanvas = React.memo(function PreviewCanvas() {
  return (
    <div className="grid min-h-full grid-cols-[minmax(0,1fr)] @3xl:grid-cols-[12.5rem_minmax(0,1fr)]">
      <Sidebar />
      <div className="flex min-w-0 flex-col gap-4 p-4 @xl:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-lg font-semibold tracking-tight">Projects</p>
            <p className="text-sm text-muted-foreground">
              Everything your team shipped this month.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">
              Export
            </Button>
            <Button size="sm">
              <IconPlus data-icon="inline-start" />
              New project
            </Button>
          </div>
        </div>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
        </Tabs>
        <Stats />
        <div className="grid gap-3 @4xl:grid-cols-[1.35fr_1fr]">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Visitors</CardTitle>
              <CardDescription>By channel, last six months.</CardDescription>
            </CardHeader>
            <CardContent>
              <PreviewChart />
            </CardContent>
          </Card>
          <ProjectForm />
        </div>
        <Orders />
        <Surfaces />
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">Primary</Button>
          <Button variant="secondary" size="sm">
            Secondary
          </Button>
          <Button variant="outline" size="sm">
            Outline
          </Button>
          <Button variant="ghost" size="sm">
            Ghost
          </Button>
          <Button variant="link" size="sm">
            Link
          </Button>
        </div>
      </div>
    </div>
  )
})

function ThemePreview({
  vars,
  dark,
}: {
  vars: Record<string, string>
  dark: boolean
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    for (const [name, value] of Object.entries(vars)) {
      element.style.setProperty(name, value)
    }
  }, [vars])

  return (
    <PortalContainer.Provider value={ref}>
      <div
        ref={ref}
        data-color-scheme={dark ? "dark" : "light"}
        className={cn(
          "@container relative isolate min-h-full bg-background text-foreground",
          dark ? "dark scheme-dark" : "scheme-light"
        )}
      >
        <PreviewCanvas />
      </div>
    </PortalContainer.Provider>
  )
}

export { ThemePreview }

"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import {
  IconArrowUp,
  IconAt,
  IconCheck,
  IconCopy,
  IconFileSpreadsheet,
  IconPaperclip,
  IconRefresh,
  IconSparkles,
  IconThumbUp,
} from "@tabler/icons-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
} from "@/components/ui/message"
import { NumberFlow } from "@/components/ui/number-flow"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { PortalContainer } from "@/components/tools/theme-editor/preview-frame"
import { useToday } from "@/hooks/use-today"

const ShowcaseChart = dynamic(
  () => import("@/components/tools/theme-editor/showcase-chart"),
  { ssr: false, loading: () => <Skeleton className="h-28 w-full" /> }
)


function AssistantCard() {
  const [draft, setDraft] = React.useState("")

  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <IconSparkles className="size-4" aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-col">
            <CardTitle>Assistant</CardTitle>
            <CardDescription>Weekly signups</CardDescription>
          </div>
        </div>
        <CardAction>
          <Badge appearance="muted" size="sm">
            Beta
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
        <MessageGroup>
          <Message align="end">
            <MessageContent>
              <Bubble>
                <BubbleContent>
                  Summarize this week’s signups and flag anything odd.
                </BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
          <Message>
            <MessageAvatar>
              <span className="grid size-6 place-items-center rounded-full bg-primary text-primary-foreground">
                <IconSparkles className="size-3.5" aria-hidden="true" />
              </span>
            </MessageAvatar>
            <MessageContent>
              <Bubble variant="secondary">
                <BubbleContent>
                  Up 18% on last week. Tuesday spiked after launch, and 42
                  came from one referrer.
                </BubbleContent>
              </Bubble>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge size="sm">
                  <IconFileSpreadsheet aria-hidden="true" />
                  signups.csv
                </Badge>
                <Badge size="sm" variant="warning" appearance="muted">
                  1 anomaly
                </Badge>
              </div>
              <MessageFooter>
                <Button variant="ghost" size="icon-xs" aria-label="Copy">
                  <IconCopy />
                </Button>
                <Button variant="ghost" size="icon-xs" aria-label="Good answer">
                  <IconThumbUp />
                </Button>
                <Button variant="ghost" size="icon-xs" aria-label="Retry">
                  <IconRefresh />
                </Button>
              </MessageFooter>
            </MessageContent>
          </Message>
        </MessageGroup>
        <InputGroup>
          <InputGroupTextarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={1}
            placeholder="Ask about your data…"
            aria-label="Message the assistant"
            className="min-h-10"
          />
          <InputGroupAddon align="block-end">
            <InputGroupButton size="icon-xs" aria-label="Attach a file">
              <IconPaperclip />
            </InputGroupButton>
            <InputGroupButton size="xs">
              <IconAt data-icon="inline-start" />
              Mention
            </InputGroupButton>
            <InputGroupButton
              variant="default"
              size="icon-xs"
              aria-label="Send"
              disabled={!draft.trim()}
              className="ms-auto"
            >
              <IconArrowUp />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        </div>
      </CardContent>
    </Card>
  )
}

const people = [
  { initials: "MR", name: "Maya Ross", text: "invited you to Launch", time: "2m", unread: true },
  { initials: "JL", name: "Jon Lee", text: "approved your pull request", time: "1h", unread: true },
  { initials: "AK", name: "Ana Kim", text: "commented on Pricing v2", time: "3h", unread: false },
]

function NotificationsCard() {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardAction>
          <Button variant="ghost" size="xs" className="-me-1.5">
            Mark all read
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup className="-mx-2 -my-1">
          {people.map((person) => (
            <Item key={person.name} size="xs">
              <ItemMedia>
                <Avatar size="sm">
                  <AvatarFallback>{person.initials}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  {person.name}{" "}
                  <span className="font-normal text-muted-foreground">{person.text}</span>
                </ItemTitle>
                <ItemDescription>{person.time} ago</ItemDescription>
              </ItemContent>
              {person.unread ? (
                <ItemActions>
                  <span
                    aria-label="Unread"
                    className="size-1.5 rounded-full bg-primary forced-colors:border"
                  />
                </ItemActions>
              ) : null}
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}

const features = [
  "Unlimited projects",
  "Assistant with 50k requests",
  "Priority support",
]

function PlanCard() {
  const [billing, setBilling] = React.useState("yearly")
  const price = billing === "yearly" ? 19 : 24

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Pro plan</CardTitle>
        <CardAction>
          <Badge variant="info" appearance="muted" size="sm">
            Popular
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <ToggleGroup
            variant="outline"
            size="sm"
            aria-label="Billing period"
            value={[billing]}
            onValueChange={(value) => {
              if (value[0]) setBilling(value[0])
            }}
            className="w-full *:flex-1"
          >
            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
            <ToggleGroupItem value="yearly">
              Yearly
              <span className="text-xs text-success">−20%</span>
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="flex items-baseline gap-1">
            <NumberFlow
              value={price}
              format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
              className="text-3xl font-semibold tracking-tight"
            />
            <span className="text-sm text-muted-foreground">per seat / month</span>
          </p>
          <ul className="flex flex-col gap-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <IconCheck className="size-4 text-primary" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full flex-col gap-2">
          <Button>Upgrade to Pro</Button>
          <p className="text-center text-xs text-muted-foreground">
            Cancel anytime. No card for the trial.
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}

const models = [
  { label: "Chat", share: "42%", color: "var(--chart-1)" },
  { label: "Search", share: "24%", color: "var(--chart-2)" },
  { label: "Agents", share: "16%", color: "var(--chart-3)" },
  { label: "Vision", share: "11%", color: "var(--chart-4)" },
  { label: "Audio", share: "7%", color: "var(--chart-5)" },
]

function UsageCard() {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Requests</CardTitle>
        <CardDescription>This month, all models</CardDescription>
        <CardAction>
          <Badge variant="success" appearance="muted" size="sm">
            +12.4%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <p className="text-2xl font-semibold tracking-tight tabular-nums">128,420</p>
          <ShowcaseChart />
          <div className="flex flex-col gap-2.5">
            <div
              role="img"
              aria-label={models.map((model) => `${model.label} ${model.share}`).join(", ")}
              className="flex h-2 gap-0.5 overflow-hidden rounded-full forced-colors:border"
            >
              {models.map((model) => (
                <span
                  key={model.label}
                  className="h-full w-(--share) bg-(--segment)"
                  style={
                    { "--share": model.share, "--segment": model.color } as React.CSSProperties
                  }
                />
              ))}
            </div>
            <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {models.map((model) => (
                <li key={model.label} className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-xs bg-(--segment)"
                    style={{ "--segment": model.color } as React.CSSProperties}
                  />
                  {model.label}
                  <span className="text-foreground tabular-nums">{model.share}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const slots = ["9:30", "11:00", "13:30", "15:00"]

function ScheduleCard() {
  const today = useToday()
  const [date, setDate] = React.useState<Date>()
  const [slot, setSlot] = React.useState("11:00")
  const selected =
    date ??
    (today
      ? new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)
      : undefined)

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Book a demo</CardTitle>
        <CardDescription>30 minutes with our team.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="-m-3 flex justify-center">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={setDate}
              className="[--cell-size:--spacing(7.5)]"
            />
          </div>
          <div role="group" aria-label="Time" className="grid grid-cols-4 gap-1.5">
            {slots.map((time) => (
              <Button
                key={time}
                size="sm"
                variant={time === slot ? "default" : "outline"}
                aria-pressed={time === slot}
                onClick={() => setSlot(time)}
              >
                <span className="tabular-nums">{time}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const expiries = [
  { value: "30", label: "In 30 days" },
  { value: "90", label: "In 90 days" },
  { value: "never", label: "Never" },
]

function KeyFormCard() {
  const container = React.useContext(PortalContainer)
  const id = React.useId()

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>New API key</CardTitle>
        <CardDescription>Keys can call every model you enable.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${id}-name`} className="text-sm font-medium">
              Name
            </label>
            <Input id={`${id}-name`} defaultValue="Production" />
          </div>
          <div className="flex flex-col gap-1.5">
            <span id={`${id}-expiry`} className="text-sm font-medium">
              Expires
            </span>
            <Select items={expiries} defaultValue="90">
              <SelectTrigger aria-labelledby={`${id}-expiry`} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent portalProps={{ container }}>
                {expiries.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-center justify-between gap-3">
            Allow write access
            <Switch defaultChecked />
          </label>
          <label className="flex items-center gap-2 text-muted-foreground">
            <Checkbox />
            Email me when it’s used
          </label>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-end gap-2">
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button size="sm">Create key</Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function VariantsCard() {
  return (
    <Card size="sm">
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            <Button size="sm">Publish</Button>
            <Button size="sm" variant="secondary">
              Draft
            </Button>
            <Button size="sm" variant="outline">
              Share
            </Button>
            <Button size="sm" variant="ghost">
              Skip
            </Button>
            <Button size="sm" variant="destructive">
              Delete
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge>Default</Badge>
            <Badge variant="success" appearance="muted">
              Paid
            </Badge>
            <Badge variant="info" appearance="muted">
              Syncing
            </Badge>
            <Badge variant="warning" appearance="muted">
              Review
            </Badge>
            <Badge variant="destructive" appearance="muted">
              Failed
            </Badge>
            <Badge appearance="muted">Draft</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ShowcaseGrid = React.memo(function ShowcaseGrid() {
  return (
    <div className="@container w-full max-w-[70rem]">
      <div className="grid grid-cols-1 items-start gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-4">
          <AssistantCard />
          <NotificationsCard />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <PlanCard />
          <UsageCard />
          <VariantsCard />
        </div>
        <div className="grid min-w-0 grid-cols-1 items-start gap-4 @2xl:col-span-2 @2xl:grid-cols-2 @5xl:col-span-1 @5xl:grid-cols-1">
          <ScheduleCard />
          <KeyFormCard />
        </div>
      </div>
    </div>
  )
})

function ThemeShowcase({
  portalRef,
}: {
  portalRef: React.RefObject<HTMLElement | null>
}) {
  return (
    <PortalContainer.Provider value={portalRef}>
      <ShowcaseGrid />
    </PortalContainer.Provider>
  )
}

export { ThemeShowcase }

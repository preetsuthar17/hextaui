"use client"

import * as React from "react"
import {
  IconArchive,
  IconArrowBackUp,
  IconClock,
  IconFile,
  IconInbox,
  IconPaperclip,
  IconSearch,
  IconSend,
  IconStar,
  IconTrash,
} from "@tabler/icons-react"

import { BrandMark, NavItem, PreviewFrame } from "@/components/tools/theme-editor/preview-frame"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const messages = [
  {
    id: "1",
    from: "Lena Fischer",
    initials: "LF",
    subject: "Q4 launch plan, final draft",
    preview: "Attached the final plan. Two open questions on the pricing page before we lock it on Thursday.",
    time: "9:42",
    unread: true,
    label: "Launch",
  },
  {
    id: "2",
    from: "Stripe",
    initials: "S",
    subject: "Your October payout is on its way",
    preview: "A payout of $48,290.00 will arrive in your account ending 4821 on October 29.",
    time: "8:15",
    unread: true,
  },
  {
    id: "3",
    from: "Omar Haddad",
    initials: "OH",
    subject: "Re: Onboarding survey themes",
    preview: "Clustered the 412 answers. Setup time is the top complaint by a wide margin.",
    time: "Yesterday",
    unread: false,
    label: "Research",
  },
  {
    id: "4",
    from: "Grace Liu",
    initials: "GL",
    subject: "Design review moved to 3pm",
    preview: "Room 4B is booked, so we are in the small one. I will bring the prototypes.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "5",
    from: "GitHub",
    initials: "GH",
    subject: "[northwind/app] Release v4.2.0",
    preview: "Faster exports, a new dashboard filter bar and 31 bug fixes.",
    time: "Oct 24",
    unread: false,
  },
]

function Mail() {
  const [selected, setSelected] = React.useState("1")
  const [reply, setReply] = React.useState("")
  const message = messages.find((item) => item.id === selected) ?? messages[0]

  return (
    <PreviewFrame label="Mail preview">
      <aside className="hidden w-52 shrink-0 flex-col border-e border-sidebar-border bg-sidebar text-sidebar-foreground @5xl:flex">
        <div className="flex h-14 items-center gap-2 px-4">
          <BrandMark />
          <span className="text-sm font-semibold">Northwind Mail</span>
        </div>
        <div className="px-3 pb-3">
          <Button size="sm" className="w-full">Compose</Button>
        </div>
        <nav aria-label="Folders" className="flex flex-col gap-0.5 px-2">
          <NavItem icon={<IconInbox />} active count="2">Inbox</NavItem>
          <NavItem icon={<IconStar />}>Starred</NavItem>
          <NavItem icon={<IconClock />}>Snoozed</NavItem>
          <NavItem icon={<IconSend />}>Sent</NavItem>
          <NavItem icon={<IconFile />} count="3">Drafts</NavItem>
          <NavItem icon={<IconArchive />}>Archive</NavItem>
        </nav>
      </aside>
      <section aria-label="Inbox" className="flex w-full min-w-0 flex-col border-e @3xl:w-80 @3xl:shrink-0">
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
          <h2 className="font-heading font-semibold">Inbox</h2>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="p-3">
          <InputGroup>
            <InputGroupAddon>
              <IconSearch />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search mail" aria-label="Search mail" />
          </InputGroup>
        </div>
        <ul className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 pb-3">
          {messages.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                aria-current={item.id === selected ? "true" : undefined}
                onClick={() => setSelected(item.id)}
                className="flex w-full flex-col gap-1 rounded-lg p-3 text-start inset-ring-(length:--hairline) inset-ring-border outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-focus-ring aria-[current=true]:bg-muted forced-colors:border forced-colors:aria-[current=true]:outline-2 forced-colors:aria-[current=true]:outline-solid"
              >
                <span className="flex items-center gap-2">
                  <span className="min-w-0 flex-1 truncate font-medium">{item.from}</span>
                  {item.unread ? (
                    <span aria-label="Unread" className="size-1.5 shrink-0 rounded-full bg-primary forced-colors:border" />
                  ) : null}
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{item.time}</span>
                </span>
                <span className="truncate text-xs font-medium">{item.subject}</span>
                <span className="line-clamp-2 text-xs text-muted-foreground">{item.preview}</span>
                {item.label ? (
                  <Badge appearance="outline" size="sm" className="mt-1">{item.label}</Badge>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </section>
      <article className="hidden min-w-0 flex-1 flex-col @3xl:flex">
        <div className="flex h-14 shrink-0 items-center gap-1 border-b px-4">
          <Button variant="ghost" size="icon-sm" aria-label="Archive"><IconArchive /></Button>
          <Button variant="ghost" size="icon-sm" aria-label="Snooze"><IconClock /></Button>
          <Button variant="ghost" size="icon-sm" aria-label="Delete"><IconTrash /></Button>
          <Button variant="ghost" size="sm" className="ms-auto">
            <IconArrowBackUp data-icon="inline-start" />
            Reply
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback>{message.initials}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <h3 className="font-heading text-lg font-semibold tracking-tight">{message.subject}</h3>
              <span className="text-xs text-muted-foreground">
                {message.from} to you · {message.time}
              </span>
            </div>
          </div>
          <div className="flex max-w-prose flex-col gap-3 pt-6 leading-relaxed">
            <p>Hi Maya,</p>
            <p>{message.preview}</p>
            <p>
              First, do we keep the annual discount at 20% or move it to two free
              months? Second, should the Team tier show seats or a flat price? I lean
              towards seats, since that is how most of our customers budget.
            </p>
            <p>If we agree by Thursday, engineering can ship the page on Monday.</p>
            <p>Thanks,<br />{message.from.split(" ")[0]}</p>
          </div>
          <div className="mt-6 flex w-fit items-center gap-3 rounded-lg p-3 inset-ring-(length:--hairline) inset-ring-border">
            <span className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
              <IconFile className="size-4" aria-hidden="true" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-medium">q4-launch-plan.pdf</span>
              <span className="text-xs text-muted-foreground">2.4 MB · 14 pages</span>
            </span>
          </div>
        </div>
        <div className="shrink-0 p-4 pt-0">
          <InputGroup>
            <InputGroupTextarea
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              rows={2}
              placeholder={`Reply to ${message.from}…`}
              aria-label="Reply"
            />
            <InputGroupAddon align="block-end">
              <InputGroupButton size="icon-xs" aria-label="Attach a file">
                <IconPaperclip />
              </InputGroupButton>
              <InputGroupButton variant="default" size="xs" className="ms-auto" disabled={!reply.trim()}>
                Send
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </article>
    </PreviewFrame>
  )
}

export default Mail

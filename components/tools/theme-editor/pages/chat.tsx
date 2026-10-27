"use client"

import * as React from "react"
import {
  IconArrowUp,
  IconCheck,
  IconCopy,
  IconDatabase,
  IconEdit,
  IconFileText,
  IconMessageCircle,
  IconPaperclip,
  IconRefresh,
  IconSparkles,
  IconThumbUp,
  IconWorld,
} from "@tabler/icons-react"

import {
  BrandMark,
  NavItem,
  PreviewFrame,
  usePortalContainer,
} from "@/components/tools/theme-editor/preview-frame"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
} from "@/components/ui/message"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const threads = {
  Today: ["Churn analysis for Q3", "Draft launch email", "SQL for weekly actives"],
  Yesterday: ["Pricing page copy review", "Onboarding survey themes"],
  "Last week": ["Compare vector databases", "Summarize board deck", "Interview questions"],
}

const models = [
  { value: "fast", label: "Fast" },
  { value: "balanced", label: "Balanced" },
  { value: "deep", label: "Deep research" },
]

const query = `select plan,
       count(*) filter (where canceled_at >= now() - interval '90 days') as churned,
       count(*) as total,
       round(100.0 * count(*) filter (where canceled_at >= now() - interval '90 days') / count(*), 1) as rate
from subscriptions
group by plan
order by rate desc;`

const results = [
  { plan: "Starter", churned: 118, total: 954, rate: "12.4%" },
  { plan: "Team", churned: 41, total: 918, rate: "4.5%" },
  { plan: "Scale", churned: 6, total: 312, rate: "1.9%" },
]

function AssistantAvatar() {
  return (
    <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
      <IconSparkles className="size-4" aria-hidden="true" />
    </span>
  )
}

function ToolStep({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-xs text-muted-foreground [&_svg]:size-3.5">
      {icon}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <IconCheck className="text-success" aria-label="Done" />
    </li>
  )
}

function Chat() {
  const container = usePortalContainer()
  const [draft, setDraft] = React.useState("")

  return (
    <PreviewFrame label="AI chat preview">
      <aside className="hidden w-60 shrink-0 flex-col border-e border-sidebar-border bg-sidebar text-sidebar-foreground @3xl:flex">
        <div className="flex h-14 items-center justify-between gap-2 px-3">
          <span className="flex items-center gap-2">
            <BrandMark />
            <span className="text-sm font-semibold">Relay</span>
          </span>
          <Button variant="ghost" size="icon-sm" aria-label="New chat">
            <IconEdit />
          </Button>
        </div>
        <nav aria-label="Chats" className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-2 pb-3">
          {Object.entries(threads).map(([group, items], index) => (
            <div key={group} className="flex flex-col gap-0.5">
              <span className="px-2 pb-1 text-xs font-medium text-sidebar-foreground/60">{group}</span>
              {items.map((item, itemIndex) => (
                <NavItem key={item} active={index === 0 && itemIndex === 0}>
                  {item}
                </NavItem>
              ))}
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-2 border-t border-sidebar-border p-3">
          <Avatar size="sm">
            <AvatarFallback>DM</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">Dana Moss</span>
            <span className="truncate text-xs text-sidebar-foreground/60">Growth team</span>
          </div>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <IconMessageCircle className="size-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="min-w-0 truncate font-medium">Churn analysis for Q3</h2>
          <Badge appearance="outline" size="sm" className="ms-1 hidden @md:inline-flex">
            <IconDatabase />
            warehouse
          </Badge>
          <Button variant="ghost" size="sm" className="ms-auto">
            Share
          </Button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6">
            <MessageGroup>
              <Message align="end">
                <MessageContent>
                  <Bubble>
                    <BubbleContent>
                      Which plan lost the most customers in the last 90 days?
                      Show me the query you ran.
                    </BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
              <Message>
                <MessageAvatar>
                  <AssistantAvatar />
                </MessageAvatar>
                <MessageContent>
                  <ul className="flex flex-col gap-1.5 rounded-lg p-3 inset-ring-(length:--hairline) inset-ring-border">
                    <ToolStep icon={<IconDatabase />}>Queried subscriptions in the warehouse</ToolStep>
                    <ToolStep icon={<IconFileText />}>Read “Q3 retention notes.md”</ToolStep>
                    <ToolStep icon={<IconWorld />}>Checked the status page for incidents</ToolStep>
                  </ul>
                  <div className="flex flex-col gap-3 leading-relaxed">
                    <p>
                      <strong className="font-semibold">Starter</strong> churned the most:
                      118 of 954 accounts, or 12.4%. That is nearly three times the
                      Team plan, and most of it happened in the two weeks after the
                      August price change.
                    </p>
                    <pre className="overflow-x-auto rounded-lg bg-muted p-3 font-mono text-xs/5">
                      <code>{query}</code>
                    </pre>
                    <div className="overflow-hidden rounded-lg inset-ring-(length:--hairline) inset-ring-border">
                      <table className="w-full text-xs">
                        <thead className="bg-muted/60 text-muted-foreground">
                          <tr>
                            <th className="px-3 py-2 text-start font-medium">Plan</th>
                            <th className="px-3 py-2 text-end font-medium">Churned</th>
                            <th className="px-3 py-2 text-end font-medium">Total</th>
                            <th className="px-3 py-2 text-end font-medium">Rate</th>
                          </tr>
                        </thead>
                        <tbody className="tabular-nums">
                          {results.map((row) => (
                            <tr key={row.plan} className="border-t">
                              <td className="px-3 py-2 font-medium">{row.plan}</td>
                              <td className="px-3 py-2 text-end">{row.churned}</td>
                              <td className="px-3 py-2 text-end">{row.total}</td>
                              <td className="px-3 py-2 text-end">{row.rate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p>
                      Want me to draft a win-back email for the Starter accounts that
                      left after the price change?
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge appearance="outline" size="sm">
                      <IconFileText />
                      Q3 retention notes.md
                    </Badge>
                    <Badge appearance="outline" size="sm">
                      <IconDatabase />
                      subscriptions
                    </Badge>
                  </div>
                  <MessageFooter>
                    <Button variant="ghost" size="icon-xs" aria-label="Copy">
                      <IconCopy />
                    </Button>
                    <Button variant="ghost" size="icon-xs" aria-label="Good answer">
                      <IconThumbUp />
                    </Button>
                    <Button variant="ghost" size="icon-xs" aria-label="Regenerate">
                      <IconRefresh />
                    </Button>
                  </MessageFooter>
                </MessageContent>
              </Message>
              <Message align="end">
                <MessageContent>
                  <Bubble>
                    <BubbleContent>Yes, keep it short and offer two months at the old price.</BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
              <Message>
                <MessageAvatar>
                  <AssistantAvatar />
                </MessageAvatar>
                <MessageContent>
                  <Bubble variant="secondary">
                    <BubbleContent>
                      <span className="flex flex-col gap-2">
                        <span className="font-medium">Subject: Your Starter price, back for two months</span>
                        <span>
                          Hi {"{first_name}"}, we raised Starter prices in August and heard
                          you loud and clear. Come back before November 30 and the next two
                          months are on the old price. Your projects are right where you
                          left them.
                        </span>
                      </span>
                    </BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
            </MessageGroup>
          </div>
        </div>
        <div className="shrink-0 px-4 pb-4">
          <div className="mx-auto w-full max-w-2xl">
            <InputGroup>
              <InputGroupTextarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={2}
                placeholder="Ask Relay about your data…"
                aria-label="Message Relay"
              />
              <InputGroupAddon align="block-end">
                <InputGroupButton size="icon-xs" aria-label="Attach a file">
                  <IconPaperclip />
                </InputGroupButton>
                <Select items={models} defaultValue="balanced">
                  <SelectTrigger size="sm" aria-label="Model" className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent portalProps={{ container }}>
                    {models.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            <p className="pt-2 text-center text-xs text-muted-foreground">
              Relay reads only the sources you connect. Check numbers before you share them.
            </p>
          </div>
        </div>
      </div>
    </PreviewFrame>
  )
}

export default Chat

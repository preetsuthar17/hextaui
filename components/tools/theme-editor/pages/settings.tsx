"use client"

import * as React from "react"
import {
  IconBell,
  IconCreditCard,
  IconKey,
  IconPalette,
  IconShieldLock,
  IconUser,
  IconUsers,
} from "@tabler/icons-react"

import {
  NavItem,
  PreviewFrame,
  usePortalContainer,
} from "@/components/tools/theme-editor/preview-frame"
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

const timezones = [
  { value: "lisbon", label: "Lisbon (GMT+0)" },
  { value: "berlin", label: "Berlin (GMT+1)" },
  { value: "new-york", label: "New York (GMT−5)" },
  { value: "tokyo", label: "Tokyo (GMT+9)" },
]

const alerts = [
  { label: "Comments and mentions", description: "When someone replies or @mentions you.", on: true },
  { label: "Weekly digest", description: "A Monday summary of what shipped.", on: true },
  { label: "Product updates", description: "New features, at most twice a month.", on: false },
]

const sessions = [
  { device: "MacBook Pro · Safari", place: "Lisbon, Portugal", time: "Active now", current: true },
  { device: "iPhone 16 · HextaMail app", place: "Lisbon, Portugal", time: "2 hours ago", current: false },
  { device: "Windows · Chrome", place: "Porto, Portugal", time: "Oct 21", current: false },
]

function Settings() {
  const container = usePortalContainer()
  const id = React.useId()

  return (
    <PreviewFrame label="Settings preview">
      <aside className="hidden w-56 shrink-0 flex-col gap-4 border-e border-sidebar-border bg-sidebar p-3 text-sidebar-foreground @3xl:flex">
        <div className="px-2 pt-2">
          <h2 className="font-heading text-base font-semibold">Settings</h2>
          <p className="text-xs text-sidebar-foreground/60">Personal and workspace</p>
        </div>
        <nav aria-label="Settings" className="flex flex-col gap-0.5">
          <NavItem icon={<IconUser />} active>Profile</NavItem>
          <NavItem icon={<IconBell />}>Notifications</NavItem>
          <NavItem icon={<IconPalette />}>Appearance</NavItem>
          <NavItem icon={<IconShieldLock />}>Security</NavItem>
        </nav>
        <nav aria-label="Workspace" className="flex flex-col gap-0.5">
          <span className="px-2 pb-1 text-xs font-medium text-sidebar-foreground/60">Workspace</span>
          <NavItem icon={<IconUsers />} count="12">Members</NavItem>
          <NavItem icon={<IconCreditCard />}>Billing</NavItem>
          <NavItem icon={<IconKey />}>API keys</NavItem>
        </nav>
      </aside>
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4 @xl:p-8">
          <div className="flex flex-col gap-1 pb-2">
            <h3 className="font-heading text-xl font-semibold tracking-tight">Profile</h3>
            <p className="text-muted-foreground">How you appear to people in Northwind.</p>
          </div>
          <Card size="sm">
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Avatar size="lg">
                    <AvatarFallback>MR</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">Upload photo</Button>
                    <Button variant="ghost" size="sm">Remove</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`${id}-name`} className="text-sm font-medium">Full name</label>
                    <Input id={`${id}-name`} defaultValue="Maya Ross" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`${id}-email`} className="text-sm font-medium">Email</label>
                    <Input id={`${id}-email`} type="email" defaultValue="maya@northwind.co" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span id={`${id}-tz`} className="text-sm font-medium">Time zone</span>
                    <Select items={timezones} defaultValue="lisbon">
                      <SelectTrigger aria-labelledby={`${id}-tz`} className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent portalProps={{ container }}>
                        {timezones.map((zone) => (
                          <SelectItem key={zone.value} value={zone.value}>
                            {zone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`${id}-role`} className="text-sm font-medium">Role</label>
                    <Input id={`${id}-role`} defaultValue="Head of Design" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`${id}-bio`} className="text-sm font-medium">Bio</label>
                  <Textarea
                    id={`${id}-bio`}
                    minRows={3}
                    defaultValue="Designing calm tools for busy finance teams. Previously at Linear and Monzo."
                  />
                  <span className="text-xs text-muted-foreground">Shown on your public profile.</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full justify-end gap-2">
                <Button variant="ghost" size="sm">Cancel</Button>
                <Button size="sm">Save changes</Button>
              </div>
            </CardFooter>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Email notifications</CardTitle>
              <CardDescription>Choose what lands in your inbox.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col divide-y">
                {alerts.map((alert) => (
                  <li key={alert.label}>
                    <label className="flex items-center justify-between gap-4 py-3 first:pt-0">
                      <span className="flex flex-col gap-0.5">
                        <span className="font-medium">{alert.label}</span>
                        <span className="text-xs text-muted-foreground">{alert.description}</span>
                      </span>
                      <Switch defaultChecked={alert.on} />
                    </label>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Sessions</CardTitle>
              <CardDescription>Devices signed in to your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col divide-y">
                {sessions.map((session) => (
                  <li key={session.device} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="flex items-center gap-2 font-medium">
                        <span className="truncate">{session.device}</span>
                        {session.current ? (
                          <Badge variant="success" appearance="muted" size="sm">This device</Badge>
                        ) : null}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {session.place} · {session.time}
                      </span>
                    </span>
                    {session.current ? null : (
                      <Button variant="ghost" size="xs">Sign out</Button>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Delete account</CardTitle>
              <CardDescription>
                Removes your profile and personal drafts. Workspace data stays with Northwind.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="destructive" size="sm">Delete my account</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </PreviewFrame>
  )
}

export default Settings

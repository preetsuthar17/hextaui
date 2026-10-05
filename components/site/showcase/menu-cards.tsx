"use client"

import * as React from "react"
import {
  IconBell,
  IconBook,
  IconChartBar,
  IconCreditCard,
  IconHelpCircle,
  IconLock,
  IconMessage,
  IconPalette,
  IconUser,
  IconWorld,
  type Icon,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type MenuItem = { value: string; label: string; icon: Icon }

const account: MenuItem[] = [
  { value: "profile", label: "Profile", icon: IconUser },
  { value: "billing", label: "Billing", icon: IconCreditCard },
  { value: "notifications", label: "Notifications", icon: IconBell },
  { value: "security", label: "Security", icon: IconLock },
  { value: "appearance", label: "Appearance", icon: IconPalette },
]

const support: MenuItem[] = [
  { value: "help", label: "Help center", icon: IconHelpCircle },
  { value: "docs", label: "Docs", icon: IconBook },
  { value: "contact", label: "Contact", icon: IconMessage },
  { value: "status", label: "Status", icon: IconChartBar },
  { value: "community", label: "Community", icon: IconWorld },
]

function MenuCard({
  title,
  items,
  defaultValue,
}: {
  title: string
  items: MenuItem[]
  defaultValue: string
}) {
  const [active, setActive] = React.useState(defaultValue)

  return (
    <Card size="sm" className="min-w-0">
      <CardContent>
        <nav aria-label={title} className="flex flex-col gap-1">
          <span className="px-2.5 pb-1 text-xs text-muted-foreground">
            {title}
          </span>
          {items.map((item) => (
            <Button
              key={item.value}
              variant={item.value === active ? "secondary" : "ghost"}
              size="sm"
              aria-current={item.value === active ? "page" : undefined}
              onClick={() => setActive(item.value)}
              className="w-full justify-start"
            >
              <item.icon data-icon="inline-start" />
              {item.label}
            </Button>
          ))}
        </nav>
      </CardContent>
    </Card>
  )
}

function MenuCards() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <MenuCard title="Account" items={account} defaultValue="billing" />
      <MenuCard title="Support" items={support} defaultValue="docs" />
    </div>
  )
}

export { MenuCards }

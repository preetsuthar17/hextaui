"use client"

import * as React from "react"
import { IconInbox } from "@tabler/icons-react"

import { Badge, BadgeCount } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function BadgeCounts() {
  const [count, setCount] = React.useState(9)

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge appearance="solid" variant="destructive">
          <BadgeCount value={count} />
        </Badge>
        <Badge>
          <BadgeCount value={count} max={999} />
          unread
        </Badge>
        <Button variant="outline">
          <IconInbox />
          Inbox
          <Badge size="sm">
            <BadgeCount value={count} />
          </Badge>
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCount((value) => value + 1)}
        >
          +1
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCount((value) => Math.max(0, value - 1))}
        >
          −1
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCount((value) => value + 10)}
        >
          +10
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCount(Math.floor(Math.random() * 1200))}
        >
          Random
        </Button>
      </div>
    </div>
  )
}

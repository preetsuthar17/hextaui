"use client"

import * as React from "react"
import { IconInbox } from "@tabler/icons-react"

import { Badge, BadgeCount } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NumberFlow } from "@/components/ui/number-flow"

export function NumberFlowInline() {
  const [value, setValue] = React.useState(8)

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <p className="text-sm">
        You have <NumberFlow value={value} className="font-semibold" /> new
        messages and the baseline stays aligned with the text.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline">
          <IconInbox />
          Inbox
          <Badge size="sm" appearance="solid" variant="destructive">
            <BadgeCount value={value} />
          </Badge>
        </Button>
        <Badge>
          <BadgeCount value={value * 7} max={999} />
          unread
        </Badge>
        <Button variant="outline" size="sm" onClick={() => setValue(value + 1)}>
          +1
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setValue(value + 50)}
        >
          +50
        </Button>
      </div>
    </div>
  )
}

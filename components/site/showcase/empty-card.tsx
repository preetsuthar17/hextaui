"use client"

import * as React from "react"
import { IconInbox } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { toast } from "@/components/ui/toast"

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function EmptyCard() {
  const [round, setRound] = React.useState(0)

  return (
    <Card>
      <CardContent>
        <Empty key={round}>
          <EmptyHeader>
            <EmptyMedia variant="stack">
              <IconInbox />
            </EmptyMedia>
            <EmptyTitle>You’re all caught up</EmptyTitle>
            <EmptyDescription>
              New mentions, reviews and replies land here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              size="sm"
              feedback
              onClick={async () => {
                await wait(800)
                toast("Inbox refreshed", { description: "Still nothing new." })
                setRound(round + 1)
              }}
            >
              Refresh
            </Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}

export { EmptyCard }

import { IconInbox } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyDemo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="stack">
          <IconInbox />
        </EmptyMedia>
        <EmptyTitle>You’re all caught up</EmptyTitle>
        <EmptyDescription>
          New mentions, reviews and replies land here. Nothing needs you right
          now.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Notification settings
        </Button>
      </EmptyContent>
    </Empty>
  )
}

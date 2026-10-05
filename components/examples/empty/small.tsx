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

export function EmptySmall() {
  return (
    <div className="w-full max-w-xs">
      <Empty variant="outline" size="sm">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconInbox />
          </EmptyMedia>
          <EmptyTitle>No messages</EmptyTitle>
          <EmptyDescription>
            Messages from your team land here.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm">New message</Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}

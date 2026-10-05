import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyAvatar() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <Avatar size="lg">
            <AvatarFallback>LH</AvatarFallback>
            <AvatarBadge status="offline" />
          </Avatar>
        </EmptyMedia>
        <EmptyTitle>Lena is offline</EmptyTitle>
        <EmptyDescription>
          Leave a message and she’ll see it when she’s back.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Leave a message</Button>
      </EmptyContent>
    </Empty>
  )
}

import { IconPlus } from "@tabler/icons-react"

import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyAvatarGroup() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <AvatarGroup>
            <Avatar>
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>GH</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>AT</AvatarFallback>
            </Avatar>
          </AvatarGroup>
        </EmptyMedia>
        <EmptyTitle>No team members</EmptyTitle>
        <EmptyDescription>
          Invite your team to collaborate on this project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">
          <IconPlus data-icon="inline-start" />
          Invite members
        </Button>
      </EmptyContent>
    </Empty>
  )
}

import { IconFileText } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyHeading() {
  return (
    <Empty render={<section aria-labelledby="drafts-empty-title" />}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFileText />
        </EmptyMedia>
        <EmptyTitle id="drafts-empty-title" render={<h3 />}>
          No drafts
        </EmptyTitle>
        <EmptyDescription render={<p />}>
          Drafts are saved automatically while you write.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Write a post</Button>
      </EmptyContent>
    </Empty>
  )
}

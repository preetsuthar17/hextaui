import { IconAlertTriangle } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyLongContent() {
  return (
    <div className="w-full max-w-72">
      <Empty variant="outline" size="sm">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconAlertTriangle />
          </EmptyMedia>
          <EmptyTitle>
            Nothing found in
            averyveryverylongunbrokenworkspacenamethatkeepsgoing
          </EmptyTitle>
          <EmptyDescription>
            <p>
              We searched every folder shared with
              someone.with.a.really.long.address@example-company.com and found
              nothing.
            </p>
            <p>
              Check the <a href="#">sharing settings</a> or ask the owner for
              access.
            </p>
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="sm" className="max-w-full">
            <span className="truncate">
              Request access from the workspace owner
            </span>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}

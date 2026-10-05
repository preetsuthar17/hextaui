import { IconCloudUpload } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyOutline() {
  return (
    <Empty variant="outline">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCloudUpload />
        </EmptyMedia>
        <EmptyTitle>Cloud storage is empty</EmptyTitle>
        <EmptyDescription>
          Upload files to keep them in sync across every device.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Upload files
        </Button>
      </EmptyContent>
    </Empty>
  )
}

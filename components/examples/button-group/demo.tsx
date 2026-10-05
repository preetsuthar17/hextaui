import {
  IconArchive,
  IconClock,
  IconDotsVertical,
  IconFlag,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

export function ButtonGroupDemo() {
  return (
    <ButtonGroup aria-label="Message actions">
      <Button variant="outline">
        <IconArchive data-icon="inline-start" />
        <span className="max-sm:sr-only">Archive</span>
      </Button>
      <Button variant="outline">
        <IconFlag data-icon="inline-start" />
        <span className="max-sm:sr-only">Report</span>
      </Button>
      <Button variant="outline">
        <IconClock data-icon="inline-start" />
        <span className="max-sm:sr-only">Snooze</span>
      </Button>
      <Button variant="outline" size="icon" aria-label="More actions">
        <IconDotsVertical />
      </Button>
    </ButtonGroup>
  )
}

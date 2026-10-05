import { IconPlus } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

export function ButtonSizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button size="xs" variant="outline">
          Extra small
        </Button>
        <Button size="sm" variant="outline">
          Small
        </Button>
        <Button variant="outline">Default</Button>
        <Button size="lg" variant="outline">
          Large
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button size="icon-xs" variant="outline" aria-label="Add">
          <IconPlus />
        </Button>
        <Button size="icon-sm" variant="outline" aria-label="Add">
          <IconPlus />
        </Button>
        <Button size="icon" variant="outline" aria-label="Add">
          <IconPlus />
        </Button>
        <Button size="icon-lg" variant="outline" aria-label="Add">
          <IconPlus />
        </Button>
      </div>
    </div>
  )
}

import { IconArrowUp, IconPlus } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

export function ButtonPill() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button shape="pill">Get started</Button>
      <Button shape="pill" variant="outline">
        <IconPlus data-icon="inline-start" />
        New chat
      </Button>
      <Button shape="pill" size="icon" aria-label="Send">
        <IconArrowUp />
      </Button>
      <Button shape="pill" size="icon-sm" variant="ghost" aria-label="Add">
        <IconPlus />
      </Button>
    </div>
  )
}

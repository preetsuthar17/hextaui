import { IconSearch } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"

export function KbdButton() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="outline">
        <IconSearch data-icon="inline-start" />
        Search
        <Kbd keys="mod+k" />
      </Button>
      <Button>
        Save
        <Kbd keys="mod+s" />
      </Button>
      <Button variant="ghost">
        Undo
        <Kbd keys="mod+z" variant="flat" />
      </Button>
    </div>
  )
}

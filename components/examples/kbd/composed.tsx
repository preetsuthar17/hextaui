import { IconArrowBackUp, IconClick } from "@tabler/icons-react"

import { Kbd, KbdGroup } from "@/components/ui/kbd"

export function KbdComposed() {
  return (
    <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
      <p className="flex items-center gap-2">
        <KbdGroup>
          <Kbd keys="shift" />
          <Kbd>
            <IconClick aria-hidden="true" />
            <span className="sr-only">Click</span>
          </Kbd>
        </KbdGroup>
        to select a range
      </p>
      <p className="flex items-center gap-2">
        <Kbd>
          <IconArrowBackUp aria-hidden="true" />
          <span className="sr-only">Backspace</span>
        </Kbd>
        to go back
      </p>
    </div>
  )
}

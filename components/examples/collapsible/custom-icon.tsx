import { IconPlus } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleTriggerIcon,
} from "@/components/ui/collapsible"

export function CollapsibleCustomIcon() {
  return (
    <Collapsible className="flex w-full max-w-sm flex-col gap-2">
      <CollapsibleTrigger
        render={<Button variant="ghost" />}
        className="self-start"
      >
        <CollapsibleTriggerIcon data-icon="inline-start">
          <IconPlus className="transition-transform duration-200 ease-out-cubic group-data-panel-open/collapsible-trigger:rotate-45 motion-reduce:transition-none" />
        </CollapsibleTriggerIcon>
        Add a note
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="ps-3 text-sm text-muted-foreground">
          Notes are only visible to you.
        </p>
      </CollapsibleContent>
    </Collapsible>
  )
}

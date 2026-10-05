import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleTriggerIcon,
} from "@/components/ui/collapsible"

export function CollapsibleUnmounted() {
  return (
    <Collapsible className="flex w-full max-w-sm flex-col gap-2">
      <CollapsibleTrigger
        render={<Button variant="secondary" />}
        className="self-start"
      >
        Details
        <CollapsibleTriggerIcon data-icon="inline-end" />
      </CollapsibleTrigger>
      <CollapsibleContent hiddenUntilFound={false}>
        <p className="text-sm text-muted-foreground">
          Rendered only while open.
        </p>
      </CollapsibleContent>
    </Collapsible>
  )
}

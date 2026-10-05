import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleTriggerIcon,
} from "@/components/ui/collapsible"

export function CollapsibleDisabled() {
  return (
    <Collapsible disabled className="flex w-full max-w-sm flex-col gap-2">
      <div className="flex items-center justify-between gap-4 ps-4">
        <h4 className="text-sm font-semibold">
          <span dir="ltr">@preetsuthar17</span> starred 3 repositories
        </h4>
        <CollapsibleTrigger
          render={<Button variant="ghost" size="icon-sm" />}
          aria-label="Toggle repositories"
        >
          <CollapsibleTriggerIcon />
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-2 font-mono text-sm">
        <span dir="ltr">@radix-ui/primitives</span>
      </div>
      <CollapsibleContent className="flex flex-col gap-2">
        <div className="rounded-md border px-4 py-2 font-mono text-sm">
          <span dir="ltr">@base-ui/react</span>
        </div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm">
          <span dir="ltr">@tabler/icons</span>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

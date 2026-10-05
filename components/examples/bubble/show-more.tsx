import { IconChevronDown } from "@tabler/icons-react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function BubbleShowMore() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Bubble variant="secondary">
        <Collapsible render={<BubbleContent />}>
          <p>
            Here is the full incident timeline. The first alert fired at 09:12
            when p95 latency crossed 800ms on the checkout service.
          </p>
          <CollapsibleContent>
            <p className="pt-2">
              At 09:20 we rolled back the connection pool change. Latency
              recovered by 09:24 and error rates returned to baseline by 09:31.
              A follow-up will add a canary stage for pool configuration.
            </p>
          </CollapsibleContent>
          <CollapsibleTrigger
            render={
              <button
                type="button"
                className="mt-1 inline-flex cursor-pointer items-center gap-1 rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden"
              />
            }
          >
            <span className="group-data-panel-open/collapsible-trigger:hidden">
              Show more
            </span>
            <span className="hidden group-data-panel-open/collapsible-trigger:inline">
              Show less
            </span>
            <IconChevronDown className="size-4 transition-transform duration-200 ease-out-cubic group-data-panel-open/collapsible-trigger:rotate-180 motion-reduce:transition-none" />
          </CollapsibleTrigger>
        </Collapsible>
      </Bubble>
    </div>
  )
}

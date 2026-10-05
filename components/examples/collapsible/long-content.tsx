import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleTriggerIcon,
} from "@/components/ui/collapsible"

export function CollapsibleLongContent() {
  return (
    <Collapsible className="flex w-72 max-w-full flex-col gap-2">
      <CollapsibleTrigger
        render={<Button variant="outline" />}
        className="justify-between"
      >
        Token
        <CollapsibleTriggerIcon data-icon="inline-end" />
      </CollapsibleTrigger>
      <CollapsibleContent className="font-mono text-sm wrap-anywhere">
        hx_demo_7Kq2vX9mLpR4tYw8NzB3cF6jHs1DgQe5UaV0iMoTnWbZrE2yPkLxJ4
      </CollapsibleContent>
    </Collapsible>
  )
}

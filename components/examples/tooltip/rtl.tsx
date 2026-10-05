import { IconBookmark, IconHeart, IconShare2 } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const actions = [
  { label: "أعجبني", icon: IconHeart },
  { label: "حفظ", icon: IconBookmark, keys: "mod+d" },
  { label: "مشاركة", icon: IconShare2 },
]

export function TooltipRtl() {
  return (
    <div dir="rtl">
      <TooltipProvider>
        <div className="flex items-center gap-1">
          {actions.map(({ label, icon: Icon, keys }) => (
            <Tooltip key={label}>
              <TooltipTrigger
                render={
                  <Button variant="ghost" size="icon" aria-label={label} />
                }
              >
                <Icon />
              </TooltipTrigger>
              <TooltipContent side="inline-end" arrow>
                {label}
                {keys && <Kbd keys={keys} size="sm" />}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  )
}

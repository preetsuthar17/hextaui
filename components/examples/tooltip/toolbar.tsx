import {
  IconBold,
  IconItalic,
  IconLink,
  IconStrikethrough,
  IconUnderline,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Kbd } from "@/components/ui/kbd"
import { TooltipGroup, TooltipTrigger } from "@/components/ui/tooltip"

const tools = [
  { label: "Bold", keys: "mod+b", icon: IconBold },
  { label: "Italic", keys: "mod+i", icon: IconItalic },
  { label: "Underline", keys: "mod+u", icon: IconUnderline },
  { label: "Strikethrough", keys: "mod+shift+x", icon: IconStrikethrough },
  { label: "Insert link", keys: "mod+k", icon: IconLink },
]

export function TooltipToolbar() {
  return (
    <TooltipGroup side="bottom">
      <ButtonGroup aria-label="Formatting">
        {tools.map(({ label, keys, icon: Icon }) => (
          <TooltipTrigger
            key={label}
            content={
              <>
                {label}
                <Kbd keys={keys} size="sm" />
              </>
            }
            render={<Button variant="outline" size="icon" aria-label={label} />}
          >
            <Icon />
          </TooltipTrigger>
        ))}
      </ButtonGroup>
    </TooltipGroup>
  )
}

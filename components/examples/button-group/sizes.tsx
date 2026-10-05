import { IconBold, IconItalic, IconUnderline } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

const sizes = ["xs", "sm", "default", "lg"] as const

export function ButtonGroupSizes() {
  return (
    <div className="flex flex-col items-center gap-3">
      {sizes.map((size) => (
        <ButtonGroup key={size} aria-label="Formatting">
          <Button variant="outline" size={size}>
            <IconBold data-icon="inline-start" />
            Bold
          </Button>
          <Button variant="outline" size={size}>
            <IconItalic data-icon="inline-start" />
            Italic
          </Button>
          <Button variant="outline" size={size}>
            <IconUnderline data-icon="inline-start" />
            Underline
          </Button>
        </ButtonGroup>
      ))}
    </div>
  )
}

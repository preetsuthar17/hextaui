import { IconFileText } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

const variants = ["default", "outline", "muted"] as const

export function ItemVariants() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {variants.map((variant) => (
        <Item key={variant} variant={variant}>
          <ItemMedia variant="icon">
            <IconFileText />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Quarterly report.pdf</ItemTitle>
            <ItemDescription>2.4 MB · {variant}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              Open
            </Button>
          </ItemActions>
        </Item>
      ))}
    </div>
  )
}

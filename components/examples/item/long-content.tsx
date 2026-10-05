import { IconFile } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

export function ItemLongContent() {
  return (
    <Item variant="outline" className="max-w-sm">
      <ItemMedia variant="icon">
        <IconFile />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          final-final-v3-approved-by-legal-and-design-do-not-edit-this-copy.pdf
        </ItemTitle>
        <ItemDescription>
          Uploaded to /projects/2026/client-work/very-long-folder-names/archive
          by someone@an-extremely-long-domain-name.example.com and shared with
          the whole organisation.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">
          Share
        </Button>
      </ItemActions>
    </Item>
  )
}

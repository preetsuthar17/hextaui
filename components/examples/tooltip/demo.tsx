import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconShare2,
  IconTrash,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { TooltipGroup, TooltipTrigger } from "@/components/ui/tooltip"

export function TooltipDemo() {
  return (
    <TooltipGroup>
      <div className="flex items-center gap-1">
        <TooltipTrigger
          content={
            <>
              Undo
              <Kbd keys="mod+z" />
            </>
          }
          render={<Button variant="ghost" size="icon" aria-label="Undo" />}
        >
          <IconArrowBackUp />
        </TooltipTrigger>
        <TooltipTrigger
          content={
            <>
              Redo
              <Kbd keys="mod+shift+z" />
            </>
          }
          render={<Button variant="ghost" size="icon" aria-label="Redo" />}
        >
          <IconArrowForwardUp />
        </TooltipTrigger>
        <TooltipTrigger
          content="Share"
          render={<Button variant="ghost" size="icon" aria-label="Share" />}
        >
          <IconShare2 />
        </TooltipTrigger>
        <TooltipTrigger
          content="Move to trash"
          render={
            <Button variant="ghost" size="icon" aria-label="Move to trash" />
          }
        >
          <IconTrash />
        </TooltipTrigger>
      </div>
    </TooltipGroup>
  )
}

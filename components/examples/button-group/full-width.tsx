import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

export function ButtonGroupFullWidth() {
  return (
    <ButtonGroup className="w-full max-w-md" aria-label="Range">
      <Button variant="outline" className="flex-1">
        Day
      </Button>
      <Button variant="outline" className="flex-1">
        Week
      </Button>
      <Button variant="outline" className="flex-1">
        Month
      </Button>
    </ButtonGroup>
  )
}

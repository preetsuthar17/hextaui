import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

export function ButtonGroupDisabled() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <ButtonGroup aria-label="Post actions">
        <Button variant="outline">Edit</Button>
        <Button variant="outline" disabled>
          Publish
        </Button>
        <Button variant="outline">Share</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Date range">
        <Button variant="outline">Start</Button>
        <Button variant="outline" aria-invalid>
          Missing date
        </Button>
        <Button variant="outline">End</Button>
      </ButtonGroup>
    </div>
  )
}

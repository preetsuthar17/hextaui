import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

export function ButtonGroupFieldset() {
  return (
    <ButtonGroup render={<fieldset />} aria-label="Reply">
      <Button variant="outline">Reply</Button>
      <Button variant="outline">Reply all</Button>
      <Button variant="outline">Forward</Button>
    </ButtonGroup>
  )
}

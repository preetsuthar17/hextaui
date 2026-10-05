import { IconLink } from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export function InputGroupDisabled() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput
        disabled
        defaultValue="https://hextaui.com"
        aria-label="Link"
      />
      <InputGroupAddon>
        <IconLink />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupButton disabled>Copy</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

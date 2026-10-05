import { IconAt } from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupCount,
  InputGroupInput,
} from "@/components/ui/input-group"

export function InputGroupCountDemo() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput
        defaultValue="hextaui"
        maxLength={15}
        autoComplete="username"
        aria-label="Username"
      />
      <InputGroupAddon>
        <IconAt />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupCount />
      </InputGroupAddon>
    </InputGroup>
  )
}

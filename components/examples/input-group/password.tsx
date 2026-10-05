import { IconLock } from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupPasswordToggle,
} from "@/components/ui/input-group"

export function InputGroupPassword() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput
        type="password"
        defaultValue="correct horse battery staple"
        autoComplete="current-password"
        aria-label="Password"
      />
      <InputGroupAddon>
        <IconLock />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupPasswordToggle />
      </InputGroupAddon>
    </InputGroup>
  )
}

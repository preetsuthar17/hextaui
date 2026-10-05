import { IconAt, IconAlertCircle } from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function InputGroupInvalid() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <InputGroup>
        <InputGroupInput
          defaultValue="preet@"
          aria-label="Email"
          aria-invalid
          aria-describedby="email-error"
        />
        <InputGroupAddon>
          <IconAt />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <IconAlertCircle className="text-destructive" aria-hidden />
        </InputGroupAddon>
      </InputGroup>
      <p id="email-error" className="text-sm text-destructive">
        Enter a complete email address.
      </p>
    </div>
  )
}

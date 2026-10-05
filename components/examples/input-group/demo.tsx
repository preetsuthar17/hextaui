"use client"

import * as React from "react"
import { IconArrowUp, IconLock, IconSearch } from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupClear,
  InputGroupCount,
  InputGroupInput,
  InputGroupPasswordToggle,
  InputGroupTextarea,
} from "@/components/ui/input-group"

export function InputGroupDemo() {
  const [message, setMessage] = React.useState("")

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <InputGroup>
        <InputGroupInput
          type="search"
          defaultValue="Accordion"
          placeholder="Search components"
          aria-label="Search components"
        />
        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupClear />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput
          type="password"
          defaultValue="hunter2-but-longer"
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
      <InputGroup>
        <InputGroupTextarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={140}
          placeholder="Leave a note for the team"
          aria-label="Note"
        />
        <InputGroupAddon align="block-end">
          <InputGroupCount />
          <InputGroupButton
            variant="default"
            size="icon-xs"
            aria-label="Post note"
            disabled={!message.trim()}
            className="ms-auto"
          >
            <IconArrowUp />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

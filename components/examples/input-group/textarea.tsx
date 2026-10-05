"use client"

import * as React from "react"
import { IconArrowUp, IconPaperclip } from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupCount,
  InputGroupTextarea,
} from "@/components/ui/input-group"

export function InputGroupTextareaDemo() {
  const [value, setValue] = React.useState("")

  return (
    <InputGroup className="max-w-sm">
      <InputGroupTextarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        maxLength={280}
        placeholder="Write a reply…"
        aria-label="Reply"
      />
      <InputGroupAddon align="block-end">
        <InputGroupButton size="icon-xs" aria-label="Attach a file">
          <IconPaperclip />
        </InputGroupButton>
        <InputGroupCount className="ms-auto" />
        <InputGroupButton
          variant="default"
          size="icon-xs"
          aria-label="Send"
          disabled={!value.trim()}
        >
          <IconArrowUp />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

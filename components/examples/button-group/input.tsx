"use client"

import * as React from "react"
import { IconCopy, IconLink } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group"

export function ButtonGroupInput() {
  const [value, setValue] = React.useState("hextaui.com/docs/button-group")

  return (
    <ButtonGroup className="w-full max-w-md" aria-label="Share link">
      <ButtonGroupText render={<label htmlFor="share-url" />}>
        <IconLink />
        https://
      </ButtonGroupText>
      <input
        id="share-url"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm transition-shadow outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden dark:bg-input/30 pointer-coarse:text-touch"
      />
      <Button
        variant="outline"
        feedback
        successLabel="Copied"
        errorLabel="Blocked"
        onClick={() => navigator.clipboard.writeText(`https://${value}`)}
      >
        <IconCopy data-icon="inline-start" />
        Copy
      </Button>
    </ButtonGroup>
  )
}

"use client"

import * as React from "react"
import { IconChevronDown } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

async function fail(ms: number) {
  await wait(ms)
  throw new Error("Request failed")
}

export function ButtonGroupFeedback() {
  const [shouldFail, setShouldFail] = React.useState(false)

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <ButtonGroup aria-label="Save changes">
        <Button
          feedback
          loadingLabel="Saving changes"
          successLabel="All changes saved"
          errorLabel="Couldn't save"
          onClick={() => (shouldFail ? fail(900) : wait(900))}
        >
          Save
        </Button>
        <ButtonGroupSeparator />
        <Button size="icon" aria-label="More save options">
          <IconChevronDown />
        </Button>
      </ButtonGroup>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={shouldFail}
          onChange={(event) => setShouldFail(event.target.checked)}
        />
        Fail next save
      </label>
    </div>
  )
}

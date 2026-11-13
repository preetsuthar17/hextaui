"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  TokenInput,
  TokenInputEditor,
  type TokenInputValue,
} from "@/components/ui/ui-sdk-token-input"

const draft: TokenInputValue = [
  "Explain ",
  { type: "file", value: "src/routes.ts", label: "routes.ts" },
  " in two sentences.",
]

function UiSdkTokenInputForm() {
  const [submitted, setSubmitted] = React.useState<string | null>(null)

  return (
    <form
      className="flex w-full max-w-md flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(String(new FormData(event.currentTarget).get("prompt")))
      }}
      onReset={() => setSubmitted(null)}
    >
      <TokenInput name="prompt" required defaultValue={draft}>
        <TokenInputEditor aria-label="Prompt" />
      </TokenInput>
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          Submit
        </Button>
        <Button type="reset" variant="outline" size="sm">
          Reset
        </Button>
      </div>
      <p role="status" className="text-sm wrap-anywhere text-muted-foreground">
        {submitted ? (
          <>
            Submitted prompt=
            <span className="font-mono text-foreground">{submitted}</span>
          </>
        ) : (
          "Nothing submitted yet."
        )}
      </p>
    </form>
  )
}

export { UiSdkTokenInputForm }

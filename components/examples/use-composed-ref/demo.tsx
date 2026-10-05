"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { useComposedRef } from "@/hooks/use-composed-ref"

function CharacterInput({ ref, ...props }: React.ComponentProps<"input">) {
  const [inputRef, setRef] = useComposedRef<HTMLInputElement>(ref)
  const [length, setLength] = React.useState(0)

  return (
    <div className="flex h-9 w-full items-center gap-2 rounded-md bg-muted pe-3 focus-within:ring-3 focus-within:ring-focus-ring">
      <input
        ref={setRef}
        {...props}
        onChange={(event) => {
          props.onChange?.(event)
          setLength(event.target.value.length)
        }}
        className="h-full min-w-0 flex-1 bg-transparent ps-3 text-sm outline-none focus-visible:outline-hidden pointer-coarse:text-touch"
      />
      <button
        type="button"
        hidden={length === 0}
        onClick={() => {
          const input = inputRef.current
          if (input) {
            input.value = ""
            setLength(0)
            input.focus()
          }
        }}
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        Clear
      </button>
    </div>
  )
}

export function UseComposedRefDemo() {
  const ref = React.useRef<HTMLInputElement>(null)

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <CharacterInput ref={ref} aria-label="Search" placeholder="Search" />
      <Button variant="outline" size="sm" onClick={() => ref.current?.focus()}>
        Focus from the parent
      </Button>
    </div>
  )
}

"use client"

import * as React from "react"
import { IconLoader2, IconSearch } from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

const packages = ["react", "react-dom", "react-hook-form", "redux", "remix"]

export function InputGroupLoading() {
  const [query, setQuery] = React.useState("re")
  const [pending, setPending] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const results = packages.filter((name) => name.includes(query.trim()))

  React.useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setPending(true)
          clearTimeout(timer.current)
          timer.current = setTimeout(() => setPending(false), 600)
        }}
        aria-label="Search packages"
        aria-busy={pending}
      />
      <InputGroupAddon>
        <IconSearch />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupText role="status">
          {pending ? (
            <>
              <IconLoader2 className="motion-safe:animate-spin" aria-hidden />
              Searching
            </>
          ) : results.length === 1 ? (
            "1 package"
          ) : (
            `${results.length} packages`
          )}
        </InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  )
}

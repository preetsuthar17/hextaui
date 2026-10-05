"use client"

import * as React from "react"
import { IconUser } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  useCommandLoading,
} from "@/components/ui/command"

const people = [
  "Ada Lovelace",
  "Alan Turing",
  "Grace Hopper",
  "Katherine Johnson",
  "Linus Torvalds",
  "Margaret Hamilton",
  "Tim Berners-Lee",
]

export function CommandAsync() {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState(people)
  const [loading, setLoading] = React.useState(false)
  const [latency, setLatency] = React.useState(700)
  const pending = useCommandLoading(loading)
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timerRef.current), [])

  const search = (nextQuery: string, nextLatency: number) => {
    clearTimeout(timerRef.current)
    setLoading(true)
    timerRef.current = setTimeout(() => {
      setResults(
        people.filter((person) =>
          person.toLowerCase().includes(nextQuery.toLowerCase())
        )
      )
      setLoading(false)
    }, nextLatency)
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex gap-2">
        {[80, 700].map((ms) => (
          <Button
            key={ms}
            size="sm"
            variant={latency === ms ? "secondary" : "outline"}
            onClick={() => {
              setLatency(ms)
              search(query, ms)
            }}
          >
            {ms} ms
          </Button>
        ))}
      </div>
      <Command shouldFilter={false} highlight>
        <CommandInput
          placeholder="Search people…"
          value={query}
          onValueChange={(next) => {
            setQuery(next)
            search(next, latency)
          }}
        />
        <CommandList>
          <CommandLoading loading={loading}>Searching…</CommandLoading>
          <CommandEmpty>
            {(value) => `No people match “${value}”.`}
          </CommandEmpty>
          {pending ? null : (
            <CommandGroup heading="People">
              {results.map((person) => (
                <CommandItem key={person}>
                  <IconUser />
                  {person}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  )
}

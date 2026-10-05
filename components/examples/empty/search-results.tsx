"use client"

import * as React from "react"
import { IconFilterOff } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

const tasks = [
  { title: "Write release notes", done: true },
  { title: "Review pull requests", done: true },
  { title: "Plan the next sprint", done: false },
]

export function EmptySearchResults() {
  const [onlyOpen, setOnlyOpen] = React.useState(true)
  const visible = tasks.filter((task) => !onlyOpen || !task.done)
  const [query, setQuery] = React.useState("sprint")
  const results = visible.filter((task) =>
    task.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={query ? "secondary" : "outline"}
          size="sm"
          onClick={() => setQuery(query ? "" : "sprint")}
        >
          {query ? `Search: ${query}` : "No search"}
        </Button>
        <Button
          variant={onlyOpen ? "secondary" : "outline"}
          size="sm"
          onClick={() => setOnlyOpen(!onlyOpen)}
        >
          {onlyOpen ? "Open tasks only" : "All tasks"}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setQuery("design")}>
          Search “design”
        </Button>
      </div>
      <p role="status" className="sr-only">
        {results.length === 1 ? "1 task" : `${results.length} tasks`}
      </p>
      <div>
        {results.length > 0 ? (
          <ul className="flex flex-col gap-1 rounded-xl border p-2 text-sm">
            {results.map((task) => (
              <li key={task.title} className="rounded-md px-2 py-1.5">
                {task.title}
              </li>
            ))}
          </ul>
        ) : (
          <Empty variant="outline" size="sm">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconFilterOff />
              </EmptyMedia>
              <EmptyTitle>No matching tasks</EmptyTitle>
              <EmptyDescription>
                Nothing matches “{query}” with the current filters.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery("")
                  setOnlyOpen(false)
                }}
              >
                Clear filters
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </div>
    </div>
  )
}

"use client"

import * as React from "react"

import { Badge, BadgeClose } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const initialTags = [
  "design",
  "engineering",
  "research",
  "marketing",
  "customer-success",
  "ops",
]

export function BadgeRemovable() {
  const [tags, setTags] = React.useState(initialTags)
  const [next, setNext] = React.useState(1)

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            onOpenChangeComplete={(open) => {
              if (!open) {
                setTags((current) => current.filter((item) => item !== tag))
              }
            }}
          >
            {tag}
            <BadgeClose />
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setTags((current) => [...current, `tag-${next}`])
            setNext((value) => value + 1)
          }}
        >
          Add tag
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setTags(initialTags)}>
          Reset
        </Button>
      </div>
    </div>
  )
}

"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Textarea } from "@/components/ui/textarea"

export function TextareaSubmit() {
  const [comments, setComments] = React.useState<string[]>([])

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        const form = event.currentTarget
        const text = String(new FormData(form).get("comment") ?? "").trim()
        if (text) {
          setComments((list) => [...list, text])
          form.reset()
        }
      }}
    >
      {comments.length > 0 ? (
        <ul className="flex flex-col gap-1 text-sm">
          {comments.map((comment, index) => (
            <li
              key={index}
              className="rounded-md bg-muted px-3 py-2 whitespace-pre-wrap"
            >
              {comment}
            </li>
          ))}
        </ul>
      ) : null}
      <Textarea
        name="comment"
        aria-label="Comment"
        placeholder="Write a comment…"
        minRows={2}
        submitOnShortcut
      />
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <KbdGroup>
            <Kbd keys="Mod+Enter" />
          </KbdGroup>
          to send
        </span>
        <Button type="submit" size="sm">
          Comment
        </Button>
      </div>
    </form>
  )
}

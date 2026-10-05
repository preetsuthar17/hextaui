"use client"

import * as React from "react"
import {
  IconGitMerge,
  IconPencil,
  IconPin,
  IconUserPlus,
} from "@tabler/icons-react"

import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import {
  Marker,
  MarkerContent,
  MarkerIcon,
  MarkerTime,
} from "@/components/ui/marker"

const day = 24 * 60 * 60 * 1000

function ThreadCard() {
  const threadRef = React.useRef<HTMLDivElement>(null)
  const [now] = React.useState(() => Date.now())

  React.useLayoutEffect(() => {
    const thread = threadRef.current
    if (thread) {
      thread.scrollTop = thread.scrollHeight
    }
  }, [])

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-foreground/10 bg-card text-sm text-card-foreground">
      <div className="flex flex-col gap-0.5 border-b px-4 py-3">
        <span className="font-medium">#launch</span>
        <span className="text-xs text-muted-foreground">
          Scroll up. The dates stick as you go.
        </span>
      </div>
      <div
        ref={threadRef}
        tabIndex={0}
        role="region"
        aria-label="Launch thread"
        className="h-96 overflow-y-auto overscroll-contain px-4 outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden focus-visible:ring-inset"
      >
        <section className="flex flex-col gap-3 pt-4 pb-3">
          <Marker variant="separator" sticky>
            <MarkerContent>
              <MarkerTime date={new Date(now - 2 * day)} />
            </MarkerContent>
          </Marker>
          <Marker className="justify-center">
            <MarkerIcon>
              <IconUserPlus />
            </MarkerIcon>
            <MarkerContent>Preet added Emil and Lee</MarkerContent>
          </Marker>
          <Bubble variant="secondary">
            <BubbleContent>
              Launch checklist is up. Docs, registry, landing.
            </BubbleContent>
          </Bubble>
          <Bubble align="end">
            <BubbleContent>I’ll take the landing page.</BubbleContent>
          </Bubble>
        </section>
        <section className="flex flex-col gap-3 py-3">
          <Marker variant="separator" sticky>
            <MarkerContent>
              <MarkerTime date={new Date(now - day)} />
            </MarkerContent>
          </Marker>
          <Marker className="justify-center">
            <MarkerIcon>
              <IconPencil />
            </MarkerIcon>
            <MarkerContent>Emil renamed the thread to “launch”</MarkerContent>
          </Marker>
          <Bubble variant="secondary">
            <BubbleContent>
              The showcase wall is live on staging. Try the deploy card.
            </BubbleContent>
          </Bubble>
          <Marker className="justify-center">
            <MarkerIcon>
              <IconPin />
            </MarkerIcon>
            <MarkerContent>Lee pinned a message</MarkerContent>
          </Marker>
        </section>
        <section className="flex flex-col gap-3 pt-3 pb-4">
          <Marker variant="separator" sticky>
            <MarkerContent>
              <MarkerTime date={new Date(now)} />
            </MarkerContent>
          </Marker>
          <BubbleGroup>
            <Bubble align="end">
              <BubbleContent>Registry build is green.</BubbleContent>
            </Bubble>
            <Bubble align="end">
              <BubbleContent>Dark mode screenshots look right.</BubbleContent>
            </Bubble>
          </BubbleGroup>
          <Marker className="justify-center">
            <MarkerIcon>
              <IconGitMerge />
            </MarkerIcon>
            <MarkerContent>Preet merged #482 into main</MarkerContent>
          </Marker>
          <Marker variant="separator">
            <MarkerContent>New messages</MarkerContent>
          </Marker>
          <Bubble variant="secondary">
            <BubbleContent>Shipping it.</BubbleContent>
          </Bubble>
        </section>
      </div>
    </div>
  )
}

export { ThreadCard }

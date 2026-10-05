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

export function MarkerDemo() {
  const threadRef = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const thread = threadRef.current
    if (thread) {
      thread.scrollTop = thread.scrollHeight
    }
  }, [])

  return (
    <div
      ref={threadRef}
      tabIndex={0}
      role="region"
      aria-label="Conversation"
      className="h-96 w-full max-w-md overflow-y-auto overscroll-none rounded-xl border px-4 outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden"
    >
      <section className="flex flex-col gap-3 pt-4 pb-3">
        <Marker variant="separator" sticky>
          <MarkerContent>
            <MarkerTime date={new Date(Date.now() - 2 * day)} />
          </MarkerContent>
        </Marker>
        <Marker className="justify-center">
          <MarkerIcon>
            <IconUserPlus />
          </MarkerIcon>
          <MarkerContent>Mira added Jun and Sol</MarkerContent>
        </Marker>
        <Bubble variant="secondary">
          <BubbleContent>
            Kicking off the marker component. Dates, events, the works.
          </BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>Can the dates stick while you scroll?</BubbleContent>
        </Bubble>
      </section>
      <section className="flex flex-col gap-3 py-3">
        <Marker variant="separator" sticky>
          <MarkerContent>
            <MarkerTime date={new Date(Date.now() - day)} />
          </MarkerContent>
        </Marker>
        <Marker className="justify-center">
          <MarkerIcon>
            <IconPencil />
          </MarkerIcon>
          <MarkerContent>Jun renamed the thread to “Marker”</MarkerContent>
        </Marker>
        <Bubble variant="secondary">
          <BubbleContent>
            They do now. Scroll up and the date turns into a pill.
          </BubbleContent>
        </Bubble>
        <Marker className="justify-center">
          <MarkerIcon>
            <IconPin />
          </MarkerIcon>
          <MarkerContent>Sol pinned a message</MarkerContent>
        </Marker>
      </section>
      <section className="flex flex-col gap-3 pt-3 pb-4">
        <Marker variant="separator" sticky>
          <MarkerContent>
            <MarkerTime date={new Date()} />
          </MarkerContent>
        </Marker>
        <BubbleGroup>
          <Bubble align="end">
            <BubbleContent>Docs are written.</BubbleContent>
          </Bubble>
          <Bubble align="end">
            <BubbleContent>
              Screenshots look right in dark mode too.
            </BubbleContent>
          </Bubble>
        </BubbleGroup>
        <Marker className="justify-center">
          <MarkerIcon>
            <IconGitMerge className="text-success" />
          </MarkerIcon>
          <MarkerContent>
            Sol merged <a href="#">#482</a> into main
          </MarkerContent>
        </Marker>
        <Marker variant="separator">
          <MarkerContent>New messages</MarkerContent>
        </Marker>
        <Bubble variant="secondary">
          <BubbleContent>Shipping it 🎉</BubbleContent>
        </Bubble>
      </section>
    </div>
  )
}

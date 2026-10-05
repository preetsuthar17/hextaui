"use client"

import { IconMapPin } from "@tabler/icons-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  createHoverCardHandle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

type Person = {
  handle: string
  name: string
  initials: string
  bio: string
  location: string
}

const people: Record<string, Person> = {
  mira: {
    handle: "mira",
    name: "Mira Okafor",
    initials: "MO",
    bio: "Design engineer. Obsessed with easing curves.",
    location: "Lagos",
  },
  jun: {
    handle: "jun",
    name: "Jun Park",
    initials: "JP",
    bio: "Maintains the motion tokens and keeps the docs honest about what ships.",
    location: "Seoul",
  },
  sol: {
    handle: "sol",
    name: "Sol Ferreira",
    initials: "SF",
    bio: "Accessibility.",
    location: "Lisbon",
  },
}

const profile = createHoverCardHandle<Person>()

function Mention({ person }: { person: Person }) {
  return (
    <HoverCardTrigger
      handle={profile}
      payload={person}
      href="#"
      delay={250}
      render={
        <a className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground" />
      }
    >
      @{person.handle}
    </HoverCardTrigger>
  )
}

export function HoverCardDemo() {
  return (
    <>
      <p className="max-w-sm text-center text-sm/relaxed text-muted-foreground">
        Shipped by <Mention person={people.mira} />, reviewed by{" "}
        <Mention person={people.jun} /> and tested with a screen reader by{" "}
        <Mention person={people.sol} />.
      </p>
      <HoverCard handle={profile}>
        {({ payload }) => (
          <HoverCardContent arrow>
            {payload && (
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback>{payload.initials}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="font-medium">{payload.name}</p>
                  <p className="text-muted-foreground">{payload.bio}</p>
                  <p className="flex items-center gap-1 pt-1 text-xs text-muted-foreground">
                    <IconMapPin className="size-3.5" aria-hidden="true" />
                    {payload.location}
                  </p>
                </div>
              </div>
            )}
          </HoverCardContent>
        )}
      </HoverCard>
    </>
  )
}

"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  createHoverCardHandle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

type Person = { name: string; initials: string; role: string }

const team: Person[] = [
  { name: "Ada Lovelace", initials: "AL", role: "Analyst" },
  { name: "Alan Turing", initials: "AT", role: "Research" },
  { name: "Grace Hopper", initials: "GH", role: "Compilers" },
]

const profileCard = createHoverCardHandle<Person>()

export function HoverCardDetached() {
  return (
    <div className="flex flex-col items-center gap-3">
      <ul className="flex flex-col items-start gap-2 text-sm">
        {team.map((person) => (
          <li key={person.name}>
            <HoverCardTrigger
              handle={profileCard}
              payload={person}
              href="#"
              delay={300}
              render={
                <a className="font-medium underline decoration-border underline-offset-4 hover:decoration-foreground" />
              }
            >
              {person.name}
            </HoverCardTrigger>
          </li>
        ))}
      </ul>
      <HoverCard handle={profileCard}>
        {({ payload }) => (
          <HoverCardContent side="inline-end" align="start" className="w-56">
            {payload ? (
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{payload.initials}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col">
                  <p className="font-medium">{payload.name}</p>
                  <p className="text-muted-foreground">{payload.role}</p>
                </div>
              </div>
            ) : null}
          </HoverCardContent>
        )}
      </HoverCard>
    </div>
  )
}

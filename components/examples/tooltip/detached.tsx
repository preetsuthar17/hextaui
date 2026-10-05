"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  createTooltipHandle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Person = { name: string; initials: string; status: string }

const people: Person[] = [
  { name: "Ada Lovelace", initials: "AL", status: "Online" },
  { name: "Alan Turing", initials: "AT", status: "In a meeting" },
  { name: "Grace Hopper", initials: "GH", status: "Away" },
]

const presence = createTooltipHandle<Person>()

export function TooltipDetached() {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {people.map((person) => (
          <TooltipTrigger
            key={person.name}
            handle={presence}
            payload={person}
            aria-label={person.name}
            render={
              <button className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden" />
            }
          >
            <Avatar>
              <AvatarFallback>{person.initials}</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
        ))}
        <Tooltip handle={presence}>
          {({ payload }) => (
            <TooltipContent side="bottom">
              {payload ? `${payload.name} · ${payload.status}` : null}
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

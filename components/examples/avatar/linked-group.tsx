"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  getInitials,
} from "@/components/ui/avatar"

const team = [
  "Ada Lovelace",
  "Alan Turing",
  "Grace Hopper",
  "Linus Torvalds",
  "Margaret Hamilton",
]

export function AvatarLinkedGroup() {
  return (
    <AvatarGroup aria-label="Team" size="lg">
      {team.map((name) => (
        <Avatar key={name} render={<a href="#" aria-label={name} />}>
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount count={3} />
    </AvatarGroup>
  )
}

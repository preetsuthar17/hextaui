"use client"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  getInitials,
} from "@/components/ui/avatar"

const people = [
  { name: "Ada Lovelace", image: "/preview/landscape.svg" },
  { name: "Alan Turing", image: "/preview/landscape.svg" },
  { name: "Grace Hopper", image: "/preview/landscape.svg" },
  { name: "Katherine Johnson", image: null },
  { name: "Linus Torvalds", image: null },
  { name: "Margaret Hamilton", image: null },
  { name: "Tim Berners-Lee", image: null },
  { name: "Barbara Liskov", image: null },
]

export function AvatarRtl() {
  return (
    <div dir="rtl" className="flex flex-wrap items-center gap-4">
      <Avatar size="lg">
        <AvatarFallback>{getInitials("محمد علي")}</AvatarFallback>
        <AvatarBadge status="online" />
      </Avatar>
      <AvatarGroup max={4}>
        {people.map((person) => (
          <Avatar key={person.name}>
            {person.image ? <AvatarImage src={person.image} alt="" /> : null}
            <AvatarFallback>{getInitials(person.name)}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
    </div>
  )
}

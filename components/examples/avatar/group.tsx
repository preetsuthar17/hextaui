"use client"

import {
  Avatar,
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

const sizes = ["xs", "sm", "default", "lg", "xl"] as const

export function AvatarGroupDemo() {
  return (
    <div className="flex flex-col items-start gap-4">
      {sizes.map((size) => (
        <AvatarGroup key={size} size={size} max={4}>
          {people.map((person) => (
            <Avatar key={person.name}>
              {person.image ? <AvatarImage src={person.image} alt="" /> : null}
              <AvatarFallback>{getInitials(person.name)}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      ))}
      <AvatarGroup shape="square" max={5}>
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

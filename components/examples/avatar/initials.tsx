"use client"

import { Avatar, AvatarFallback, getInitials } from "@/components/ui/avatar"

const names = [
  "Ada Lovelace",
  "Madonna",
  "jean-luc picard",
  "ada.lovelace+news@example.com",
  "(Admin) John",
  "👩‍👩‍👧‍👦 Family",
  "山田 太郎",
  "محمد علي",
  "Z̷̢̛͖͓̰̈́algo T̵ext",
  "Mary Ann Evans Cross",
  "!!! ???",
  "",
]

export function AvatarInitials() {
  return (
    <ul className="grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
      {names.map((name) => (
        <li key={name} className="flex min-w-0 items-center gap-2 text-sm">
          <Avatar>
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <span className="min-w-0 truncate text-muted-foreground">
            {name || "(empty)"}
          </span>
        </li>
      ))}
    </ul>
  )
}

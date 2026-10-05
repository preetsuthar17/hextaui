"use client"

import { IconCopy, IconLink } from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"

const people = [
  { handle: "preetsuthar17", initials: "PS" },
  { handle: "shadcn", initials: "SC" },
  { handle: "rauchg", initials: "GR" },
  { handle: "leerob", initials: "LR" },
  { handle: "emilkowalski", initials: "EK" },
  { handle: "jh3y", initials: "JH" },
]

const access = [
  { value: "view", label: "Can view" },
  { value: "comment", label: "Can comment" },
  { value: "edit", label: "Can edit" },
]

const link = "https://hextaui.com/s/q3-roadmap"

function ShareCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Share “Q3 roadmap”</CardTitle>
        <CardDescription>Anyone with the link can open it.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <AvatarGroup max={4}>
              {people.map((person) => (
                <Avatar key={person.handle}>
                  <AvatarImage
                    src={`https://github.com/${person.handle}.png`}
                    alt=""
                  />
                  <AvatarFallback>{person.initials}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
            <Select items={access} defaultValue="comment">
              <SelectTrigger size="sm" aria-label="Link access">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {access.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <InputGroup>
            <InputGroupInput readOnly value={link} aria-label="Share link" />
            <InputGroupAddon>
              <IconLink />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label="Copy link"
                onClick={async () => {
                  await navigator.clipboard.writeText(link)
                  toast("Link copied")
                }}
              >
                <IconCopy />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <Button variant="secondary">Invite people</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { ShareCard }

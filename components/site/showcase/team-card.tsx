"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"

const roles = [
  { value: "owner", label: "Owner" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
]

const members = [
  {
    name: "Preet Suthar",
    email: "preet@hextaui.com",
    avatar: "https://github.com/preetsuthar17.png",
    initials: "PS",
    role: "owner",
  },
  {
    name: "shadcn",
    email: "shadcn@example.com",
    avatar: "https://github.com/shadcn.png",
    initials: "SC",
    role: "editor",
  },
  {
    name: "Guillermo Rauch",
    email: "rauchg@example.com",
    avatar: "https://github.com/rauchg.png",
    initials: "GR",
    role: "viewer",
  },
]

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function TeamCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team members</CardTitle>
        <CardDescription>Invite people to collaborate.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <form
            className="flex gap-2"
            onSubmit={async (event) => {
              event.preventDefault()
              const form = event.currentTarget
              const email = new FormData(form).get("email")
              await wait(600)
              toast("Invite sent", { description: `${email}` })
              form.reset()
            }}
          >
            <InputGroup>
              <InputGroupInput
                name="email"
                type="email"
                required
                placeholder="name@company.com"
                aria-label="Email"
              />
              <InputGroupAddon align="inline-end">
                <Button type="submit" size="xs">
                  Invite
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </form>
          <Separator />
          <ul className="flex flex-col gap-4">
            {members.map((member) => (
              <li key={member.email} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.avatar} alt="" />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium">{member.name}</span>
                  <span className="truncate text-muted-foreground">
                    {member.email}
                  </span>
                </div>
                <Select items={roles} defaultValue={member.role}>
                  <SelectTrigger
                    size="sm"
                    aria-label={`Role for ${member.name}`}
                    className="w-24"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export { TeamCard }

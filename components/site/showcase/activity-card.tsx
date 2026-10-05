"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

const events = [
  {
    handle: "preetsuthar17",
    initials: "PS",
    title: "Preet deployed to production",
    description: "main · 7b171bf is live",
    time: "2m",
  },
  {
    handle: "shadcn",
    initials: "SC",
    title: "shadcn merged a pull request",
    description: "feat: questionnaire component",
    time: "1h",
  },
  {
    handle: "emilkowalski",
    initials: "EK",
    title: "Emil left a comment",
    description: "“The OTP shake is so good.”",
    time: "3h",
  },
  {
    handle: "rauchg",
    initials: "GR",
    title: "Guillermo starred the repo",
    description: "and 12 others this week",
    time: "5h",
  },
]

function ActivityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>What happened today.</CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {events.map((event) => (
            <Item key={event.title} size="sm">
              <ItemMedia>
                <Avatar>
                  <AvatarImage
                    src={`https://github.com/${event.handle}.png`}
                    alt=""
                  />
                  <AvatarFallback>{event.initials}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{event.title}</ItemTitle>
                <ItemDescription>{event.description}</ItemDescription>
              </ItemContent>
              <span className="text-xs text-muted-foreground tabular-nums">
                {event.time}
              </span>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}

export { ActivityCard }

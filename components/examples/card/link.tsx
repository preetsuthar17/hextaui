"use client"

import * as React from "react"
import { IconGitBranch, IconStar } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLink,
  CardTitle,
} from "@/components/ui/card"

const projects = [
  {
    name: "Acme website",
    description: "Marketing site and docs, deployed on every push.",
    stars: 128,
    branch: "main",
  },
  {
    name: "Payments service",
    description: "Card processing, webhooks and the reconciliation job.",
    stars: 42,
    branch: "release/2.4",
  },
]

export function CardClickable() {
  const [starred, setStarred] = React.useState<string[]>([])

  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {projects.map((project) => {
        const isStarred = starred.includes(project.name)

        return (
          <Card key={project.name}>
            <CardHeader>
              <CardTitle>
                <CardLink href="#">{project.name}</CardLink>
              </CardTitle>
              <CardDescription>{project.description}</CardDescription>
              <CardAction>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Star ${project.name}`}
                  aria-pressed={isStarred}
                  onClick={() =>
                    setStarred(
                      isStarred
                        ? starred.filter((name) => name !== project.name)
                        : [...starred, project.name]
                    )
                  }
                >
                  <IconStar className={isStarred ? "fill-current" : ""} />
                </Button>
              </CardAction>
            </CardHeader>
            <CardFooter>
              <span className="flex items-center gap-1 text-muted-foreground">
                <IconGitBranch className="size-4" />
                {project.branch}
              </span>
              <span className="ms-auto text-muted-foreground">
                {project.stars + (isStarred ? 1 : 0)} stars
              </span>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

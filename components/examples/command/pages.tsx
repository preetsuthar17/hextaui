"use client"

import * as React from "react"
import {
  IconBrandGithub,
  IconFolder,
  IconFolderPlus,
  IconUsers,
} from "@tabler/icons-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPage,
} from "@/components/ui/command"

const projects = ["hextaui", "marketing-site", "design-tokens"]
const members = ["Ada Lovelace", "Grace Hopper", "Alan Turing"]

export function CommandPages() {
  const [last, setLast] = React.useState<string>()

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Command>
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Workspace">
            <CommandItem page="projects" pageTitle="Projects">
              <IconFolder />
              Projects
            </CommandItem>
            <CommandItem page="members" pageTitle="Members">
              <IconUsers />
              Members
            </CommandItem>
            <CommandItem onSelect={() => setLast("New project")}>
              <IconFolderPlus />
              New project
            </CommandItem>
          </CommandGroup>
          <CommandPage id="projects">
            <CommandGroup heading="Projects">
              {projects.map((project) => (
                <CommandItem key={project} onSelect={setLast}>
                  <IconBrandGithub />
                  {project}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandPage>
          <CommandPage id="members">
            <CommandGroup heading="Members">
              {members.map((member) => (
                <CommandItem key={member} onSelect={setLast}>
                  <IconUsers />
                  {member}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandPage>
        </CommandList>
      </Command>
      <p className="text-sm text-muted-foreground">
        {last ? `Selected “${last}”.` : "Nothing selected yet."}
      </p>
    </div>
  )
}

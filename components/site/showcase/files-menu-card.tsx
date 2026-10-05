"use client"

import * as React from "react"
import {
  IconCopy,
  IconDots,
  IconDownload,
  IconFileText,
  IconPencil,
  IconPhoto,
  IconTable,
  IconTrash,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/toast"

const initial = [
  { name: "brand-guidelines.pdf", meta: "2.4 MB · Today", icon: IconFileText },
  { name: "launch-hero.png", meta: "1.8 MB · Yesterday", icon: IconPhoto },
  { name: "q3-forecast.csv", meta: "640 KB · Oct 2", icon: IconTable },
]

function FilesMenuCard() {
  const [files, setFiles] = React.useState(initial)

  const actions = (name: string) => [
    {
      label: "Rename",
      icon: IconPencil,
      shortcut: "↵",
      run: () => toast(`Rename ${name}`),
    },
    {
      label: "Duplicate",
      icon: IconCopy,
      shortcut: "⌘D",
      run: () => toast(`Duplicated ${name}`),
    },
    {
      label: "Download",
      icon: IconDownload,
      shortcut: "⌘S",
      run: () => toast(`Downloading ${name}`),
    },
  ]

  const remove = (name: string) => {
    setFiles((current) => current.filter((file) => file.name !== name))
    toast(`Deleted ${name}`, {
      action: { label: "Undo", onClick: () => setFiles(initial) },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Files</CardTitle>
        <CardDescription>Right-click a file, or use the menu.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-1">
          {files.map((file) => (
            <li key={file.name}>
              <ContextMenu>
                <ContextMenuTrigger className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-muted data-popup-open:bg-muted">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <file.icon className="size-4" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {file.meta}
                    </span>
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Actions for ${file.name}`}
                        />
                      }
                    >
                      <IconDots />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {actions(file.name).map((action) => (
                        <DropdownMenuItem
                          key={action.label}
                          onClick={action.run}
                        >
                          <action.icon />
                          {action.label}
                          <DropdownMenuShortcut>
                            {action.shortcut}
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => remove(file.name)}
                      >
                        <IconTrash />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  {actions(file.name).map((action) => (
                    <ContextMenuItem key={action.label} onClick={action.run}>
                      <action.icon />
                      {action.label}
                      <ContextMenuShortcut>
                        {action.shortcut}
                      </ContextMenuShortcut>
                    </ContextMenuItem>
                  ))}
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    variant="destructive"
                    onClick={() => remove(file.name)}
                  >
                    <IconTrash />
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export { FilesMenuCard }

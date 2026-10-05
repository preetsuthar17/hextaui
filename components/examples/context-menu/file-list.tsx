"use client"

import * as React from "react"
import {
  IconCopy,
  IconDownload,
  IconFile,
  IconFolder,
  IconLink,
  IconMail,
  IconPencil,
  IconRefresh,
  IconShare,
  IconStar,
  IconTrash,
} from "@tabler/icons-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

const files = [
  { name: "Quarterly report.pdf", kind: "file" },
  { name: "Brand assets", kind: "folder" },
  { name: "Roadmap 2027.md", kind: "file" },
] as const

function FileRow({
  name,
  kind,
  onDelete,
}: {
  name: string
  kind: "file" | "folder"
  onDelete: () => void
}) {
  const [starred, setStarred] = React.useState(false)
  const Icon = kind === "folder" ? IconFolder : IconFile

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted/50 data-popup-open:bg-muted">
        <Icon className="size-4 text-muted-foreground" aria-hidden />
        <span className="min-w-0 flex-1 truncate">{name}</span>
        {starred ? (
          <IconStar
            className="size-4 text-muted-foreground"
            aria-label="Starred"
          />
        ) : null}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <IconPencil />
          Rename…
        </ContextMenuItem>
        <ContextMenuItem>
          <IconCopy />
          Duplicate
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <IconDownload />
          Download
        </ContextMenuItem>
        <ContextMenuCheckboxItem checked={starred} onCheckedChange={setStarred}>
          Starred
        </ContextMenuCheckboxItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <IconShare />
            Share
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>
              <IconMail />
              Email
            </ContextMenuItem>
            <ContextMenuItem>
              <IconLink />
              Copy link
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" onClick={onDelete}>
          <IconTrash />
          Delete
          <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export function ContextMenuFileList() {
  const [pending, setPending] = React.useState<string | null>(null)
  const [removed, setRemoved] = React.useState<string[]>([])

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex flex-col gap-0.5 rounded-xl border p-1">
        {files
          .filter((file) => !removed.includes(file.name))
          .map((file) => (
            <FileRow
              key={file.name}
              name={file.name}
              kind={file.kind}
              onDelete={() => setPending(file.name)}
            />
          ))}
      </div>
      <div>
        <Button variant="outline" size="sm" onClick={() => setRemoved([])}>
          <IconRefresh />
          Restore files
        </Button>
      </div>
      <AlertDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPending(null)
          }
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{pending}”?</AlertDialogTitle>
            <AlertDialogDescription>
              It moves to the trash for 30 days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (pending) {
                  setRemoved((value) => [...value, pending])
                }
                setPending(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

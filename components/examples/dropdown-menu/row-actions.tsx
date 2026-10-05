"use client"

import * as React from "react"
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react"

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
  createDropdownMenuHandle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const files = ["Quarterly report.pdf", "Brand assets", "Roadmap 2027.md"]

const rowMenu = createDropdownMenuHandle<{ name: string }>()

export function DropdownMenuRowActions() {
  const [pending, setPending] = React.useState<string | null>(null)
  const [removed, setRemoved] = React.useState<string[]>([])

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <ul className="flex flex-col gap-0.5 rounded-xl border p-1">
        {files
          .filter((name) => !removed.includes(name))
          .map((name) => (
            <li
              key={name}
              className="flex items-center gap-3 rounded-lg py-1 ps-3 pe-1 text-sm"
            >
              <span className="min-w-0 flex-1 truncate">{name}</span>
              <DropdownMenuTrigger
                handle={rowMenu}
                payload={{ name }}
                aria-label={`Actions for ${name}`}
                render={<Button variant="ghost" size="icon-sm" />}
              >
                <IconDots />
              </DropdownMenuTrigger>
            </li>
          ))}
      </ul>
      <div>
        <Button variant="outline" size="sm" onClick={() => setRemoved([])}>
          Restore files
        </Button>
      </div>
      <DropdownMenu handle={rowMenu}>
        {({ payload }) => (
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <IconPencil />
              Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setPending(payload?.name ?? null)}
            >
              <IconTrash />
              Delete…
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
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

"use client"

import * as React from "react"
import { IconFileText, IconPlus, IconX } from "@tabler/icons-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Button } from "@/components/ui/button"

export function AttachmentComposer() {
  const [files, setFiles] = React.useState([
    { id: 1, name: "brief.pdf" },
    { id: 2, name: "moodboard.fig" },
    { id: 3, name: "timeline.xlsx" },
  ])

  return (
    <div className="flex w-full flex-col gap-3">
      <AttachmentGroup className="rounded-lg border">
        {files.map((file) => (
          <Attachment key={file.id} size="sm">
            <AttachmentMedia>
              <IconFileText />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{file.name}</AttachmentTitle>
              <AttachmentDescription>Attached</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction
                aria-label={`Remove ${file.name}`}
                onClick={() =>
                  setFiles((current) =>
                    current.filter((item) => item.id !== file.id)
                  )
                }
              >
                <IconX />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        ))}
      </AttachmentGroup>
      <Button
        size="sm"
        variant="outline"
        className="self-start"
        onClick={() =>
          setFiles((current) => [
            ...current,
            { id: Date.now(), name: `notes-${current.length + 1}.txt` },
          ])
        }
      >
        <IconPlus data-icon="inline-start" />
        Add file
      </Button>
    </div>
  )
}

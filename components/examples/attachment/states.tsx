import { IconFileText, IconX } from "@tabler/icons-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  type AttachmentState,
} from "@/components/ui/attachment"

const files: { state: AttachmentState; description: string }[] = [
  { state: "idle", description: "Waiting to upload" },
  { state: "uploading", description: "Uploading… 42%" },
  { state: "processing", description: "Processing" },
  { state: "error", description: "Upload failed · file too large" },
  { state: "done", description: "PDF · 2.4 MB" },
]

export function AttachmentStates() {
  return (
    <div className="flex flex-col gap-2">
      {files.map(({ state, description }) => (
        <Attachment
          key={state}
          state={state}
          progress={state === "uploading" ? 42 : undefined}
        >
          <AttachmentMedia>
            <IconFileText />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{`${state}-report.pdf`}</AttachmentTitle>
            <AttachmentDescription>{description}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label={`Remove ${state}-report.pdf`}>
              <IconX />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </div>
  )
}

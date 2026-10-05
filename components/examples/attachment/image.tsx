import { IconX } from "@tabler/icons-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"

export function AttachmentImage() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-3">
      <Attachment>
        <AttachmentMedia variant="image">
          <img src="/preview/landscape.svg" alt="" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>dolomites.png</AttachmentTitle>
          <AttachmentDescription>PNG · 1.1 MB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment orientation="vertical">
        <AttachmentMedia variant="image">
          <img src="/preview/landscape.svg" alt="" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>dolomites.png</AttachmentTitle>
          <AttachmentDescription>PNG · 1.1 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove dolomites.png">
            <IconX />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment orientation="vertical" state="uploading" progress={64}>
        <AttachmentMedia variant="image">
          <img src="/preview/landscape.svg" alt="" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>summit.png</AttachmentTitle>
          <AttachmentDescription>Uploading… 64%</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </div>
  )
}

import { IconFileZip } from "@tabler/icons-react"

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"

const files = Array.from(
  { length: 10 },
  (_, index) => `export-${index + 1}.zip`
)

export function AttachmentGroupDemo() {
  return (
    <AttachmentGroup className="w-full rounded-lg border">
      {files.map((name) => (
        <Attachment key={name}>
          <AttachmentMedia>
            <IconFileZip />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{name}</AttachmentTitle>
            <AttachmentDescription>ZIP · 18 MB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      ))}
    </AttachmentGroup>
  )
}

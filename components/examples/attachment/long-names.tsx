import { IconFileText } from "@tabler/icons-react"

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"

export function AttachmentLongNames() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Attachment>
        <AttachmentMedia>
          <IconFileText />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>
            quarterly-sales-report-final-v3-approved-by-finance.pdf
          </AttachmentTitle>
          <AttachmentDescription>PDF · 5.2 MB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment>
        <AttachmentMedia>
          <IconFileText />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>
            a-file-without-any-extension-at-all-just-a-long-name
          </AttachmentTitle>
          <AttachmentDescription>File · 12 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </div>
  )
}

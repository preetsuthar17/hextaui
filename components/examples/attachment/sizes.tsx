import { IconFileText, IconX } from "@tabler/icons-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"

const sizes = ["default", "sm", "xs"] as const

export function AttachmentSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {sizes.map((size) => (
        <Attachment key={size} size={size}>
          <AttachmentMedia>
            <IconFileText />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>invoice.pdf</AttachmentTitle>
            <AttachmentDescription>{size}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove invoice.pdf">
              <IconX />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </div>
  )
}

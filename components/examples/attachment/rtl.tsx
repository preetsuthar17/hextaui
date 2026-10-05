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

export function AttachmentRtl() {
  return (
    <div dir="rtl">
      <Attachment>
        <AttachmentMedia>
          <IconFileText />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>تقرير-المبيعات-الربعي-النهائي.pdf</AttachmentTitle>
          <AttachmentDescription>PDF · 2.4 ميغابايت</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="إزالة الملف">
            <IconX />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  )
}

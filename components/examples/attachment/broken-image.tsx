import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"

export function AttachmentBrokenImage() {
  return (
    <Attachment>
      <AttachmentMedia variant="image">
        <img src="/preview/missing.png" alt="" />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>missing.png</AttachmentTitle>
        <AttachmentDescription>Preview unavailable</AttachmentDescription>
      </AttachmentContent>
    </Attachment>
  )
}

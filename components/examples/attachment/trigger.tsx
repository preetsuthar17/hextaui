import { IconDownload, IconFileZip, IconX } from "@tabler/icons-react"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"

export function AttachmentTriggerDemo() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <AlertDialog>
        <Attachment>
          <AttachmentMedia>
            <IconFileZip />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>research-summary.zip</AttachmentTitle>
            <AttachmentDescription>ZIP · 4.8 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove research-summary.zip">
              <IconX />
            </AttachmentAction>
          </AttachmentActions>
          <AlertDialogTrigger
            render={
              <AttachmentTrigger aria-label="Preview research-summary.zip" />
            }
          />
        </Attachment>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>research-summary.zip</AlertDialogTitle>
            <AlertDialogDescription>
              12 files · 4.8 MB · Uploaded today
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Attachment>
        <AttachmentMedia variant="image">
          <img src="/preview/landscape.svg" alt="" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>workspace.png</AttachmentTitle>
          <AttachmentDescription>Opens in a new tab</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Download workspace.png">
            <IconDownload />
          </AttachmentAction>
        </AttachmentActions>
        <AttachmentTrigger
          render={
            <a
              href="/preview/landscape.svg"
              target="_blank"
              rel="noreferrer"
              aria-label="Open workspace.png"
            />
          }
        />
      </Attachment>
    </div>
  )
}

"use client"

import * as React from "react"
import { IconArrowUp, IconPaperclip } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputList,
  FileInputRejections,
  FileInputTrigger,
} from "@/components/ui/ui-sdk-file-input"

function UiSdkFileInputAttachments() {
  const message = React.useRef<HTMLTextAreaElement>(null)

  return (
    <FileInput multiple maxFiles={4} maxSize={20_000_000} className="max-w-lg">
      <FileInputDropzone
        variant="composer"
        pasteTarget={() => message.current}
      >
        <FileInputList aria-label="Attachments" layout="chips">
          <FileInputItem />
        </FileInputList>
        <textarea
          ref={message}
          aria-label="Message"
          placeholder="Ask anything, or paste a screenshot"
          rows={2}
          className="field-sizing-content max-h-40 min-h-12 w-full resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground pointer-coarse:text-touch"
        />
        <div className="flex items-center justify-between">
          <FileInputTrigger
            variant="ghost"
            size="icon-sm"
            aria-label="Attach files"
          >
            <IconPaperclip aria-hidden="true" />
          </FileInputTrigger>
          <Button type="button" size="icon-sm" shape="pill" aria-label="Send">
            <IconArrowUp aria-hidden="true" />
          </Button>
        </div>
      </FileInputDropzone>
      <FileInputRejections />
    </FileInput>
  )
}

export { UiSdkFileInputAttachments }

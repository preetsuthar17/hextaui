"use client"

import { IconUpload } from "@tabler/icons-react"

import { FileInput, FileInputTrigger } from "@/components/ui/ui-sdk-file-input"

function UiSdkFileInputButton() {
  return (
    <FileInput accept=".pdf,.doc,.docx">
      {(state) => (
        <div className="flex min-w-0 items-center gap-3">
          <FileInputTrigger>
            <IconUpload aria-hidden="true" />
            {state.value[0] ? "Replace resume" : "Upload resume"}
          </FileInputTrigger>
          <span className="min-w-0 truncate text-sm text-muted-foreground">
            {state.value[0]?.name ?? "No file chosen"}
          </span>
        </div>
      )}
    </FileInput>
  )
}

export { UiSdkFileInputButton }

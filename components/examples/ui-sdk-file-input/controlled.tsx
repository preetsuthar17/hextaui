"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  FileInput,
  FileInputItem,
  FileInputList,
  createFileInputController,
  formatFileSize,
} from "@/components/ui/ui-sdk-file-input"

function UiSdkFileInputControlled() {
  const [files, setFiles] = React.useState<File[]>([])
  const [picker] = React.useState(createFileInputController)
  const total = files.reduce((sum, file) => sum + file.size, 0)

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => picker.open()}>
          Choose files
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={files.length === 0}
          onClick={() => picker.clear()}
        >
          Clear
        </Button>
        <span className="ms-auto text-sm text-muted-foreground tabular-nums">
          {files.length === 0
            ? "No files"
            : `${files.length} ${files.length === 1 ? "file" : "files"}, ${formatFileSize(total)}`}
        </span>
      </div>
      <FileInput
        multiple
        controller={picker}
        value={files}
        onValueChange={(value) => setFiles(value)}
      >
        <FileInputList aria-label="Chosen files">
          <FileInputItem />
        </FileInputList>
      </FileInput>
    </div>
  )
}

export { UiSdkFileInputControlled }

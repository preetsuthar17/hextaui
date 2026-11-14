"use client"

import * as React from "react"

import {
  FileInput,
  FileInputDropzone,
  FileInputDropzoneDescription,
  FileInputDropzoneTitle,
  FileInputItem,
  FileInputList,
  FileInputRejections,
  FileInputTrigger,
  createFileInputController,
} from "@/components/ui/ui-sdk-file-input"

function UiSdkFileInputLimits() {
  const [files] = React.useState(createFileInputController)

  return (
    <FileInput
      multiple
      controller={files}
      accept=".pdf"
      maxFiles={3}
      minSize={1}
      maxSize={2_000_000}
      validate={(file) =>
        files.getValue().some((other) => other.name === file.name)
          ? "Already added"
          : null
      }
      className="max-w-md"
    >
      <FileInputDropzone className="min-h-32">
        <FileInputDropzoneTitle>Drop up to 3 PDFs</FileInputDropzoneTitle>
        <FileInputDropzoneDescription>
          2 MB each, no empty files and no duplicates.
        </FileInputDropzoneDescription>
        <FileInputTrigger className="mt-3">Choose PDFs</FileInputTrigger>
      </FileInputDropzone>
      <FileInputRejections />
      <FileInputList aria-label="PDFs">
        <FileInputItem />
      </FileInputList>
    </FileInput>
  )
}

export { UiSdkFileInputLimits }

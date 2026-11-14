"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  FileInput,
  FileInputDropzone,
  FileInputDropzoneDescription,
  FileInputDropzoneTitle,
  FileInputItem,
  FileInputList,
  FileInputRejections,
  FileInputTrigger,
} from "@/components/ui/ui-sdk-file-input"

function UiSdkFileInputForm() {
  const [submitted, setSubmitted] = React.useState<string[] | null>(null)

  return (
    <form
      className="flex w-full max-w-md flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setSubmitted(
          data
            .getAll("attachments")
            .flatMap((entry) =>
              entry instanceof File && entry.name ? [entry.name] : []
            )
        )
      }}
      onReset={() => setSubmitted(null)}
    >
      <FileInput name="attachments" multiple maxSize={10_000_000}>
        <FileInputDropzone className="min-h-32">
          <FileInputDropzoneTitle>Attach files</FileInputDropzoneTitle>
          <FileInputDropzoneDescription>
            Up to 10 MB each.
          </FileInputDropzoneDescription>
          <FileInputTrigger className="mt-3">Browse files</FileInputTrigger>
        </FileInputDropzone>
        <FileInputRejections />
        <FileInputList aria-label="Attachments">
          <FileInputItem />
        </FileInputList>
      </FileInput>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm">
          Submit
        </Button>
        <Button type="reset" size="sm" variant="ghost">
          Reset
        </Button>
      </div>
      <p className="m-0 text-sm text-muted-foreground">
        {submitted === null
          ? "Nothing submitted yet."
          : submitted.length
            ? `Submitted ${submitted.join(", ")}`
            : "Submitted with no files."}
      </p>
    </form>
  )
}

export { UiSdkFileInputForm }

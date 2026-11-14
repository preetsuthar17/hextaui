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
  FileInputTrigger,
} from "@/components/ui/ui-sdk-file-input"

function UiSdkFileInputInvalid() {
  const [invalid, setInvalid] = React.useState(false)
  const errorId = React.useId()

  return (
    <form
      noValidate
      className="flex w-full max-w-md flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const proof = data.get("proof")
        setInvalid(!(proof instanceof File && proof.name))
      }}
    >
      <FileInput
        name="proof"
        accept={["image/*", ".pdf"]}
        invalid={invalid}
        onValueChange={(value) => {
          if (value.length) setInvalid(false)
        }}
      >
        <FileInputDropzone className="min-h-32">
          <FileInputDropzoneTitle>Proof of address</FileInputDropzoneTitle>
          <FileInputDropzoneDescription>
            A utility bill or bank statement from the last 3 months.
          </FileInputDropzoneDescription>
          <FileInputTrigger
            className="mt-3"
            aria-describedby={invalid ? errorId : undefined}
          >
            Choose a file
          </FileInputTrigger>
        </FileInputDropzone>
        {invalid ? (
          <p id={errorId} className="m-0 text-sm text-destructive">
            Add a scan to continue.
          </p>
        ) : null}
        <FileInputList aria-label="Proof of address">
          <FileInputItem />
        </FileInputList>
      </FileInput>
      <Button type="submit" size="sm" className="self-start">
        Continue
      </Button>
    </form>
  )
}

export { UiSdkFileInputInvalid }

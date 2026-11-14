import {
  FileInput,
  FileInputDropzone,
  FileInputDropzoneDescription,
  FileInputDropzoneIcon,
  FileInputDropzoneTitle,
  FileInputItem,
  FileInputList,
  FileInputTrigger,
} from "@/components/ui/ui-sdk-file-input"

function UiSdkFileInputPageDrop() {
  return (
    <FileInput multiple className="max-w-md">
      <div className="flex items-center justify-between gap-3">
        <p className="m-0 text-sm text-muted-foreground">
          Drop files anywhere on this page.
        </p>
        <FileInputTrigger>Upload files</FileInputTrigger>
      </div>
      <FileInputDropzone target="document" variant="overlay">
        <FileInputDropzoneIcon />
        <FileInputDropzoneTitle>Drop to attach</FileInputDropzoneTitle>
        <FileInputDropzoneDescription>
          Files land in the list below.
        </FileInputDropzoneDescription>
      </FileInputDropzone>
      <FileInputList aria-label="Attachments">
        <FileInputItem />
      </FileInputList>
    </FileInput>
  )
}

export { UiSdkFileInputPageDrop }

import {
  FileInput,
  FileInputDropzone,
  FileInputDropzoneDescription,
  FileInputDropzoneIcon,
  FileInputDropzoneTitle,
  FileInputTrigger,
} from "@/components/ui/ui-sdk-file-input"

function UiSdkFileInputDisabled() {
  return (
    <FileInput disabled className="max-w-md">
      <FileInputDropzone>
        <FileInputDropzoneIcon />
        <FileInputDropzoneTitle>Uploads are paused</FileInputDropzoneTitle>
        <FileInputDropzoneDescription>
          Drops and pastes are ignored while the file input is disabled.
        </FileInputDropzoneDescription>
        <FileInputTrigger className="mt-3">Browse files</FileInputTrigger>
      </FileInputDropzone>
    </FileInput>
  )
}

export { UiSdkFileInputDisabled }

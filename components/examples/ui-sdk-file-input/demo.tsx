import {
  FileInput,
  FileInputDropzone,
  FileInputDropzoneDescription,
  FileInputDropzoneIcon,
  FileInputDropzoneTitle,
  FileInputItem,
  FileInputList,
  FileInputRejections,
  FileInputTrigger,
} from "@/components/ui/ui-sdk-file-input"

function UiSdkFileInputDemo() {
  return (
    <FileInput
      multiple
      accept={["image/*", ".pdf"]}
      maxFiles={5}
      maxSize={5_000_000}
      className="max-w-md"
    >
      <FileInputDropzone>
        <FileInputDropzoneIcon />
        <FileInputDropzoneTitle>Drop files here</FileInputDropzoneTitle>
        <FileInputDropzoneDescription>
          Images or PDFs, up to 5 files of 5 MB each. You can paste them too.
        </FileInputDropzoneDescription>
        <FileInputTrigger className="mt-3">Browse files</FileInputTrigger>
      </FileInputDropzone>
      <FileInputRejections />
      <FileInputList aria-label="Files">
        <FileInputItem />
      </FileInputList>
    </FileInput>
  )
}

export { UiSdkFileInputDemo }

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

function UiSdkFileInputImages() {
  return (
    <FileInput
      multiple
      accept="image/*"
      maxFiles={6}
      maxSize={10_000_000}
      className="max-w-md"
    >
      <FileInputDropzone className="min-h-32">
        <FileInputDropzoneIcon />
        <FileInputDropzoneTitle>Add photos</FileInputDropzoneTitle>
        <FileInputDropzoneDescription>
          Up to 6 images, 10 MB each.
        </FileInputDropzoneDescription>
        <FileInputTrigger className="mt-3">Choose photos</FileInputTrigger>
      </FileInputDropzone>
      <FileInputRejections />
      <FileInputList aria-label="Photos" layout="grid">
        <FileInputItem />
      </FileInputList>
    </FileInput>
  )
}

export { UiSdkFileInputImages }

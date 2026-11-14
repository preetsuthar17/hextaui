"use client"

import {
  FileInput,
  FileInputDropzone,
  FileInputDropzoneDescription,
  FileInputDropzoneIcon,
  FileInputDropzoneTitle,
  FileInputItem,
  FileInputItemContent,
  FileInputItemName,
  FileInputItemPreview,
  FileInputItemRemove,
  FileInputItemSize,
  FileInputList,
  FileInputTrigger,
} from "@/components/ui/ui-sdk-file-input"

function UiSdkFileInputRtl() {
  return (
    <div dir="rtl" className="w-full max-w-md">
      <FileInput multiple accept="image/*">
        <FileInputDropzone className="min-h-32">
          <FileInputDropzoneIcon />
          <FileInputDropzoneTitle>أفلت الصور هنا</FileInputDropzoneTitle>
          <FileInputDropzoneDescription>
            أو الصقها من الحافظة.
          </FileInputDropzoneDescription>
          <FileInputTrigger className="mt-3">تصفح الملفات</FileInputTrigger>
        </FileInputDropzone>
        <FileInputList aria-label="الصور">
          <FileInputItem>
            {({ file }) => (
              <>
                <FileInputItemPreview />
                <FileInputItemContent>
                  <FileInputItemName />
                  <FileInputItemSize locale="ar" />
                </FileInputItemContent>
                <FileInputItemRemove aria-label={`إزالة ${file.name}`} />
              </>
            )}
          </FileInputItem>
        </FileInputList>
      </FileInput>
    </div>
  )
}

export { UiSdkFileInputRtl }

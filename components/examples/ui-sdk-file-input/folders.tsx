import { IconFolder } from "@tabler/icons-react"

import {
  FileInput,
  FileInputItem,
  FileInputList,
  FileInputTrigger,
} from "@/components/ui/ui-sdk-file-input"

function UiSdkFileInputFolders() {
  return (
    <FileInput directory className="max-w-md">
      <FileInputTrigger className="self-start">
        <IconFolder aria-hidden="true" />
        Choose a folder
      </FileInputTrigger>
      <div className="max-h-72 overflow-y-auto overscroll-contain p-1 empty:hidden">
        <FileInputList aria-label="Folder contents">
          <FileInputItem />
        </FileInputList>
      </div>
    </FileInput>
  )
}

export { UiSdkFileInputFolders }

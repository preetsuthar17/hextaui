import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export function ResizableRtl() {
  return (
    <div
      dir="rtl"
      className="h-56 w-full max-w-md overflow-hidden rounded-xl border"
    >
      <ResizablePanelGroup>
        <ResizablePanel defaultSize="35%" minSize="20%">
          <div className="flex h-full items-center justify-center text-sm font-medium">
            القائمة
          </div>
        </ResizablePanel>
        <ResizableHandle showSize />
        <ResizablePanel minSize="20%">
          <div className="flex h-full items-center justify-center text-sm font-medium">
            المحتوى
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

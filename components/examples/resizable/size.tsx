import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export function ResizableSize() {
  return (
    <div className="h-56 w-full max-w-xl overflow-hidden rounded-xl border">
      <ResizablePanelGroup>
        <ResizablePanel defaultSize="320px" minSize="160px" maxSize="70%">
          <div className="flex h-full items-center justify-center text-sm font-medium">
            Canvas
          </div>
        </ResizablePanel>
        <ResizableHandle showSize="pixels" />
        <ResizablePanel minSize="20%">
          <div className="flex h-full items-center justify-center text-sm font-medium">
            Inspector
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export function ResizableWithHandle() {
  return (
    <div className="h-56 w-full max-w-md overflow-hidden rounded-xl border">
      <ResizablePanelGroup>
        <ResizablePanel defaultSize="40%" minSize="20%">
          <div className="flex h-full items-center justify-center text-sm font-medium">
            Preview
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize="20%">
          <div className="flex h-full items-center justify-center text-sm font-medium">
            Code
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

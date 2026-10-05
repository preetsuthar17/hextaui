import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export function ResizableVertical() {
  return (
    <div className="h-72 w-full max-w-md overflow-hidden rounded-xl border">
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel defaultSize="30%" minSize="20%">
          <div className="flex h-full items-center justify-center text-sm font-medium">
            Header
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize="30%">
          <div className="flex h-full items-center justify-center text-sm font-medium">
            Content
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

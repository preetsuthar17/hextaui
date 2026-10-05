"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  useDefaultLayout,
} from "@/components/ui/resizable"

export function ResizablePersist() {
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: "hextaui-resizable-persist",
  })

  return (
    <div className="h-56 w-full max-w-md overflow-hidden rounded-xl border">
      <ResizablePanelGroup
        defaultLayout={defaultLayout}
        onLayoutChanged={onLayoutChanged}
      >
        <ResizablePanel id="list" defaultSize="40%" minSize="20%">
          <div className="flex h-full items-center justify-center p-4 text-center text-sm font-medium">
            Resize me, then reload
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel id="detail" minSize="20%">
          <div className="flex h-full items-center justify-center text-sm font-medium">
            Detail
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

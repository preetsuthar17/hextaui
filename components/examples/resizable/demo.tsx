import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

function Pane({ title, children }: { title: string; children?: string }) {
  return (
    <div className="flex h-full flex-col gap-1 p-4">
      <span className="text-sm font-medium">{title}</span>
      <span className="text-sm text-muted-foreground">{children}</span>
    </div>
  )
}

export function ResizableDemo() {
  return (
    <div className="h-80 w-full max-w-2xl overflow-hidden rounded-xl border">
      <ResizablePanelGroup>
        <ResizablePanel defaultSize="28%" minSize="18%" maxSize="45%">
          <Pane title="Explorer">
            Drag the divider, or double-click it to reset.
          </Pane>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="65%" minSize="25%">
              <Pane title="Editor">
                Focus a divider and use the arrow keys.
              </Pane>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel minSize="15%">
              <Pane title="Terminal" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

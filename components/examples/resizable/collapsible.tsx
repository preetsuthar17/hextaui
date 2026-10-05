"use client"

import * as React from "react"
import { IconLayoutSidebar } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  usePanelRef,
} from "@/components/ui/resizable"

export function ResizableCollapsible() {
  const sidebar = usePanelRef()
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div className="flex h-72 w-full max-w-2xl flex-col overflow-hidden rounded-xl border">
      <div className="flex items-center gap-2 border-b p-2">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={collapsed ? "Show sidebar" : "Hide sidebar"}
          aria-pressed={!collapsed}
          onClick={() => {
            if (sidebar.current?.isCollapsed()) {
              sidebar.current.expand()
            } else {
              sidebar.current?.collapse()
            }
          }}
        >
          <IconLayoutSidebar />
        </Button>
        <span className="text-sm text-muted-foreground">
          Drag the sidebar narrow to collapse it, or press Enter on the divider.
        </span>
      </div>
      <div className="min-h-0 flex-1">
        <ResizablePanelGroup>
          <ResizablePanel
            panelRef={sidebar}
            collapsible
            defaultSize="30%"
            minSize="20%"
            collapsedSize="0%"
            onResize={(size) => setCollapsed(size.asPercentage === 0)}
          >
            <div className="flex h-full flex-col gap-1 p-4 text-sm">
              <span className="font-medium">Inbox</span>
              <span className="text-muted-foreground">Drafts</span>
              <span className="text-muted-foreground">Archive</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize="40%">
            <div className="flex h-full items-center justify-center text-sm font-medium">
              Message
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

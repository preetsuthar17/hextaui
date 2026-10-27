"use client"

import dynamic from "next/dynamic"

import { Spinner } from "@/components/ui/spinner"
import type { ProBlockInfo } from "@/lib/page-builder/doc"

function BuilderFallback() {
  return (
    <div className="flex h-[calc(100svh-3.5rem)] min-h-[36rem] flex-col border-y bg-background">
      <div className="h-12 shrink-0 border-b" />
      <div className="flex flex-1 items-center justify-center bg-muted/40 text-sm text-muted-foreground">
        <Spinner aria-hidden className="me-2" />
        Loading the builder
      </div>
    </div>
  )
}

const PageBuilder = dynamic(
  () =>
    import("@/components/page-builder/builder").then(
      (module) => module.PageBuilder
    ),
  { ssr: false, loading: BuilderFallback }
)

function PageBuilderLoader({ proBlocks }: { proBlocks: ProBlockInfo[] }) {
  return <PageBuilder proBlocks={proBlocks} />
}

export { PageBuilderLoader }

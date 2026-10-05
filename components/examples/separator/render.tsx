import { Separator } from "@/components/ui/separator"

export function SeparatorRender() {
  return (
    <p className="text-sm text-muted-foreground">
      <span className="inline-flex h-4 items-center gap-2 align-middle">
        <span>Ada Park</span>
        <Separator orientation="vertical" decorative render={<span />} />
        <time dateTime="2026-10-05">Oct 5, 2026</time>
        <Separator orientation="vertical" decorative render={<span />} />
        <span>4 min read</span>
      </span>
    </p>
  )
}

import { DocsShell } from "@/components/docs/docs-shell"
import { withNewBlocks } from "@/lib/new-entries"
import { blocksNav } from "@/lib/pro/catalog"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocsShell sections={withNewBlocks(blocksNav)}>{children}</DocsShell>
}

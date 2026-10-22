import { DocsShell } from "@/components/docs/docs-shell"
import { blocksNav } from "@/lib/pro/catalog"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocsShell sections={blocksNav}>{children}</DocsShell>
}

import { DocsShell } from "@/components/docs/docs-shell"
import { docsNav } from "@/lib/docs"
import { withNewEntries } from "@/lib/new-entries"

export default function Layout({ children }: LayoutProps<"/docs">) {
  return <DocsShell sections={withNewEntries(docsNav)}>{children}</DocsShell>
}

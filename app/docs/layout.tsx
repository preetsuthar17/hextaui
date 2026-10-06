import { DocsShell } from "@/components/docs/docs-shell"
import { docsNav } from "@/lib/docs"

export default function Layout({ children }: LayoutProps<"/docs">) {
  return <DocsShell sections={docsNav}>{children}</DocsShell>
}

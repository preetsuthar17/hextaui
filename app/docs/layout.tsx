import type { Metadata } from "next"

import { DocsShell } from "@/components/docs/docs-shell"
import { docsNav } from "@/lib/docs"

export const metadata: Metadata = {
  title: {
    template: "%s — HextaUI",
    default: "Docs — HextaUI",
  },
}

export default function Layout({ children }: LayoutProps<"/docs">) {
  return <DocsShell sections={docsNav}>{children}</DocsShell>
}

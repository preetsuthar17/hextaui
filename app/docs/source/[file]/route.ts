import { notFound } from "next/navigation"

import { DocsInstall } from "@/components/docs/docs-install"
import { docsEntries } from "@/lib/docs"
import { getDocsInstallSource } from "@/lib/docs-install-source"
import { findDocsElement, loadDocsPage } from "@/lib/docs-markdown"

export const dynamic = "force-static"
export const dynamicParams = false

async function getInstallFiles(slug: string) {
  const { default: Page } = await loadDocsPage(slug)
  const install = findDocsElement(await Page(), DocsInstall)
  return install ? (install.props.files as string[]) : []
}

export async function generateStaticParams() {
  const pages = await Promise.all(
    docsEntries.map(async ({ slug }) => ({
      slug,
      files: await getInstallFiles(slug),
    }))
  )
  return pages
    .filter((page) => page.files.length > 0)
    .map((page) => ({ file: `${page.slug}.json` }))
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/docs/source/[file]">
) {
  const { file } = await params
  const slug = file.replace(/\.json$/, "")

  if (
    !file.endsWith(".json") ||
    !docsEntries.some((entry) => entry.slug === slug)
  ) {
    notFound()
  }

  const files = await getInstallFiles(slug)

  if (files.length === 0) {
    notFound()
  }

  return Response.json({
    files: await Promise.all(files.map(getDocsInstallSource)),
  })
}

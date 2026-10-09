import { readDocsSource } from "@/lib/docs-source"
import { highlight } from "@/lib/highlight"
import { siteRepository } from "@/lib/site"

const installPreviewLines = 8

function getDocsSourceUrl(slug: string) {
  return `/docs/source/${slug}.json`
}

function getDocsSourceHref(file: string) {
  return `${siteRepository}/blob/main/${file}`
}

async function readInstallLines(path: string) {
  return (await readDocsSource(path)).trimEnd().split("\n")
}

async function getDocsInstallPreview(path: string) {
  const lines = await readInstallLines(path)
  const partial = lines.length > installPreviewLines

  return {
    path,
    partial,
    html: await highlight(
      (partial ? lines.slice(0, installPreviewLines) : lines).join("\n")
    ),
  }
}

async function getDocsInstallSource(path: string) {
  return {
    path,
    html: await highlight((await readInstallLines(path)).join("\n")),
  }
}

export {
  getDocsInstallPreview,
  getDocsInstallSource,
  getDocsSourceHref,
  getDocsSourceUrl,
}

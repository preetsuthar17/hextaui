import fs from "node:fs"
import path from "node:path"

import {
  bulkRedirectsCsv,
  parseRedirects,
  wwwRedirects,
} from "../lib/redirects.ts"
import { siteUrl } from "../lib/site.ts"

const root = path.resolve(import.meta.dirname, "..")
const outDir = path.join(root, "cloudflare")
const wwwHost = `www.${new URL(siteUrl).host}`

const lists = wwwRedirects(
  parseRedirects(fs.readFileSync(path.join(root, "public/_redirects"), "utf8")),
  wwwHost,
  siteUrl
)

fs.mkdirSync(outDir, { recursive: true })
for (const [name, redirects] of Object.entries(lists)) {
  const file = path.join(outDir, `www-${name}`)
  fs.writeFileSync(
    `${file}.json`,
    `${JSON.stringify(
      redirects.map((redirect) => ({ redirect })),
      null,
      2
    )}\n`
  )
  fs.writeFileSync(`${file}.csv`, `${bulkRedirectsCsv(redirects)}\n`)
  console.log(`${path.relative(root, file)}: ${redirects.length} redirects`)
}

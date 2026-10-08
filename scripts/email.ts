import { execFileSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

const [command, date, to] = process.argv.slice(2)
const templates = [
  "release",
  "welcome",
  "purchase-solo",
  "purchase-team",
  "team-invite",
]
const baseUrl = process.env.HEXTAUI_URL ?? "https://hextaui.com"
const token = process.env.EMAIL_ADMIN_TOKEN

const usage = `Usage: pnpm email <preview|count|test|send> [changelog-date|template] [to]

  preview                         open every email template in your browser
  preview welcome                 open one template (${templates.join(", ")})
  preview 2026-10-08              open the release email for that changelog entry
  count   2026-10-08              how many subscribed users haven't got it yet
  test    2026-10-08 you@mail.com send it only to one address
  send    2026-10-08              send it to every subscribed user, in batches

Needs EMAIL_ADMIN_TOKEN. HEXTAUI_URL defaults to https://hextaui.com.`

if (
  !command ||
  !token ||
  (command !== "preview" && !date) ||
  (command === "test" && !to)
) {
  console.error(usage)
  process.exit(1)
}

const endpoint = `${baseUrl}/api/admin/broadcast`
const headers = {
  authorization: `Bearer ${token}`,
  "content-type": "application/json",
}

async function post(body: Record<string, unknown>) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ date, ...body }),
  })
  const result = await response.json()
  if (!response.ok && !("sent" in result)) {
    console.error(result)
    process.exit(1)
  }
  return result
}

if (command === "preview") {
  const names = !date ? templates : templates.includes(date) ? [date] : null
  const targets = names
    ? names.map((name) => ({ name, query: `template=${name}` }))
    : [{ name: `release-${date}`, query: `template=release&date=${date}` }]
  for (const { name, query } of targets) {
    const response = await fetch(
      `${baseUrl}/api/admin/email-preview?${query}`,
      {
        headers,
      }
    )
    if (!response.ok) {
      console.error(await response.text())
      process.exit(1)
    }
    const file = path.join(os.tmpdir(), `hextaui-email-${name}.html`)
    fs.writeFileSync(file, await response.text())
    execFileSync(process.platform === "darwin" ? "open" : "xdg-open", [file])
    console.log(file)
  }
} else if (command === "count") {
  console.log(await post({ dryRun: true }))
} else if (command === "test") {
  console.log(await post({ to }))
} else if (command === "send") {
  let total = 0
  for (;;) {
    const result = await post({})
    total += result.sent
    console.log(`sent ${total}, ${result.remaining} left`)
    for (const failure of result.failed) {
      console.log(`  failed ${failure.email}: ${failure.error}`)
    }
    if (result.stopped) {
      console.log(`Stopped: ${result.stopped}. Run send again to resume.`)
      break
    }
    if (result.remaining === 0 || result.sent === 0) break
  }
} else {
  console.error(usage)
  process.exit(1)
}

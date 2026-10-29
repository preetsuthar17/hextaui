const token = process.env.CF_CACHE_TOKEN
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
const commit = process.env.COMMIT_SHA ?? ""
const zoneName = "hextaui.com"
const project = "hextaui"
const ruleRef = "hextaui-preview-html"
const prefix = `${zoneName}/preview/`
const waitLimit = 40 * 60 * 1000
const pollEvery = 20 * 1000

const rule = {
  ref: ruleRef,
  description: "Cache block preview HTML at the edge; purged after each deploy",
  expression: `(http.host eq "${zoneName}" and starts_with(http.request.uri.path, "/preview/"))`,
  action: "set_cache_settings",
  action_parameters: {
    cache: true,
    edge_ttl: { mode: "override_origin", default: 14400 },
    browser_ttl: { mode: "respect_origin" },
  },
  enabled: true,
}

type ApiResult<T> = {
  success: boolean
  result: T
  errors: { code: number; message: string }[]
}

async function api<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  })
  const body = (await response.json()) as ApiResult<T>
  return { status: response.status, ...body }
}

function fail(message: string): never {
  console.error(`edge-cache: ${message}`)
  process.exit(1)
}

async function zoneId() {
  const zones = await api<{ id: string }[]>(`/zones?name=${zoneName}`)
  const id = zones.result?.[0]?.id
  if (!id) fail(`can't read the ${zoneName} zone (${JSON.stringify(zones.errors)})`)
  return id
}

async function ensureRule(zone: string) {
  const phase = `/zones/${zone}/rulesets/phases/http_request_cache_settings/entrypoint`
  const entry = await api<{ id: string; rules?: (typeof rule & { id: string })[] }>(phase)
  if (entry.status === 404) {
    const created = await api(phase, { method: "PUT", body: JSON.stringify({ rules: [rule] }) })
    if (!created.success) fail(`couldn't create the cache ruleset (${JSON.stringify(created.errors)})`)
    console.log("edge-cache: created the preview cache rule")
    return
  }
  if (!entry.success) fail(`couldn't read cache rules (${JSON.stringify(entry.errors)})`)
  const existing = entry.result.rules?.find((item) => item.ref === ruleRef)
  const path = existing
    ? `/zones/${zone}/rulesets/${entry.result.id}/rules/${existing.id}`
    : `/zones/${zone}/rulesets/${entry.result.id}/rules`
  const saved = await api(path, { method: existing ? "PATCH" : "POST", body: JSON.stringify(rule) })
  if (!saved.success) fail(`couldn't save the cache rule (${JSON.stringify(saved.errors)})`)
  console.log(`edge-cache: ${existing ? "updated" : "added"} the preview cache rule`)
}

type Deployment = {
  id: string
  latest_stage: { name: string; status: string }
  deployment_trigger: { metadata: { commit_hash?: string; branch?: string } }
}

async function waitForDeployment() {
  if (!commit) return true
  const started = Date.now()
  while (Date.now() - started < waitLimit) {
    const list = await api<Deployment[]>(
      `/accounts/${accountId}/pages/projects/${project}/deployments?env=production`
    )
    if (!list.success) fail(`couldn't list deployments (${JSON.stringify(list.errors)})`)
    const deployment = list.result.find((item) =>
      item.deployment_trigger.metadata.commit_hash?.startsWith(commit)
    )
    const stage = deployment?.latest_stage
    if (stage?.name === "deploy" && stage.status === "success") {
      console.log(`edge-cache: deployment ${deployment!.id} is live`)
      return true
    }
    if (stage && ["failure", "canceled"].includes(stage.status)) {
      console.log(`edge-cache: deployment ${stage.status} at ${stage.name}, nothing to purge`)
      return false
    }
    console.log(`edge-cache: waiting for ${commit.slice(0, 7)} (${stage ? `${stage.name} ${stage.status}` : "not started"})`)
    await new Promise((resolve) => setTimeout(resolve, pollEvery))
  }
  fail("gave up waiting for the deployment")
}

async function purge(zone: string) {
  const byPrefix = await api(`/zones/${zone}/purge_cache`, {
    method: "POST",
    body: JSON.stringify({ prefixes: [prefix] }),
  })
  if (byPrefix.success) {
    console.log(`edge-cache: purged ${prefix}`)
    return
  }
  console.log(`edge-cache: prefix purge unavailable (${JSON.stringify(byPrefix.errors)}), purging everything`)
  const all = await api(`/zones/${zone}/purge_cache`, {
    method: "POST",
    body: JSON.stringify({ purge_everything: true }),
  })
  if (!all.success) fail(`couldn't purge the cache (${JSON.stringify(all.errors)})`)
  console.log("edge-cache: purged everything")
}

if (!token) fail("CF_CACHE_TOKEN is not set")
if (!accountId) fail("CLOUDFLARE_ACCOUNT_ID is not set")

const zone = await zoneId()
await ensureRule(zone)
if (await waitForDeployment()) await purge(zone)

export {}

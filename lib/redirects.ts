type RedirectRule = { source: string; target: string; status: string }

type BulkRedirect = {
  source_url: string
  target_url: string
  status_code: 301
  preserve_query_string: boolean
  include_subdomains: boolean
  subpath_matching: boolean
  preserve_path_suffix: boolean
}

function parseRedirects(file: string): RedirectRule[] {
  return file
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [source, target, status] = line.split(/\s+/)
      return { source, target, status }
    })
}

function isStaticRule(rule: RedirectRule) {
  return !rule.source.includes(":") && !rule.source.includes("*")
}

function matchesRule(rule: RedirectRule, path: string) {
  const pattern = rule.source
    .split("/")
    .map((segment) =>
      segment === "*"
        ? ".*"
        : segment.startsWith(":")
          ? "[^/]+"
          : segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    )
    .join("/")
  return new RegExp(`^${pattern}$`).test(path)
}

function resolveRedirect(rules: RedirectRule[], path: string) {
  return rules.find((rule) => matchesRule(rule, path))
}

function wwwRedirects(
  rules: RedirectRule[],
  wwwHost: string,
  apexUrl: string
): { legacy: BulkRedirect[]; host: BulkRedirect[] } {
  const base = {
    status_code: 301 as const,
    preserve_query_string: true,
    include_subdomains: false,
  }
  return {
    legacy: rules.filter(isStaticRule).map((rule) => ({
      ...base,
      source_url: `${wwwHost}${rule.source}`,
      target_url: new URL(rule.target, apexUrl).toString(),
      subpath_matching: false,
      preserve_path_suffix: false,
    })),
    host: [
      {
        ...base,
        source_url: `${wwwHost}/`,
        target_url: new URL("/", apexUrl).toString(),
        subpath_matching: true,
        preserve_path_suffix: true,
      },
    ],
  }
}

function bulkRedirectsCsv(redirects: BulkRedirect[]) {
  return redirects
    .map((redirect) =>
      [
        redirect.source_url,
        redirect.target_url,
        redirect.status_code,
        redirect.preserve_query_string,
        redirect.include_subdomains,
        redirect.subpath_matching,
        redirect.preserve_path_suffix,
      ].join(",")
    )
    .join("\n")
}

export {
  bulkRedirectsCsv,
  isStaticRule,
  matchesRule,
  parseRedirects,
  resolveRedirect,
  wwwRedirects,
}
export type { BulkRedirect, RedirectRule }

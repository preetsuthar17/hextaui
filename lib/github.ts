import { siteRepository } from "@/lib/site"

const repositoryPath = new URL(siteRepository).pathname.replace(/^\//, "")

async function getGithubStars() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${repositoryPath}`,
      {
        headers: { Accept: "application/vnd.github+json" },
        signal: AbortSignal.timeout(5000),
      }
    )
    if (!response.ok) {
      return null
    }
    const data: { stargazers_count?: unknown } = await response.json()
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null
  } catch {
    return null
  }
}

function formatStars(stars: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  })
    .format(stars)
    .toLowerCase()
}

export { formatStars, getGithubStars }

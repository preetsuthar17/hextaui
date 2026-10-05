const packageManagers = ["pnpm", "npm", "yarn", "bun"] as const

type PackageManager = (typeof packageManagers)[number]

type PackageCommandMode = "add" | "dlx"

const runners: Record<PackageManager, string> = {
  pnpm: "pnpm dlx",
  npm: "npx",
  yarn: "yarn dlx",
  bun: "bunx --bun",
}

function getCommand(
  manager: PackageManager,
  packages: string[],
  mode: PackageCommandMode
) {
  if (mode === "dlx") {
    return `${runners[manager]} ${packages.join(" ")}`
  }
  const verb = manager === "npm" ? "install" : "add"
  return `${manager} ${verb} ${packages.join(" ")}`
}

export { getCommand, packageManagers }
export type { PackageCommandMode, PackageManager }

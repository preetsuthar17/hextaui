import { execFileSync } from "node:child_process"
import { existsSync } from "node:fs"
import path from "node:path"

const proDir = path.join(process.cwd(), "pro")

function git(args: string[], input?: string) {
  try {
    return execFileSync("git", args, {
      cwd: process.cwd(),
      encoding: "utf8",
      input,
      stdio: ["pipe", "pipe", "ignore"],
    }).trim()
  } catch (error) {
    const stdout = (error as { stdout?: string }).stdout
    return typeof stdout === "string" ? stdout.trim() : null
  }
}

let history: boolean | undefined

function hasHistory() {
  if (history !== undefined) return history
  const shallow = () => git(["rev-parse", "--is-shallow-repository"])
  if (shallow() === "true") {
    try {
      execFileSync(
        "git",
        ["fetch", "--quiet", "--unshallow", "--filter=blob:none"],
        {
          cwd: process.cwd(),
          env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
          stdio: "ignore",
          timeout: 60_000,
        }
      )
    } catch {}
  }
  history = shallow() === "false"
  return history
}

const dates = new Map<string, Date | undefined>()

function commitDate(args: string[], cwd = process.cwd()) {
  const key = `${cwd}\0${args.join("\0")}`
  if (dates.has(key)) return dates.get(key)
  let date: Date | undefined
  try {
    const output = execFileSync("git", ["log", "-1", "--format=%cI", ...args], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim()
    date = output ? new Date(output) : undefined
  } catch {
    date = undefined
  }
  dates.set(key, date)
  return date
}

function sourcesDate(files: string[]) {
  if (!hasHistory()) return undefined
  const existing = files.filter((file) =>
    existsSync(path.resolve(process.cwd(), file))
  )
  return existing.length ? commitDate(["--", ...existing]) : undefined
}

function proDate(paths: string[]) {
  if (!existsSync(path.join(proDir, ".git"))) return undefined
  return commitDate(["--", ...paths], proDir)
}

function isoDate(date: Date | undefined) {
  return date ? date.toISOString().slice(0, 10) : undefined
}

export { commitDate, git, hasHistory, isoDate, proDate, proDir, sourcesDate }

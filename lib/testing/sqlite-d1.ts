import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { DatabaseSync, type SQLInputValue } from "node:sqlite"

import type { D1Database } from "@cloudflare/workers-types"

type Bound = {
  sql: string
  params: SQLInputValue[]
}

function toInput(value: unknown): SQLInputValue {
  if (typeof value === "boolean") return value ? 1 : 0
  if (value === undefined) return null
  return value as SQLInputValue
}

function createSqliteD1() {
  const sqlite = new DatabaseSync(":memory:")
  sqlite.exec("PRAGMA foreign_keys = ON")

  const migrations = path.join(process.cwd(), "drizzle")
  for (const file of readdirSync(migrations)
    .filter((name) => name.endsWith(".sql"))
    .sort()) {
    for (const statement of readFileSync(
      path.join(migrations, file),
      "utf8"
    ).split("--> statement-breakpoint")) {
      if (statement.trim()) sqlite.exec(statement)
    }
  }

  function all({ sql, params }: Bound) {
    const results = sqlite.prepare(sql).all(...params)
    return { results, success: true, meta: {} }
  }

  function statement(bound: Bound) {
    return {
      ...bound,
      bind: (...params: unknown[]) =>
        statement({ sql: bound.sql, params: params.map(toInput) }),
      all: async () => all(bound),
      run: async () => {
        const result = sqlite.prepare(bound.sql).run(...bound.params)
        return { results: [], success: true, meta: { changes: result.changes } }
      },
      first: async () => all(bound).results[0] ?? null,
      raw: async () => {
        const prepared = sqlite.prepare(bound.sql)
        prepared.setReturnArrays(true)
        return prepared.all(...bound.params)
      },
    }
  }

  const database = {
    prepare: (sql: string) => statement({ sql, params: [] }),
    batch: async (statements: Bound[]) => {
      sqlite.exec("BEGIN")
      try {
        const results = statements.map((bound) => all(bound))
        sqlite.exec("COMMIT")
        return results
      } catch (error) {
        sqlite.exec("ROLLBACK")
        throw error
      }
    },
    exec: async (sql: string) => sqlite.exec(sql),
  }

  return { d1: database as unknown as D1Database, sqlite }
}

export { createSqliteD1 }

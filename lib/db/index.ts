import type { D1Database } from "@cloudflare/workers-types"
import { drizzle } from "drizzle-orm/d1"

import * as schema from "@/lib/db/schema"

function getDb(database: D1Database) {
  return drizzle(database, { schema })
}

type Db = ReturnType<typeof getDb>

export { getDb, schema, type Db }

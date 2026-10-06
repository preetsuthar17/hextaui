import { and, desc, eq, lt, or, isNull } from "drizzle-orm"

import { schema, type Db } from "@/lib/db"

const tokenPrefix = "hxt_"
const touchAfter = 1000 * 60 * 60

function encode(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

async function hashToken(token: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token)
  )
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

async function createToken(db: Db, userId: string, name: string) {
  const token = tokenPrefix + encode(crypto.getRandomValues(new Uint8Array(32)))
  const row = {
    id: crypto.randomUUID(),
    userId,
    name,
    hint: `${token.slice(0, 8)}…${token.slice(-4)}`,
    hash: await hashToken(token),
  }
  await db.insert(schema.apiToken).values(row)
  return { token, id: row.id, name: row.name, hint: row.hint }
}

function listTokens(db: Db, userId: string) {
  return db
    .select({
      id: schema.apiToken.id,
      name: schema.apiToken.name,
      hint: schema.apiToken.hint,
      createdAt: schema.apiToken.createdAt,
      lastUsedAt: schema.apiToken.lastUsedAt,
    })
    .from(schema.apiToken)
    .where(eq(schema.apiToken.userId, userId))
    .orderBy(desc(schema.apiToken.createdAt))
}

async function deleteToken(db: Db, userId: string, id: string) {
  const deleted = await db
    .delete(schema.apiToken)
    .where(and(eq(schema.apiToken.id, id), eq(schema.apiToken.userId, userId)))
    .returning({ id: schema.apiToken.id })
  return deleted.length > 0
}

async function findTokenUser(db: Db, token: string) {
  if (!token.startsWith(tokenPrefix)) return null
  const hash = await hashToken(token)
  const row = await db.query.apiToken.findFirst({
    where: eq(schema.apiToken.hash, hash),
  })
  if (!row) return null

  const now = new Date()
  await db
    .update(schema.apiToken)
    .set({ lastUsedAt: now })
    .where(
      and(
        eq(schema.apiToken.id, row.id),
        or(
          isNull(schema.apiToken.lastUsedAt),
          lt(schema.apiToken.lastUsedAt, new Date(now.getTime() - touchAfter))
        )
      )
    )
  return row.userId
}

export { createToken, deleteToken, findTokenUser, listTokens }

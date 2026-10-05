import { createMcpFetch } from "@/lib/mcp-server"

type Env = {
  ASSETS: { fetch: (input: URL) => Promise<Response> }
}

type Context = {
  request: Request
  env: Env
}

let mcpFetch: ReturnType<typeof createMcpFetch> | undefined

export function onRequest({ request, env }: Context) {
  mcpFetch ??= createMcpFetch((path) =>
    env.ASSETS.fetch(new URL(path, request.url))
  )
  return mcpFetch(request)
}

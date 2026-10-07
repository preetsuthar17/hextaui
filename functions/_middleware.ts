import { handleAgentRequest } from "@/lib/agent-http"

type Context = {
  request: Request
  next: () => Promise<Response>
  env: { ASSETS: { fetch: (input: URL) => Promise<Response> } }
}

export function onRequest({ request, next, env }: Context) {
  return handleAgentRequest(request, next, (path) =>
    env.ASSETS.fetch(new URL(path, request.url))
  )
}

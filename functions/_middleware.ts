import { handleAgentRequest } from "@/lib/agent-http"
import { trackAgent } from "@/lib/minilytics-agents"

type Context = {
  request: Request
  next: () => Promise<Response>
  waitUntil: (promise: Promise<unknown>) => void
  env: {
    ASSETS: { fetch: (input: URL) => Promise<Response> }
    MINILYTICS_API_KEY?: string
  }
}

export async function onRequest({ request, next, env, waitUntil }: Context) {
  const response = await handleAgentRequest(request, next, (path) =>
    env.ASSETS.fetch(new URL(path, request.url))
  )
  trackAgent(request, waitUntil, env.MINILYTICS_API_KEY, response.status)
  return response
}

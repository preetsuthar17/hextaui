import { getAuth, type AuthEnv } from "@/lib/auth"

type Context = {
  request: Request
  env: AuthEnv
}

export function onRequest({ request, env }: Context) {
  return getAuth(env).handler(request)
}

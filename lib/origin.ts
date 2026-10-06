function isSameOrigin(request: Request, baseUrl: string) {
  return request.headers.get("origin") === new URL(baseUrl).origin
}

export { isSameOrigin }

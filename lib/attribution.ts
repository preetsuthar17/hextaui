type AttributionMetadata = {
  ml_visitor_id: string
  ml_session_id: string
}

function readCookie(header: string, name: string) {
  for (const part of header.split(";")) {
    const index = part.indexOf("=")
    if (index === -1 || part.slice(0, index).trim() !== name) continue
    try {
      const value = decodeURIComponent(part.slice(index + 1).trim())
      return /^[\w-]{1,64}$/.test(value) ? value : ""
    } catch {
      return ""
    }
  }
  return ""
}

function attributionMetadata(request: Request): AttributionMetadata {
  const header = request.headers.get("cookie") ?? ""
  return {
    ml_visitor_id: readCookie(header, "ml_vid"),
    ml_session_id: readCookie(header, "ml_sid"),
  }
}

export { attributionMetadata, type AttributionMetadata }

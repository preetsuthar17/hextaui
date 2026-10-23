function toBase64Url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "")
}

function fromBase64Url(value: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/")
  try {
    return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0))
  } catch {
    return null
  }
}

export { fromBase64Url, toBase64Url }

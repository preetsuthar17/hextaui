const signedInKey = "hextaui-signed-in"

function readSignedIn() {
  try {
    return localStorage.getItem(signedInKey) === "1"
  } catch {
    return false
  }
}

function writeSignedIn(signedIn: boolean) {
  try {
    if (signedIn) localStorage.setItem(signedInKey, "1")
    else localStorage.removeItem(signedInKey)
  } catch {}
}

export { readSignedIn, writeSignedIn }

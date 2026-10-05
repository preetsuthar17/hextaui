import { readFile } from "node:fs/promises"
import path from "node:path"

async function readDocsSource(file: string) {
  return readFile(path.join(process.cwd(), file), "utf8")
}

export { readDocsSource }

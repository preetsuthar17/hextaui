const freeBlocks: readonly string[] = ["prompt-input"]

function isFreeBlock(name: string) {
  return freeBlocks.includes(name)
}

export { freeBlocks, isFreeBlock }

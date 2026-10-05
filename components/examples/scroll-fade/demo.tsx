const releases = Array.from({ length: 24 }, (_, index) => `v2.${24 - index}.0`)

export function ScrollFadeDemo() {
  return (
    <div className="w-full max-w-xs rounded-xl bg-muted">
      <ul
        tabIndex={0}
        aria-label="Releases"
        className="h-64 scroll-fade overflow-y-auto rounded-xl p-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden"
      >
        {releases.map((release) => (
          <li
            key={release}
            className="flex h-9 items-center justify-between rounded-md px-3"
          >
            <span className="font-mono">{release}</span>
            <span className="text-muted-foreground">Released</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

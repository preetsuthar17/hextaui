import { IconArrowUpRight } from "@tabler/icons-react"

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center p-6 text-center lowercase">
      <h1 className="text-xl font-[520] text-pretty tracking-tight">
        We’ve retired the old HextaUI and are creating something better.
      </h1>
      <a
        href="https://twitter.com/preetsuthar17"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 min-h-10 text-sm underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current "
      >
        stay tuned for updates
        <IconArrowUpRight
          aria-hidden="true"
          className="ms-1 inline-block align-[-0.15em]"
          size={14}
          stroke={1.75}
        />
      </a>
    </main>
  )
}

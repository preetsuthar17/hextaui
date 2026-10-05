import * as React from "react"
import Link from "next/link"

import { DocsCodeBlock } from "@/components/docs/docs-code-block"
import { DocsCommand } from "@/components/docs/docs-command"
import { DocsSection } from "@/components/docs/docs-content"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getRegistryItemUrl,
  getRegistryKind,
  getRegistrySlug,
} from "@/lib/docs-registry"
import { readDocsSource } from "@/lib/docs-source"

function DocsStep({
  step,
  title,
  children,
}: {
  step: number
  title: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <li className="group/step grid min-w-0 grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3">
      <div aria-hidden="true" className="flex flex-col items-center">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs text-muted-foreground">
          {step}
        </span>
        <span className="my-2 w-px flex-1 bg-border group-last/step:hidden" />
      </div>
      <div className="flex min-w-0 flex-col gap-3 pb-10 group-last/step:pb-0">
        <p className="text-base/6 font-medium">{title}</p>
        {children}
      </div>
    </li>
  )
}

async function DocsInstall({
  dependencies,
  files,
}: {
  dependencies: string[]
  files: string[]
}) {
  const sources = await Promise.all(
    files.map(async (file) => ({ file, code: await readDocsSource(file) }))
  )
  const registryUrl = getRegistryItemUrl(getRegistrySlug(files))
  const kind = getRegistryKind(files)
  const steps: {
    key: string
    title: React.ReactNode
    children?: React.ReactNode
  }[] = [
    ...(kind === "component"
      ? [
          {
            key: "theme",
            title: (
              <>
                Add the{" "}
                <Link
                  href="/docs/installation#theme"
                  className="underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground"
                >
                  theme tokens
                </Link>{" "}
                to your global CSS, if you haven’t yet.
              </>
            ),
          },
        ]
      : []),
    ...(dependencies.length > 0
      ? [
          {
            key: "dependencies",
            title: "Install the dependencies.",
            children: <DocsCommand packages={dependencies} />,
          },
        ]
      : []),
    {
      key: "source",
      title: "Copy and paste the following code into your project.",
      children: sources.map((source) => (
        <DocsCodeBlock
          key={source.file}
          title={source.file}
          code={source.code}
          collapsible
        />
      )),
    },
    {
      key: "paths",
      title: "Update the import paths to match your project setup.",
    },
  ]

  return (
    <DocsSection title="Installation">
      <Tabs defaultValue="cli">
        <TabsList variant="line" aria-label="Installation method">
          <TabsTrigger value="cli">CLI</TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
        </TabsList>
        <TabsContent value="cli">
          <div className="flex flex-col gap-3">
            <DocsCommand
              mode="dlx"
              packages={["shadcn@latest", "add", registryUrl]}
            />
            <p className="text-sm/6 text-pretty text-muted-foreground">
              {kind === "component"
                ? "Adds the component, the HextaUI theme tokens and any HextaUI components it depends on."
                : `Adds the ${kind} and anything it depends on to your project.`}
            </p>
          </div>
        </TabsContent>
        <TabsContent value="manual" keepMounted>
          <ol className="flex flex-col">
            {steps.map((step, index) => (
              <DocsStep key={step.key} step={index + 1} title={step.title}>
                {step.children}
              </DocsStep>
            ))}
          </ol>
        </TabsContent>
      </Tabs>
    </DocsSection>
  )
}

export { DocsInstall }

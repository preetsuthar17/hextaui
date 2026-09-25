# HextaUI

Beautiful components built on top of shadcn/ui.

## Local development

```bash
pnpm install
pnpm dev
```

## Cloudflare Pages

This project uses Next.js static export for fast, globally cacheable delivery.

- Framework preset: `Next.js (Static HTML Export)`
- Build command: `pnpm build`
- Build output directory: `out`
- Production branch: `main`

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```

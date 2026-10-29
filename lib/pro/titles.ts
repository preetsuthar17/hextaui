import type { ProBlock } from "@/lib/pro/catalog"

const proBlockTitles: Record<string, string> = {
  "address-form": "Address Form that adapts per country for React",
  "agent-todos": "AI Agent Plan & Todo List block for React & shadcn/ui",
  "api-keys": "API Keys Settings Page block for React & shadcn/ui",
  appearance: "Appearance Settings block for React & shadcn/ui",
  artifact: "AI Artifact Preview Panel for React & shadcn/ui",
  billing: "Billing & Usage Page block for React & shadcn/ui",
  cart: "Shopping Cart drawer & add to bag for React",
  "chat-sidebar": "AI Chat Sidebar block for React & shadcn/ui",
  "chat-thread": "AI Chat Thread block for React & shadcn/ui",
  checkout: "One-page Checkout block for React & shadcn/ui",
  "code-block": "AI Code Block with streaming highlighting for React",
  "commerce-dashboard": "E-commerce Admin Dashboard template for React",
  "diff-review": "AI Code Diff Review block for React & shadcn/ui",
  "discount-builder": "Discount Code Builder for React & shadcn/ui",
  "hexta-ai": "HextaAI: complete AI chat app template for React",
  inventory: "Inventory Table with inline editing for React",
  markdown: "Streaming Markdown for AI chat in React & shadcn/ui",
  memory: "AI Memory Manager block for React & shadcn/ui",
  models: "AI Model Settings block for React & shadcn/ui",
  notifications: "Notification Settings block for React & shadcn/ui",
  "order-detail": "Order Detail admin page for React & shadcn/ui",
  "order-status": "Order Confirmation & Tracking for React",
  "order-summary": "Order Summary with promo codes for React",
  "orders-table": "Orders Table for an e-commerce admin in React",
  payment: "Checkout Payment step with card form for React",
  price: "Product Price with sales & currencies for React",
  "product-card": "Product Card & grid for React & shadcn/ui",
  "product-editor": "Product Editor with variants & media for React",
  "product-filters": "Product Filters & faceted search for React",
  "product-gallery": "Product Image Gallery with zoom for React",
  "product-search": "Product Search with suggestions for React",
  profile: "Profile Settings block for React & shadcn/ui",
  "prompt-input": "Prompt Input: AI chat input for React & shadcn/ui",
  "prompt-library": "AI Prompt Library with variables for React",
  refund: "Order Refund flow for React & shadcn/ui",
  reviews: "Product Reviews & ratings block for React",
  "sales-overview": "Sales Overview analytics dashboard for React",
  "save-bar": "Floating Save Bar for unsaved changes in React",
  security: "Security & Sessions Settings for React & shadcn/ui",
  settings: "AI Product Settings Page block for React & shadcn/ui",
  "shipping-methods": "Shipping Methods & delivery dates for React",
  "stack-trace": "AI Stack Trace and error view for React & shadcn/ui",
  streaming: "Streaming Text for AI responses in React & shadcn/ui",
  subagents: "AI Subagents UI block for React & shadcn/ui",
  team: "Team Members & Invites block for React & shadcn/ui",
  "test-results": "AI Test Results UI block for React & shadcn/ui",
  thinking: "AI Thinking & Reasoning block for React & shadcn/ui",
  "tool-calls": "AI Tool Calls UI block for React & shadcn/ui",
  "variant-picker": "Product Variant Picker: swatches & sizes for React",
  "voice-mode": "AI Voice Mode UI block for React & shadcn/ui",
  workflow: "AI Workflow Builder canvas block for React & shadcn/ui",
}

function getProBlockTitle(block: Pick<ProBlock, "name" | "title">) {
  return (
    proBlockTitles[block.name] ?? `${block.title} block for React & shadcn/ui`
  )
}

export { getProBlockTitle, proBlockTitles }

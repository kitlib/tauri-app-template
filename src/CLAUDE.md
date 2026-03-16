[Root](../CLAUDE.md) > **src**

# Frontend Module (src)

## Responsibilities

UI rendering, interaction, and styling. Built with React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui.

## Entry Points

- **Entry**: `main.tsx`
- **Main Component**: `App.tsx`
- **Build Tool**: Vite 7
- **Dev Port**: 1420

```bash
pnpm dev        # Frontend dev server only
pnpm tauri dev  # Full Tauri app development
```

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.1.0 | UI framework |
| @tauri-apps/api | ^2 | Tauri frontend API |
| tailwindcss | ^4.2.1 | CSS framework |
| lucide-react | ^0.577.0 | Icon library |
| typescript | ~5.8.3 | TypeScript compiler |
| vite | ^7.0.4 | Build tool |
| prettier | ^3.8.1 | Code formatter |

## Configuration

- `../tsconfig.json` - TypeScript strict mode
- `../vite.config.ts` - Vite build config with `@/` alias
- `../components.json` - shadcn/ui config

### Path Alias

```typescript
// Configured in tsconfig.json
"@/*": ["./src/*"]

// Usage
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

## Tauri API Usage

```typescript
import { invoke } from "@tauri-apps/api/core";

const result = await invoke("greet", { name: "World" });
// Returns: "Hello, World! You've been greeted from Rust!"
```

## Code Quality

```bash
pnpm format        # Format code
pnpm format:check  # Check formatting
```

## Common Tasks

### Add shadcn/ui Components

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add dialog
```

### Add Routing

1. Install: `pnpm add react-router-dom`
2. Create `src/pages/` directory
3. Configure routes in `App.tsx`

## File Structure

```
src/
├── main.tsx          # Entry point
├── App.tsx           # Main app component
├── App.css           # App styles
├── index.css         # Global styles + Tailwind theme
├── vite-env.d.ts     # Vite type declarations
├── assets/           # Static assets
├── components/ui/    # shadcn/ui components
└── lib/utils.ts      # Utility functions
```

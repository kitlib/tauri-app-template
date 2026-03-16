# Tauri App Template

## Project Overview

Modern desktop application template built with Tauri v2 + React 19 + TypeScript + shadcn/ui.

## Architecture

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui
- **Backend**: Tauri v2 (Rust)
- **Build**: pnpm + Vite + Cargo

## Module Index

| Module | Path | Tech Stack | Responsibility |
|--------|------|------------|----------------|
| Frontend | `src/` | TypeScript/React | UI, components, styles |
| Backend | `src-tauri/` | Rust | System calls, native features |

## Development

### Prerequisites

- Node.js >= 18
- pnpm >= 9
- Rust >= 1.70

### Commands

```bash
pnpm install        # Install dependencies
pnpm tauri dev      # Start dev server
pnpm tauri build    # Build for production
pnpm format         # Format code
```

## Coding Standards

### TypeScript/React

- TypeScript strict mode
- Function components with Hooks
- Path alias: `@/` maps to `src/`
- Format with Prettier

### Rust

- Follow Rust naming conventions
- Use `#[tauri::command]` macro for Tauri commands

### Styling

- Tailwind CSS v4
- shadcn/ui component system
- CSS variables for theming (light/dark mode)

## Key Conventions

1. **Add Components**: `pnpm dlx shadcn@latest add <component>`
2. **Path Alias**: Use `@/` prefix, e.g., `import { Button } from "@/components/ui/button"`
3. **Tauri Commands**: Define in `src-tauri/src/lib.rs`, call with `invoke()`

### Example: Tauri Command

```typescript
// Frontend
import { invoke } from "@tauri-apps/api/core";
const result = await invoke("command_name", { arg1: value });
```

```rust
// Backend (src-tauri/src/lib.rs)
#[tauri::command]
fn command_name(arg1: &str) -> String {
    format!("Result: {}", arg1)
}
```

---

## Frontend Module (src)

### Responsibilities

UI rendering, interaction, and styling.

### Entry Points

- **Entry**: `src/main.tsx`
- **Main Component**: `src/App.tsx`
- **Build Tool**: Vite (`vite.config.ts`)

### Key Dependencies

- react@19.1.0, react-dom@19.1.0
- @tauri-apps/api@2, @tauri-apps/plugin-opener@2
- tailwindcss@4.2.1, shadcn/ui components
- lucide-react@0.577.0 (icons)

### Configuration

- `tsconfig.json` - TypeScript config (strict mode)
- `vite.config.ts` - Vite build config
- `components.json` - shadcn/ui config

---

## Backend Module (src-tauri)

### Responsibilities

System-level calls, native features, cross-platform desktop app wrapper.

### Entry Points

- **Entry**: `src-tauri/src/main.rs`
- **App Logic**: `src-tauri/src/lib.rs`
- **Build Config**: `Cargo.toml`

### Commands

| Command | Parameters | Returns | Description |
|---------|------------|---------|-------------|
| `greet` | `name: &str` | `String` | Example greeting command |

### Key Dependencies

- tauri@2 - Tauri framework
- tauri-plugin-opener@2 - Open external links
- serde@1, serde_json@1 - Serialization

### Configuration

- `tauri.conf.json` - Tauri app config
- `capabilities/default.json` - Permissions config

**Key Settings**:
- Product: `tauri-app-template`
- Identifier: `com.template.tauri-app`
- Window: 800x600
- Dev Port: 1420

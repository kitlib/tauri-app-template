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
| Frontend | `src/` | TypeScript/React | UI, components, styles, i18n |
| Backend | `src-tauri/` | Rust | System calls, native features |
| Documentation | `docs/` | Markdown | Project guides and references |

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
- **Comments and logs MUST be in English only**
- Keep code clean and minimal

### Rust

- Follow Rust naming conventions
- Use `#[tauri::command]` macro for Tauri commands
- **Comments and logs MUST be in English only**

### Styling

- Tailwind CSS v4
- shadcn/ui component system
- CSS variables for theming (light/dark mode)

### Code Quality Rules

1. **Language**: All comments, console logs, and error messages MUST be in English
2. **Cleanliness**: Remove unnecessary code, avoid redundant implementations
3. **Simplicity**: Follow KISS principle - keep implementations straightforward

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
- i18next, react-i18next (internationalization)

### Configuration

- `tsconfig.json` - TypeScript config (strict mode)
- `vite.config.ts` - Vite build config
- `components.json` - shadcn/ui config
- `src/i18n/index.ts` - i18n configuration

### Internationalization

The project uses i18next for multi-language support:

```typescript
// Usage in components
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t("app.title")}</h1>
      <button onClick={() => i18n.changeLanguage("zh")}>
        Switch Language
      </button>
    </div>
  );
}
```

**Supported Languages**: English (en), Chinese (zh)

**Translation Files**: `src/i18n/locales/{en,zh}.json`

See [I18N Documentation](./docs/I18N.md) for detailed usage.

### Toast Notifications

The project uses sonner (via shadcn/ui) for toast notifications:

```typescript
// Import toast function
import { toast } from "sonner";

// Show success toast
toast.success("Operation completed!");

// Show error toast
toast.error("Something went wrong!");

// Show info toast
toast.info("Information message");

// Show warning toast
toast.warning("Warning message");

// With i18n support
import { useTranslation } from "react-i18next";
const { t } = useTranslation();
toast.success(t("settings.shortcut.setSuccess", { shortcut: "Ctrl+Shift+A" }));
```

**Setup Requirements**:
1. Add `<Toaster />` component to your page/app root
2. Import from `@/components/ui/sonner`

**Example**:
```typescript
import { Toaster } from "@/components/ui/sonner";

export default function Settings() {
  return (
    <ThemeProvider>
      <Toaster />
      <SettingsContent />
    </ThemeProvider>
  );
}
```

**Features**:
- Auto-adapts to light/dark theme
- Supports i18n with variable interpolation
- Auto-dismisses after duration (default: 4s)
- Customizable icons and styling

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

---

## Documentation (docs)

### Available Guides

- **AUTO_UPDATE.md** - Tauri auto-update configuration and GitHub Actions setup
- **I18N.md** - Internationalization guide (English)
- **I18N.zh-CN.md** - 国际化指南（中文）

### Adding Documentation

When adding new features, create corresponding documentation:

1. Create English version: `docs/FEATURE.md`
2. Create Chinese version: `docs/FEATURE.zh-CN.md`
3. Update README.md and README.zh-CN.md if needed
